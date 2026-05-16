import {calculateContrast as contrastRatio, isValidHexColor} from './colors';
import {DesignSettings, QRType, ValidationResult} from '../types';

const URL_PATTERN = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}([/?#][^\s]*)?$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+]?[\d\s().-]{5,24}$/;

const TYPE_LABELS: Record<QRType, string> = {
  website: 'Website URL',
  text: 'Plain Text',
  contact: 'Contact Card',
  wifi: 'Wi-Fi',
  email: 'Email',
  phone: 'Phone',
  sms: 'SMS',
  calendar: 'Calendar Event',
  location: 'Location',
  social: 'Social/Profile',
  custom: 'Custom Payload',
};

const SOCIAL_BASES: Record<string, string> = {
  Instagram: 'https://instagram.com/',
  X: 'https://x.com/',
  LinkedIn: 'https://linkedin.com/in/',
  Facebook: 'https://facebook.com/',
  TikTok: 'https://tiktok.com/@',
  YouTube: 'https://youtube.com/@',
  Website: 'https://',
};

export const getQrTypeLabel = (type: QRType): string => TYPE_LABELS[type] ?? 'QR Code';

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const rawText = (value: unknown): string => (typeof value === 'string' ? value : '');

const addWarningForLength = (payload: string, warnings: string[]) => {
  if (payload.length > 900) {
    warnings.push('This QR payload is long. Test the exported design before printing.');
  } else if (payload.length > 500) {
    warnings.push('Long QR payloads can be harder to scan at small sizes.');
  }
};

export const normalizeUrl = (input: string): string => {
  const value = text(input);
  if (!value) {
    return '';
  }
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  return `https://${value}`;
};

const escapeVCard = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');

const escapeWifi = (value: string): string =>
  value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/:/g, '\\:');

const compactPhone = (value: string): string => value.replace(/[^\d+]/g, '');

const formatCalendarDate = (date: Date): string =>
  date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

const parseDateInput = (value: string): Date | null => {
  const cleaned = text(value);
  if (!cleaned) {
    return null;
  }
  const normalized = cleaned.includes('T') ? cleaned : cleaned.replace(' ', 'T');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const buildVCard = (fields: Record<string, unknown>): string => {
  const name = text(fields.name);
  const organization = text(fields.organization);
  const phone = text(fields.phone);
  const email = text(fields.email);
  const website = normalizeUrl(text(fields.website));
  const address = text(fields.address);
  const notes = text(fields.notes);
  const displayName = name || organization;
  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
  if (displayName) {
    lines.push(`FN:${escapeVCard(displayName)}`);
  }
  if (organization) {
    lines.push(`ORG:${escapeVCard(organization)}`);
  }
  if (phone) {
    lines.push(`TEL:${escapeVCard(phone)}`);
  }
  if (email) {
    lines.push(`EMAIL:${escapeVCard(email)}`);
  }
  if (website) {
    lines.push(`URL:${escapeVCard(website)}`);
  }
  if (address) {
    lines.push(`ADR:;;${escapeVCard(address)};;;;`);
  }
  if (notes) {
    lines.push(`NOTE:${escapeVCard(notes)}`);
  }
  lines.push('END:VCARD');
  return lines.join('\n');
};

export const buildWifiPayload = (fields: Record<string, unknown>): string => {
  const ssid = text(fields.ssid);
  const security = text(fields.security) || 'WPA';
  const password = rawText(fields.password);
  const type = security === 'None' ? 'nopass' : security;
  const passwordPart = security === 'None' ? '' : `P:${escapeWifi(password)};`;
  return `WIFI:T:${type};S:${escapeWifi(ssid)};${passwordPart}H:false;;`;
};

export const buildEmailPayload = (fields: Record<string, unknown>): string => {
  const email = text(fields.email);
  const subject = rawText(fields.subject);
  const body = rawText(fields.body);
  const params = new URLSearchParams();
  if (subject) {
    params.append('subject', subject);
  }
  if (body) {
    params.append('body', body);
  }
  const query = params.toString();
  return query ? `mailto:${email}?${query}` : `mailto:${email}`;
};

export const buildSmsPayload = (fields: Record<string, unknown>): string => {
  const phone = compactPhone(text(fields.phone));
  const message = rawText(fields.message);
  return message ? `sms:${phone}?body=${encodeURIComponent(message)}` : `sms:${phone}`;
};

export const buildCalendarPayload = (fields: Record<string, unknown>): string => {
  const title = text(fields.title);
  const start = parseDateInput(text(fields.start));
  const end = parseDateInput(text(fields.end));
  const location = text(fields.location);
  const notes = rawText(fields.notes);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Old Alex Hub//QRCanvas//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@qrcanvas.local`,
    `DTSTAMP:${formatCalendarDate(new Date())}`,
    `DTSTART:${formatCalendarDate(start ?? new Date())}`,
  ];
  if (end) {
    lines.push(`DTEND:${formatCalendarDate(end)}`);
  }
  lines.push(`SUMMARY:${escapeVCard(title)}`);
  if (location) {
    lines.push(`LOCATION:${escapeVCard(location)}`);
  }
  if (notes) {
    lines.push(`DESCRIPTION:${escapeVCard(notes)}`);
  }
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\n');
};

export const buildLocationPayload = (fields: Record<string, unknown>): string => {
  const mode = text(fields.mode) || 'coords';
  if (mode === 'url') {
    return normalizeUrl(text(fields.mapUrl));
  }
  const latitude = text(fields.latitude);
  const longitude = text(fields.longitude);
  return `https://maps.google.com/?q=${encodeURIComponent(`${latitude},${longitude}`)}`;
};

const normalizeSocial = (fields: Record<string, unknown>): string => {
  const platform = text(fields.platform) || 'Website';
  const input = text(fields.profile);
  if (/^https?:\/\//i.test(input)) {
    return input;
  }
  if (URL_PATTERN.test(input)) {
    return normalizeUrl(input);
  }
  const handle = input.replace(/^@/, '').replace(/^\/+/, '');
  const base = SOCIAL_BASES[platform] ?? 'https://';
  return `${base}${handle}`;
};

type BuildPayloadResult = {
  payload: string;
  displaySummary: string;
  normalizedFields: Record<string, string | boolean | null | undefined>;
};

export const buildPayload = (
  type: QRType,
  fields: Record<string, string | boolean | null | undefined>,
): BuildPayloadResult => {
  switch (type) {
    case 'website': {
      const url = normalizeUrl(text(fields.url));
      return {payload: url, displaySummary: url, normalizedFields: {...fields, url}};
    }
    case 'text': {
      const body = rawText(fields.text);
      return {payload: body, displaySummary: body.slice(0, 80), normalizedFields: {...fields, text: body}};
    }
    case 'contact': {
      const payload = buildVCard(fields);
      const summary = text(fields.name) || text(fields.organization) || 'Contact card';
      return {payload, displaySummary: summary, normalizedFields: {...fields}};
    }
    case 'wifi': {
      const security = text(fields.security) || 'WPA';
      const payload = buildWifiPayload({...fields, security});
      return {
        payload,
        displaySummary: `${text(fields.ssid)} ${security === 'None' ? '(open)' : '(protected)'}`,
        normalizedFields: {...fields, security},
      };
    }
    case 'email': {
      const payload = buildEmailPayload(fields);
      return {payload, displaySummary: text(fields.email), normalizedFields: {...fields}};
    }
    case 'phone': {
      const phone = compactPhone(text(fields.phone));
      return {payload: `tel:${phone}`, displaySummary: phone, normalizedFields: {...fields, phone}};
    }
    case 'sms': {
      const payload = buildSmsPayload(fields);
      return {payload, displaySummary: text(fields.phone), normalizedFields: {...fields}};
    }
    case 'calendar': {
      const payload = buildCalendarPayload(fields);
      return {payload, displaySummary: text(fields.title), normalizedFields: {...fields}};
    }
    case 'location': {
      const mode = text(fields.mode) || 'coords';
      const payload = buildLocationPayload({...fields, mode});
      return {
        payload,
        displaySummary: mode === 'url' ? text(fields.mapUrl) : `${text(fields.latitude)}, ${text(fields.longitude)}`,
        normalizedFields: {...fields, mode},
      };
    }
    case 'social': {
      const profile = normalizeSocial(fields);
      return {payload: profile, displaySummary: profile, normalizedFields: {...fields, profile}};
    }
    case 'custom': {
      const body = rawText(fields.text);
      return {payload: body, displaySummary: body.slice(0, 80), normalizedFields: {...fields, text: body}};
    }
    default:
      return {payload: '', displaySummary: '', normalizedFields: fields};
  }
};

export const validatePayload = (
  type: QRType,
  fields: Record<string, string | boolean | null | undefined>,
): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (type === 'website') {
    const rawUrl = text(fields.url);
    const normalized = normalizeUrl(rawUrl);
    if (!rawUrl) {
      errors.push('Website URL is required.');
    } else if (!URL_PATTERN.test(rawUrl) && !URL_PATTERN.test(normalized)) {
      errors.push('Enter a valid website URL or domain.');
    } else if (!rawUrl.includes('.') || rawUrl.endsWith('.')) {
      warnings.push('The URL looks incomplete. Check it before exporting.');
    }
  }

  if (type === 'text' || type === 'custom') {
    const body = rawText(fields.text);
    if (!body.trim()) {
      errors.push('Text is required.');
    }
    if (body.length > 500) {
      warnings.push('Very long text can create dense QR codes.');
    }
  }

  if (type === 'contact') {
    if (!text(fields.name) && !text(fields.organization)) {
      errors.push('Enter at least a name or organization.');
    }
    if (text(fields.email) && !EMAIL_PATTERN.test(text(fields.email))) {
      errors.push('Enter a valid contact email address.');
    }
    if (text(fields.website) && !URL_PATTERN.test(normalizeUrl(text(fields.website)))) {
      errors.push('Enter a valid contact website.');
    }
  }

  if (type === 'wifi') {
    const security = text(fields.security) || 'WPA';
    if (!text(fields.ssid)) {
      errors.push('Network name is required.');
    }
    if (security !== 'None' && !rawText(fields.password)) {
      warnings.push('Protected Wi-Fi QR codes usually need a password.');
    }
    if (security !== 'None' && rawText(fields.password)) {
      warnings.push('The Wi-Fi QR may contain the password you enter. It stays local unless you export or share it.');
    }
  }

  if (type === 'email') {
    if (!text(fields.email)) {
      errors.push('Email address is required.');
    } else if (!EMAIL_PATTERN.test(text(fields.email))) {
      errors.push('Enter a valid email address.');
    }
  }

  if (type === 'phone' || type === 'sms') {
    if (!text(fields.phone)) {
      errors.push('Phone number is required.');
    } else if (!PHONE_PATTERN.test(text(fields.phone))) {
      errors.push('Enter a valid phone number.');
    }
  }

  if (type === 'calendar') {
    const start = parseDateInput(text(fields.start));
    const end = parseDateInput(text(fields.end));
    if (!text(fields.title)) {
      errors.push('Event title is required.');
    }
    if (!text(fields.start)) {
      errors.push('Start date and time are required.');
    } else if (!start) {
      errors.push('Enter a valid start date and time.');
    }
    if (text(fields.end) && !end) {
      errors.push('Enter a valid end date and time.');
    }
    if (start && end && end.getTime() <= start.getTime()) {
      errors.push('End date and time must be after the start.');
    }
  }

  if (type === 'location') {
    const mode = text(fields.mode) || 'coords';
    if (mode === 'url') {
      const url = normalizeUrl(text(fields.mapUrl));
      if (!text(fields.mapUrl)) {
        errors.push('Map URL is required.');
      } else if (!URL_PATTERN.test(url)) {
        errors.push('Enter a valid map URL.');
      }
    } else {
      const latitude = Number(text(fields.latitude));
      const longitude = Number(text(fields.longitude));
      if (!text(fields.latitude) || !text(fields.longitude)) {
        errors.push('Latitude and longitude are required.');
      } else if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
        errors.push('Latitude must be a number between -90 and 90.');
      } else if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
        errors.push('Longitude must be a number between -180 and 180.');
      }
    }
  }

  if (type === 'social') {
    if (!text(fields.profile)) {
      errors.push('Profile URL or handle is required.');
    }
  }

  let built: BuildPayloadResult = {payload: '', displaySummary: '', normalizedFields: fields};
  if (errors.length === 0) {
    built = buildPayload(type, fields);
    addWarningForLength(built.payload, warnings);
  }

  return {
    status: errors.length ? 'error' : warnings.length ? 'warning' : 'valid',
    errors,
    warnings,
    normalizedFields: built.normalizedFields,
    payload: built.payload,
    displaySummary: built.displaySummary,
  };
};

export const calculateContrast = contrastRatio;

export const validateScannability = (designSettings: DesignSettings) => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const foreground = designSettings.foregroundColor;
  const background = designSettings.backgroundColor;

  if (!isValidHexColor(foreground)) {
    errors.push('QR foreground color must be a valid hex color.');
  }
  if (!isValidHexColor(background)) {
    errors.push('QR background color must be a valid hex color.');
  }
  if (foreground.toLowerCase() === background.toLowerCase()) {
    errors.push('QR foreground and background cannot be the same color.');
  }

  const ratio = errors.length ? 0 : calculateContrast(foreground, background);
  if (ratio > 0 && ratio < 3) {
    warnings.push('QR contrast is low. A darker foreground or lighter background will scan better.');
  }
  if (designSettings.qrSize < 180) {
    warnings.push('Small QR sizes can be harder to scan after export.');
  }
  if (designSettings.centerBadgeType !== 'none' && designSettings.centerBadgeText.trim().length > 4) {
    warnings.push('Keep center badge text short so it does not cover too much of the QR code.');
  }

  return {
    canRender: errors.length === 0,
    errors,
    warnings,
    contrastRatio: ratio,
  };
};
