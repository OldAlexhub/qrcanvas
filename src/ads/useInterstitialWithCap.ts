import {useCallback, useEffect} from 'react';
import {useInterstitialAd} from 'react-native-google-mobile-ads';
import {AD_REQUEST_OPTIONS, AD_UNIT_IDS} from './config';

// Module-level frequency cap state (resets on app restart, which is fine)
let gracePeriodUsed = false;
let lastShownAt = 0;
const FREQUENCY_CAP_MS = 3 * 60 * 1000;

export const useInterstitialWithCap = () => {
  const {isLoaded, isClosed, load, show} = useInterstitialAd(
    AD_UNIT_IDS.interstitial,
    AD_REQUEST_OPTIONS,
  );

  useEffect(() => {
    load();
  }, [load]);

  // Pre-load the next ad once the current one is dismissed
  useEffect(() => {
    if (isClosed) {
      load();
    }
  }, [isClosed, load]);

  const tryShowInterstitial = useCallback(() => {
    // Skip the very first export as a grace period for new users
    if (!gracePeriodUsed) {
      gracePeriodUsed = true;
      return;
    }
    const now = Date.now();
    if (now - lastShownAt < FREQUENCY_CAP_MS) {
      return;
    }
    if (!isLoaded) {
      return;
    }
    lastShownAt = now;
    show();
  }, [isLoaded, show]);

  return {tryShowInterstitial};
};
