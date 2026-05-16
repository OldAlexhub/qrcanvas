import React, {forwardRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import {getTemplateById} from '../data/templates';
import {theme} from '../data/theme';
import {QRProject} from '../types';
import {safeHexColor, withAlpha} from '../utils/colors';

type Props = {
  project: QRProject;
  exportMode?: boolean;
};

export const QRDesignCard = forwardRef<View, Props>(({project, exportMode = false}, ref) => {
  const template = getTemplateById(project.templateId);
  const design = project.designSettings;
  const foreground = safeHexColor(design.foregroundColor, template.colors.foreground);
  const background = safeHexColor(design.backgroundColor, template.colors.background);
  const cardBackground = safeHexColor(design.cardBackground, template.colors.cardBackground);
  const titleColor = safeHexColor(design.titleColor, template.colors.title);
  const subtitleColor = safeHexColor(design.subtitleColor, template.colors.subtitle);
  const footerColor = safeHexColor(design.footerColor, template.colors.footer);
  const qrSize = Math.max(180, Math.min(320, design.qrSize));
  const alignment = template.layout.alignment;
  const badgeText = (design.centerBadgeText || project.title || 'QR')
    .trim()
    .slice(0, 4)
    .toUpperCase();

  return (
    <View
      ref={ref}
      collapsable={false}
      style={[
        styles.card,
        template.layout.shadow && styles.shadow,
        exportMode && styles.exportCard,
        alignment === 'left' ? styles.alignStart : styles.alignCenter,
        {
          backgroundColor: cardBackground,
          borderRadius: design.borderRadius,
          padding: design.cardPadding,
        },
      ]}>
      <View style={[styles.accent, {backgroundColor: withAlpha(template.colors.accent, 0.92)}]} />
      {design.showTitle ? (
        <Text
          style={[
            styles.title,
            alignment === 'left' ? styles.leftText : styles.centerText,
            {color: titleColor},
          ]}
          numberOfLines={2}>
          {project.title || 'Untitled QR'}
        </Text>
      ) : null}
      {design.showSubtitle && project.subtitle ? (
        <Text
          style={[
            styles.subtitle,
            alignment === 'left' ? styles.leftText : styles.centerText,
            {color: subtitleColor},
          ]}
          numberOfLines={3}>
          {project.subtitle}
        </Text>
      ) : null}
      <View style={[styles.qrOuter, {backgroundColor: background}]}>
        <View style={styles.qrInner}>
          <QRCode
            value={project.payload || 'QRCanvas'}
            size={qrSize}
            color={foreground}
            backgroundColor={background}
            ecl="M"
            quietZone={12}
          />
          {design.centerBadgeType !== 'none' ? (
            <View
              pointerEvents="none"
              style={[
                styles.badge,
                {
                  backgroundColor: cardBackground,
                  borderColor: withAlpha(template.colors.accent, 0.8),
                },
              ]}>
              <Text style={[styles.badgeText, {color: titleColor}]}>
                {design.centerBadgeType === 'icon' ? 'QR' : badgeText}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
      {design.showFooter ? (
        <Text
          style={[
            styles.footer,
            alignment === 'left' ? styles.leftText : styles.centerText,
            {color: footerColor},
          ]}
          numberOfLines={3}>
          {project.footerNote || project.payloadData.displaySummary || 'Created with QRCanvas'}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 420,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#00000010',
    gap: 12,
  },
  alignStart: {
    alignItems: 'flex-start',
  },
  alignCenter: {
    alignItems: 'center',
  },
  exportCard: {
    maxWidth: undefined,
    minHeight: 520,
    justifyContent: 'center',
  },
  shadow: {
    ...theme.shadow,
  },
  accent: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 7,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    letterSpacing: 0,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '600',
    maxWidth: 330,
  },
  footer: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    maxWidth: 330,
  },
  centerText: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  leftText: {
    textAlign: 'left',
    alignSelf: 'stretch',
  },
  qrOuter: {
    alignSelf: 'center',
    borderRadius: 18,
    padding: 10,
    marginVertical: 4,
  },
  qrInner: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
  },
});
