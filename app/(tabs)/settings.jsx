import { StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAppTheme } from '@/contexts/theme-context';

export default function SettingsScreen() {
  const { theme, currentTheme, changeTheme, themes } = useAppTheme();
  const tintColor = useThemeColor({}, 'tint');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const cardBg = useThemeColor({}, 'card');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>Settings</ThemedText>
        <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
          Customize your experience
        </ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Theme</ThemedText>
          <ThemedText style={[styles.sectionDescription, { color: textSecondary }]}>
            Choose your preferred color scheme
          </ThemedText>

          <View style={styles.themesGrid}>
            {Object.entries(themes).map(([key, themeData]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.themeCard,
                  { backgroundColor: cardBg },
                  currentTheme === key && { 
                    borderColor: tintColor,
                    borderWidth: 3,
                  }
                ]}
                onPress={() => changeTheme(key)}
                activeOpacity={0.7}
              >
                <View style={[styles.themePreview, { 
                  backgroundColor: themeData.primary,
                }]}>
                  {currentTheme === key && (
                    <Ionicons name="checkmark-circle" size={32} color="#fff" />
                  )}
                </View>
                <ThemedText style={styles.themeName}>{themeData.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>About</ThemedText>
          <View style={[styles.infoCard, { backgroundColor: cardBg }]}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle-outline" size={24} color={tintColor} />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Version</ThemedText>
                <ThemedText style={[styles.infoValue, { color: textSecondary }]}>
                  1.0.0
                </ThemedText>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="code-slash-outline" size={24} color={tintColor} />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>App Name</ThemedText>
                <ThemedText style={[styles.infoValue, { color: textSecondary }]}>
                  Beauttahs
                </ThemedText>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="heart-outline" size={24} color={tintColor} />
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>Made with</ThemedText>
                <ThemedText style={[styles.infoValue, { color: textSecondary }]}>
                  React Native & Expo
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    gap: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  section: {
    padding: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  themesGrid: {
    gap: 16,
  },
  themeCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  themePreview: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    marginTop: 2,
  },
});
