import {DesignSettings, QRType, Template} from '../types';

export const templates: Template[] = [
  {
    id: 'minimal-white',
    name: 'Minimal White',
    description: 'Crisp, flexible card for text, notes, and everyday sharing.',
    recommendedTypes: ['text', 'custom', 'website'],
    colors: {
      cardBackground: '#FFFFFF',
      foreground: '#151A1F',
      background: '#FFFFFF',
      title: '#151A1F',
      subtitle: '#52616B',
      footer: '#7B8790',
      accent: '#0D6B6E',
    },
    layout: {padding: 24, borderRadius: 18, shadow: true, qrSize: 236, alignment: 'center'},
    previewStyle: 'light',
    isPremiumStyle: false,
  },
  {
    id: 'executive-black',
    name: 'Executive Black',
    description: 'High contrast dark card for premium labels and business use.',
    recommendedTypes: ['website', 'contact', 'phone', 'email'],
    colors: {
      cardBackground: '#111719',
      foreground: '#050708',
      background: '#FFFFFF',
      title: '#FFFFFF',
      subtitle: '#D9E2E6',
      footer: '#AAB6BB',
      accent: '#B8E2E0',
    },
    layout: {padding: 24, borderRadius: 20, shadow: true, qrSize: 232, alignment: 'center'},
    previewStyle: 'dark',
    isPremiumStyle: false,
  },
  {
    id: 'soft-gradient',
    name: 'Soft Gradient',
    description: 'Soft studio look with a fresh accent and calm card colors.',
    recommendedTypes: ['website', 'social', 'custom'],
    colors: {
      cardBackground: '#EAF7F1',
      foreground: '#183A36',
      background: '#FFFFFF',
      title: '#14312F',
      subtitle: '#486B65',
      footer: '#5F7D77',
      accent: '#65A98C',
    },
    layout: {padding: 26, borderRadius: 24, shadow: true, qrSize: 228, alignment: 'center'},
    previewStyle: 'color',
    isPremiumStyle: false,
  },
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    description: 'Warm menu-card style for cafes, pop-ups, and small shops.',
    recommendedTypes: ['website', 'wifi', 'social'],
    colors: {
      cardBackground: '#FFF8EF',
      foreground: '#3A2720',
      background: '#FFFFFF',
      title: '#3A2720',
      subtitle: '#745444',
      footer: '#8F6E5D',
      accent: '#C47A3D',
    },
    layout: {padding: 24, borderRadius: 18, shadow: true, qrSize: 228, alignment: 'left'},
    previewStyle: 'warm',
    isPremiumStyle: false,
  },
  {
    id: 'event-pass',
    name: 'Event Pass',
    description: 'Ticket-inspired layout for calendar links and event details.',
    recommendedTypes: ['calendar', 'location', 'sms'],
    colors: {
      cardBackground: '#F4F0FF',
      foreground: '#26213E',
      background: '#FFFFFF',
      title: '#26213E',
      subtitle: '#5E547D',
      footer: '#716C87',
      accent: '#6F4DD9',
    },
    layout: {padding: 24, borderRadius: 16, shadow: true, qrSize: 232, alignment: 'center'},
    previewStyle: 'color',
    isPremiumStyle: false,
  },
  {
    id: 'wifi-card',
    name: 'Wi-Fi Card',
    description: 'Clear guest Wi-Fi card with friendly connection details.',
    recommendedTypes: ['wifi'],
    colors: {
      cardBackground: '#EEF7FF',
      foreground: '#0A2B45',
      background: '#FFFFFF',
      title: '#0A2B45',
      subtitle: '#3A627D',
      footer: '#5E7890',
      accent: '#2D8FD5',
    },
    layout: {padding: 24, borderRadius: 20, shadow: true, qrSize: 238, alignment: 'center'},
    previewStyle: 'color',
    isPremiumStyle: false,
  },
  {
    id: 'business-card',
    name: 'Business Card',
    description: 'Polished contact-card layout for vCards and introductions.',
    recommendedTypes: ['contact', 'email', 'phone'],
    colors: {
      cardBackground: '#F8FAF8',
      foreground: '#1C2B24',
      background: '#FFFFFF',
      title: '#1C2B24',
      subtitle: '#4D6256',
      footer: '#6C7A70',
      accent: '#4F7C63',
    },
    layout: {padding: 26, borderRadius: 14, shadow: true, qrSize: 226, alignment: 'left'},
    previewStyle: 'light',
    isPremiumStyle: false,
  },
  {
    id: 'creator-link',
    name: 'Creator Link',
    description: 'Bold profile-card styling for social pages and creator links.',
    recommendedTypes: ['social', 'website'],
    colors: {
      cardBackground: '#101828',
      foreground: '#0E1726',
      background: '#FFFFFF',
      title: '#FFFFFF',
      subtitle: '#D6E0EA',
      footer: '#A8B4C2',
      accent: '#F7C948',
    },
    layout: {padding: 24, borderRadius: 24, shadow: true, qrSize: 230, alignment: 'center'},
    previewStyle: 'dark',
    isPremiumStyle: false,
  },
  {
    id: 'modern-blue',
    name: 'Modern Blue',
    description: 'Balanced tech-forward card for product links and documents.',
    recommendedTypes: ['website', 'email', 'custom'],
    colors: {
      cardBackground: '#F0F6FF',
      foreground: '#0F2B4C',
      background: '#FFFFFF',
      title: '#0F2B4C',
      subtitle: '#486987',
      footer: '#6E8498',
      accent: '#2674C6',
    },
    layout: {padding: 24, borderRadius: 18, shadow: true, qrSize: 232, alignment: 'center'},
    previewStyle: 'color',
    isPremiumStyle: false,
  },
  {
    id: 'warm-beige',
    name: 'Warm Beige',
    description: 'Editorial, soft card suited to invitations and family use.',
    recommendedTypes: ['calendar', 'text', 'location'],
    colors: {
      cardBackground: '#FAF3E7',
      foreground: '#2F2A24',
      background: '#FFFFFF',
      title: '#2F2A24',
      subtitle: '#6B5A49',
      footer: '#827161',
      accent: '#B05A2A',
    },
    layout: {padding: 28, borderRadius: 22, shadow: true, qrSize: 224, alignment: 'center'},
    previewStyle: 'warm',
    isPremiumStyle: false,
  },
  {
    id: 'neon-dark',
    name: 'Neon Dark',
    description: 'High contrast nightlife card with a bright accent.',
    recommendedTypes: ['calendar', 'social', 'website'],
    colors: {
      cardBackground: '#0B1020',
      foreground: '#050816',
      background: '#FFFFFF',
      title: '#F5FAFF',
      subtitle: '#B7C5D9',
      footer: '#90A4C3',
      accent: '#37F0C6',
    },
    layout: {padding: 24, borderRadius: 20, shadow: true, qrSize: 230, alignment: 'center'},
    previewStyle: 'dark',
    isPremiumStyle: false,
  },
  {
    id: 'clean-poster',
    name: 'Clean Poster',
    description: 'Spacious print-friendly layout for signs and notices.',
    recommendedTypes: ['website', 'location', 'custom', 'text'],
    colors: {
      cardBackground: '#FFFFFF',
      foreground: '#19202A',
      background: '#FFFFFF',
      title: '#19202A',
      subtitle: '#525E6E',
      footer: '#747F8D',
      accent: '#E0523E',
    },
    layout: {padding: 32, borderRadius: 10, shadow: false, qrSize: 250, alignment: 'center'},
    previewStyle: 'light',
    isPremiumStyle: false,
  },
];

export const getTemplateById = (templateId?: string): Template =>
  templates.find(template => template.id === templateId) ?? templates[0];

export const getRecommendedTemplateId = (qrType: QRType): string => {
  if (qrType === 'wifi') {
    return 'wifi-card';
  }
  if (qrType === 'contact') {
    return 'business-card';
  }
  if (qrType === 'calendar') {
    return 'event-pass';
  }
  if (qrType === 'website' || qrType === 'social') {
    return 'creator-link';
  }
  return 'minimal-white';
};

export const designFromTemplate = (templateId: string): DesignSettings => {
  const template = getTemplateById(templateId);
  return {
    foregroundColor: template.colors.foreground,
    backgroundColor: template.colors.background,
    cardBackground: template.colors.cardBackground,
    titleColor: template.colors.title,
    subtitleColor: template.colors.subtitle,
    footerColor: template.colors.footer,
    borderRadius: template.layout.borderRadius,
    cardPadding: template.layout.padding,
    qrSize: template.layout.qrSize,
    showTitle: true,
    showSubtitle: true,
    showFooter: true,
    centerBadgeType: 'none',
    centerBadgeText: '',
    templateId: template.id,
  };
};
