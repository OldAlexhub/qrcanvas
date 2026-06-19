import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  NativeAd,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
} from 'react-native-google-mobile-ads';
import {theme} from '../data/theme';
import {AD_REQUEST_OPTIONS, AD_UNIT_IDS} from './config';

export const NativeAdCard = () => {
  const [nativeAd, setNativeAd] = useState<NativeAd | null>(null);

  useEffect(() => {
    let ad: NativeAd | null = null;
    NativeAd.createForAdRequest(AD_UNIT_IDS.native, AD_REQUEST_OPTIONS)
      .then(loaded => {
        ad = loaded;
        setNativeAd(loaded);
      })
      .catch(() => {});
    return () => {
      ad?.destroy();
    };
  }, []);

  if (!nativeAd) {
    return null;
  }

  return (
    <NativeAdView nativeAd={nativeAd} style={styles.wrapper}>
      <View style={styles.card}>
        <NativeMediaView style={styles.media} />
        <View style={styles.body}>
          <View style={styles.headlineRow}>
            <NativeAsset assetType={NativeAssetType.HEADLINE}>
              <Text style={styles.headline}>{nativeAd.headline}</Text>
            </NativeAsset>
            <View style={styles.adBadge}>
              <Text style={styles.adBadgeText}>Ad</Text>
            </View>
          </View>
          <NativeAsset assetType={NativeAssetType.BODY}>
            <Text style={styles.tagline}>{nativeAd.body}</Text>
          </NativeAsset>
          <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaText}>{nativeAd.callToAction}</Text>
            </TouchableOpacity>
          </NativeAsset>
        </View>
      </View>
    </NativeAdView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.line,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: 150,
    backgroundColor: theme.colors.surfaceAlt,
  },
  body: {
    padding: 14,
    gap: 6,
  },
  headlineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  headline: {
    flex: 1,
    color: theme.colors.ink,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
  },
  adBadge: {
    backgroundColor: '#E8F0FE',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 2,
  },
  adBadgeText: {
    color: '#1A73E8',
    fontSize: 10,
    fontWeight: '800',
  },
  tagline: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  ctaButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
