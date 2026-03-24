import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function TabBarBackground() {
  const backgroundColor = useThemeColor({}, 'background');
  
  return <View style={[styles.background, { backgroundColor }]} />;
}

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
  },
});
