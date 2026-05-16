import React, {useEffect, useMemo, useState} from 'react';
import {Alert, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Screen} from '../components/Screen';
import {Chip} from '../components/Chip';
import {FormField} from '../components/FormField';
import {PrimaryButton} from '../components/PrimaryButton';
import {theme} from '../data/theme';
import {designFromTemplate, getRecommendedTemplateId} from '../data/templates';
import {useAppState} from '../context/AppState';
import {QRProject, QRType, QR_TYPES} from '../types';
import {createProject} from '../utils/projects';
import {getQrTypeLabel, validatePayload} from '../utils/qr';

const DEFAULT_FIELDS: Record<QRType, Record<string, string>> = {
  website: {url: ''},
  text: {text: ''},
  contact: {name: '', organization: '', phone: '', email: '', website: '', address: '', notes: ''},
  wifi: {ssid: '', password: '', security: 'WPA'},
  email: {email: '', subject: '', body: ''},
  phone: {phone: ''},
  sms: {phone: '', message: ''},
  calendar: {title: '', start: '', end: '', location: '', notes: ''},
  location: {mode: 'coords', latitude: '', longitude: '', mapUrl: ''},
  social: {platform: 'Instagram', profile: ''},
  custom: {text: ''},
};

const TYPE_HELPER: Record<QRType, string> = {
  website: 'Paste a full URL or enter a plain domain. QRCanvas will add https:// when safe.',
  text: 'Use plain text for notes, labels, instructions, or offline messages.',
  contact: 'Create a local vCard payload. Contacts stay on this device unless exported.',
  wifi: 'Create guest network codes. Passwords remain local unless you export or share the QR.',
  email: 'Create a mailto QR with optional subject and message body.',
  phone: 'Create a phone link QR for quick dialing.',
  sms: 'Create an SMS QR with an optional prefilled message.',
  calendar: 'Enter dates as ISO or YYYY-MM-DD HH:mm. End time is optional.',
  location: 'Use manual coordinates or paste a map URL. No location permission is requested.',
  social: 'Enter a handle or a profile URL. Handles are normalized for common platforms.',
  custom: 'Use any payload exactly as entered.',
};

const SOCIAL_PLATFORMS = ['Instagram', 'X', 'LinkedIn', 'Facebook', 'TikTok', 'YouTube', 'Website'];
const WIFI_SECURITY = [
  {label: 'WPA/WPA2', value: 'WPA'},
  {label: 'WEP', value: 'WEP'},
  {label: 'None', value: 'None'},
];

const toFieldMap = (fields?: QRProject['payloadData']['fields']): Record<string, string> => {
  const mapped: Record<string, string> = {};
  Object.entries(fields ?? {}).forEach(([key, value]) => {
    mapped[key] = typeof value === 'string' ? value : value == null ? '' : String(value);
  });
  return mapped;
};

