/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#00D084';
const tintColorDark = '#00D084';

export const Colors = {
  light: {
    text: '#1A1A1A',
    background: '#F8F9FA',
    card: '#FFFFFF',
    tint: tintColorLight,
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    border: '#E5E7EB',
    textSecondary: '#9CA3AF',
    shadow: '#000000',
    categoryWork: '#FFE5E5',
    categoryPersonal: '#E5F5FF',
    categoryToday: '#D4F4E7',
    categoryTomorrow: '#FFF5E5',
    checkboxBorder: '#E0E0E0',
    categoryTagWork: '#FFE5E5',
    categoryTagPersonal: '#E5F5FF',
    categoryTagToday: '#D4F4E7',
    categoryTagTomorrow: '#FFF5E5',
  },
  dark: {
    text: '#F9FAFB',
    background: '#0A0A0A',
    card: '#1A1A1A',
    tint: tintColorDark,
    icon: '#9CA3AF',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    border: '#2A2A2A',
    textSecondary: '#9CA3AF',
    shadow: '#000000',
    categoryWork: '#3A2A2A',
    categoryPersonal: '#2A2A3A',
    categoryToday: '#2A3A2A',
    categoryTomorrow: '#3A3A2A',
    checkboxBorder: '#3A3A3A',
    categoryTagWork: '#3A2A2A',
    categoryTagPersonal: '#2A2A3A',
    categoryTagToday: '#2A3A2A',
    categoryTagTomorrow: '#3A3A2A',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
