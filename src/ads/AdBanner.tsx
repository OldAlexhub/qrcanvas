import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {AD_UNIT_IDS, AD_REQUEST_OPTIONS} from './config';

export const AdBanner = () => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={[styles.container, !visible && styles.hidden]}>
      <BannerAd
        unitId={AD_UNIT_IDS.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={AD_REQUEST_OPTIONS}
        onAdLoaded={() => setVisible(true)}
        onAdFailedToLoad={() => setVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 6,
    backgroundColor: 'transparent',
  },
  hidden: {
    height: 0,
    paddingVertical: 0,
    overflow: 'hidden',
  },
});