export const CreateScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {settings, projects, saveNewProject, saveExistingProject} = useAppState();
  const editProject = projects.find(project => project.id === route.params?.editProjectId);
  const initialType: QRType = route.params?.qrType ?? editProject?.qrType ?? settings.defaultQrType;
  const [qrType, setQrType] = useState<QRType>(initialType);
  const [fields, setFields] = useState<Record<string, string>>({
    ...DEFAULT_FIELDS[initialType],
    ...toFieldMap(editProject?.payloadData.fields),
  });
  const [projectTitle, setProjectTitle] = useState(editProject?.title ?? '');

  useEffect(() => {
    const nextType: QRType = route.params?.qrType ?? editProject?.qrType ?? settings.defaultQrType;
    setQrType(nextType);
    setFields({...DEFAULT_FIELDS[nextType], ...toFieldMap(editProject?.payloadData.fields)});
    setProjectTitle(editProject?.title ?? '');
  }, [editProject, route.params?.qrType, settings.defaultQrType]);

  const validation = useMemo(() => validatePayload(qrType, fields), [qrType, fields]);
  const characterCount = qrType === 'text' || qrType === 'custom' ? (fields.text ?? '').length : 0;

  const setField = (key: string, value: string) => {
    setFields(current => ({...current, [key]: value}));
  };

  const changeType = (nextType: QRType) => {
    setQrType(nextType);
    setFields(DEFAULT_FIELDS[nextType]);
    setProjectTitle('');
  };

  const buildDraft = (): QRProject | null => {
    const result = validatePayload(qrType, fields);
    if (result.status === 'error' || !result.payload) {
      Alert.alert('Check the form', result.errors.join('\n') || 'Add valid QR content first.');
      return null;
    }
    const templateId =
      editProject?.templateId ??
      route.params?.templateId ??
      getRecommendedTemplateId(qrType) ??
      settings.defaultTemplateId;
    const designSettings = editProject?.designSettings ?? designFromTemplate(templateId);
    const title = projectTitle.trim() || result.displaySummary || getQrTypeLabel(qrType);
    const input = {
      title,
      subtitle: editProject?.subtitle ?? getQrTypeLabel(qrType),
      footerNote: editProject?.footerNote ?? result.displaySummary ?? '',
      qrType,
      payload: result.payload,
      payloadData: {
        type: qrType,
        fields: result.normalizedFields,
        displaySummary: result.displaySummary ?? title,
        validationStatus: result.status,
      },
      templateId,
      designSettings: {...designSettings, templateId},
    };
    if (editProject) {
      return {
        ...editProject,
        ...input,
        updatedAt: new Date().toISOString(),
      };
    }
    return createProject(input);
  };

  const continueToDesign = () => {
    const draft = buildDraft();
    if (!draft) {
      return;
    }
    navigation.navigate('DesignStudio', {draft, projectId: editProject?.id, templateId: draft.templateId});
  };

  const saveDraft = async () => {
    const draft = buildDraft();
    if (!draft) {
      return;
    }
    try {
      if (editProject) {
        await saveExistingProject(editProject.id, draft);
      } else {
        await saveNewProject({
          title: draft.title,
          subtitle: draft.subtitle,
          footerNote: draft.footerNote,
          qrType: draft.qrType,
          payload: draft.payload,
          payloadData: draft.payloadData,
          templateId: draft.templateId,
          designSettings: draft.designSettings,
        });
      }
      Alert.alert('Draft saved', 'Your QR project was saved locally on this device.');
    } catch (error) {
      Alert.alert('Save failed', error instanceof Error ? error.message : 'The draft could not be saved.');
    }
  };

  const clearForm = () => {
    setFields(DEFAULT_FIELDS[qrType]);
    setProjectTitle('');
  };

  const renderForm = () => {
    if (qrType === 'website') {
      return (
        <FormField
          label="Website URL"
          value={fields.url}
          onChangeText={value => setField('url', value)}
          autoCapitalize="none"
          keyboardType="url"
          placeholder="example.com"
        />
      );
    }
    if (qrType === 'text' || qrType === 'custom') {
      return (
        <FormField
          label={qrType === 'text' ? 'Text' : 'Custom payload'}
          value={fields.text}
          onChangeText={value => setField('text', value)}
          multiline
          helper={`${characterCount} characters`}
          placeholder={qrType === 'text' ? 'Enter text to encode' : 'Enter exact payload'}
        />
      );
    }
    if (qrType === 'contact') {
      return (
        <View style={styles.formStack}>
          <FormField label="Name" value={fields.name} onChangeText={value => setField('name', value)} />
          <FormField label="Organization" value={fields.organization} onChangeText={value => setField('organization', value)} />
          <FormField label="Phone" value={fields.phone} onChangeText={value => setField('phone', value)} keyboardType="phone-pad" />
          <FormField label="Email" value={fields.email} onChangeText={value => setField('email', value)} keyboardType="email-address" autoCapitalize="none" />
          <FormField label="Website" value={fields.website} onChangeText={value => setField('website', value)} keyboardType="url" autoCapitalize="none" />
          <FormField label="Address" value={fields.address} onChangeText={value => setField('address', value)} />
          <FormField label="Notes" value={fields.notes} onChangeText={value => setField('notes', value)} multiline />
        </View>
      );
    }
    if (qrType === 'wifi') {
      return (
        <View style={styles.formStack}>
          <FormField label="Network name" value={fields.ssid} onChangeText={value => setField('ssid', value)} />
          <Text style={styles.label}>Security type</Text>
          <View style={styles.chipRow}>
            {WIFI_SECURITY.map(option => (
              <Chip
                key={option.value}
                label={option.label}
                selected={fields.security === option.value}
                onPress={() => setField('security', option.value)}
              />
            ))}
          </View>
          {fields.security !== 'None' ? (
            <FormField label="Password" value={fields.password} onChangeText={value => setField('password', value)} secureTextEntry />
          ) : null}
        </View>
      );
    }
    if (qrType === 'email') {
      return (
        <View style={styles.formStack}>
          <FormField label="Email address" value={fields.email} onChangeText={value => setField('email', value)} keyboardType="email-address" autoCapitalize="none" />
          <FormField label="Subject" value={fields.subject} onChangeText={value => setField('subject', value)} />
          <FormField label="Body" value={fields.body} onChangeText={value => setField('body', value)} multiline />
        </View>
      );
    }
    if (qrType === 'phone') {
      return <FormField label="Phone number" value={fields.phone} onChangeText={value => setField('phone', value)} keyboardType="phone-pad" />;
    }
    if (qrType === 'sms') {
      return (
        <View style={styles.formStack}>
          <FormField label="Phone number" value={fields.phone} onChangeText={value => setField('phone', value)} keyboardType="phone-pad" />
          <FormField label="Message" value={fields.message} onChangeText={value => setField('message', value)} multiline />
        </View>
      );
    }
    if (qrType === 'calendar') {
      return (
        <View style={styles.formStack}>
          <FormField label="Event title" value={fields.title} onChangeText={value => setField('title', value)} />
          <FormField label="Start date and time" value={fields.start} onChangeText={value => setField('start', value)} placeholder="2026-06-12 18:30" />
          <FormField label="End date and time" value={fields.end} onChangeText={value => setField('end', value)} placeholder="2026-06-12 20:00" />
          <FormField label="Location" value={fields.location} onChangeText={value => setField('location', value)} />
          <FormField label="Notes" value={fields.notes} onChangeText={value => setField('notes', value)} multiline />
        </View>
      );
    }
    if (qrType === 'location') {
      return (
        <View style={styles.formStack}>
          <Text style={styles.label}>Location input</Text>
          <View style={styles.chipRow}>
            <Chip label="Coordinates" selected={fields.mode !== 'url'} onPress={() => setField('mode', 'coords')} />
            <Chip label="Map URL" selected={fields.mode === 'url'} onPress={() => setField('mode', 'url')} />
          </View>
          {fields.mode === 'url' ? (
            <FormField label="Map URL" value={fields.mapUrl} onChangeText={value => setField('mapUrl', value)} keyboardType="url" autoCapitalize="none" />
          ) : (
            <View style={styles.formStack}>
              <FormField label="Latitude" value={fields.latitude} onChangeText={value => setField('latitude', value)} keyboardType="numbers-and-punctuation" />
              <FormField label="Longitude" value={fields.longitude} onChangeText={value => setField('longitude', value)} keyboardType="numbers-and-punctuation" />
            </View>
          )}
        </View>
      );
    }
    return (
      <View style={styles.formStack}>
        <Text style={styles.label}>Platform</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
          {SOCIAL_PLATFORMS.map(platform => (
            <Chip key={platform} label={platform} selected={fields.platform === platform} onPress={() => setField('platform', platform)} />
          ))}
        </ScrollView>
        <FormField label="Profile URL or handle" value={fields.profile} onChangeText={value => setField('profile', value)} autoCapitalize="none" />
      </View>
    );
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Create QR</Text>
        <Text style={styles.title}>{editProject ? 'Edit QR content' : 'Choose content type'}</Text>
        <Text style={styles.subtitle}>{TYPE_HELPER[qrType]}</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
        {QR_TYPES.map(type => (
          <Chip key={type} label={getQrTypeLabel(type)} selected={qrType === type} onPress={() => changeType(type)} />
        ))}
      </ScrollView>

      <View style={styles.panel}>
        <FormField
          label="Project title"
          value={projectTitle}
          onChangeText={setProjectTitle}
          placeholder="Optional title for your saved design"
        />
        {renderForm()}
      </View>

      <View style={styles.previewPanel}>
        <Text style={styles.panelTitle}>Payload preview</Text>
        <Text style={styles.payloadText} numberOfLines={6}>
          {validation.payload || 'Complete the form to preview the generated QR payload.'}
        </Text>
        {validation.errors.map(error => (
          <Text key={error} style={styles.errorText}>{error}</Text>
        ))}
        {validation.warnings.map(warning => (
          <Text key={warning} style={styles.warningText}>{warning}</Text>
        ))}
      </View>

      <View style={styles.actions}>
        <PrimaryButton title="Continue to Design" onPress={continueToDesign} disabled={validation.status === 'error'} />
        <PrimaryButton title="Save Draft" onPress={saveDraft} variant="secondary" disabled={validation.status === 'error'} />
        <PrimaryButton title="Clear Form" onPress={clearForm} variant="ghost" />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.ink,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subtitle: {
    color: theme.colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  typeRow: {
    gap: 8,
    paddingRight: 24,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.line,
    padding: 16,
    gap: 16,
  },
  formStack: {
    gap: 12,
  },
  label: {
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  previewPanel: {
    backgroundColor: '#F8FBFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#D8E6E6',
    padding: 16,
    gap: 8,
  },
  panelTitle: {
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  payloadText: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  warningText: {
    color: theme.colors.warning,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
  actions: {
    gap: 10,
  },
});
