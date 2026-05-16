import React from 'react';
import Svg, {Circle, Line, Path, Rect} from 'react-native-svg';
import {theme} from '../data/theme';

export type TabBarIconName = 'home' | 'create' | 'library' | 'settings';

type Props = {
  name: TabBarIconName;
  color?: string;
  focused?: boolean;
  size?: number;
};

export const TabBarIcon = ({name, color, focused = false, size = 24}: Props) => {
  const iconColor = color ?? (focused ? theme.colors.primary : '#7C8992');
  const strokeWidth = focused ? 2.5 : 2.1;

  if (name === 'home') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M3.5 11.2 12 4.4l8.5 6.8"
          stroke={iconColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M6.2 10.6v8.2c0 .7.5 1.2 1.2 1.2h9.2c.7 0 1.2-.5 1.2-1.2v-8.2"
          stroke={iconColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M9.8 20v-5.2h4.4V20"
          stroke={iconColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (name === 'create') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Rect
          x="3.8"
          y="3.8"
          width="16.4"
          height="16.4"
          rx="3.2"
          stroke={iconColor}
          strokeWidth={strokeWidth}
        />
        <Rect x="7" y="7" width="3.8" height="3.8" rx="0.8" fill={iconColor} />
        <Rect x="13.2" y="7" width="3.8" height="3.8" rx="0.8" fill={iconColor} />
        <Rect x="7" y="13.2" width="3.8" height="3.8" rx="0.8" fill={iconColor} />
        <Path
          d="M14 15.2h3.8M15.9 13.3v3.8"
          stroke={iconColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (name === 'library') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <Path
          d="M6.6 5.2h9.8c1 0 1.8.8 1.8 1.8v12.2c0 .4-.4.7-.8.5L12 17.1l-5.4 2.6c-.4.2-.8-.1-.8-.5V7c0-1 .8-1.8 1.8-1.8Z"
          stroke={iconColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M8.9 9h6.2M8.9 12.2h4.8"
          stroke={iconColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line
        x1="5"
        y1="7"
        x2="19"
        y2="7"
        stroke={iconColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Circle cx="9" cy="7" r="2.1" fill={theme.colors.surfaceAlt} stroke={iconColor} strokeWidth={strokeWidth} />
      <Line
        x1="5"
        y1="12"
        x2="19"
        y2="12"
        stroke={iconColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Circle cx="15" cy="12" r="2.1" fill={theme.colors.surfaceAlt} stroke={iconColor} strokeWidth={strokeWidth} />
      <Line
        x1="5"
        y1="17"
        x2="19"
        y2="17"
        stroke={iconColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Circle cx="11" cy="17" r="2.1" fill={theme.colors.surfaceAlt} stroke={iconColor} strokeWidth={strokeWidth} />
    </Svg>
  );
};
