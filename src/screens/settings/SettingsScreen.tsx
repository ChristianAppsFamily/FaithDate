import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../types';
import { COLORS } from '../../constants';
import {
  initializeMonetization,
  purchaseRemoveAdsProduct,
  type RemoveAdsProduct,
} from '../../monetization';

type NavigationProp = NativeStackNavigationProp<SettingsStackParamList, 'SettingsMain'>;

const REMOVE_ADS_PRODUCT_ID = 'faithdate_remove_ads_lifetime';
const FALLBACK_REMOVE_ADS_PRICE = '$4.99';

interface SettingsRowProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
  showArrow?: boolean;
  rightElement?: React.ReactNode;
}

function SettingsRow({ icon, label, onPress, showArrow = true, rightElement }: SettingsRowProps) {
  return (
    <Pressable style={styles.settingsRow} onPress={onPress}>
      <View style={styles.settingsRowLeft}>
        <View style={styles.settingsIcon}>
          <Feather name={icon} size={18} color={COLORS.primary} />
        </View>
        <Text style={styles.settingsLabel}>{label}</Text>
      </View>
      {rightElement || (showArrow && <Feather name="chevron-right" size={20} color={COLORS.textSecondary} />)}
    </Pressable>
  );
}

interface ToggleRowProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

function ToggleRow({ icon, label, value, onValueChange }: ToggleRowProps) {
  return (
    <View style={styles.settingsRow}>
      <View style={styles.settingsRowLeft}>
        <View style={styles.settingsIcon}>
          <Feather name={icon} size={18} color={COLORS.primary} />
        </View>
        <Text style={styles.settingsLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: COLORS.border, true: COLORS.primary }}
        thumbColor="#fff"
      />
    </View>
  );
}

export default function SettingsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [removeAdsProduct, setRemoveAdsProduct] = useState<RemoveAdsProduct | null>(null);
  const [isStoreReady, setIsStoreReady] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  React.useEffect(() => {
    let isMounted = true;

    async function initializeAdsAndStore() {
      try {
        const removeAds = await initializeMonetization(REMOVE_ADS_PRODUCT_ID);
        if (isMounted) {
          setRemoveAdsProduct(removeAds);
          setIsStoreReady(true);
        }
      } catch (error) {
        console.warn('Unable to initialize monetization SDKs yet.', error);
        if (isMounted) {
          setIsStoreReady(false);
        }
      }
    }

    // Initialize asynchronously without blocking UI
    initializeAdsAndStore();

    return () => {
      isMounted = false;
    };
  }, []);

  const removeAdsPrice = removeAdsProduct?.displayPrice ?? FALLBACK_REMOVE_ADS_PRICE;

  const purchaseRemoveAds = async () => {
    setIsPurchasing(true);
    try {
      await purchaseRemoveAdsProduct(REMOVE_ADS_PRODUCT_ID);
      alert('Your lifetime ad removal purchase is being processed.');
    } catch (error) {
      console.warn('Remove ads purchase was not completed.', error);
      alert('Purchase was not completed. Please try again from a device signed into the App Store.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleLogout = () => {
    // Navigate back to landing
    navigation.getParent()?.navigate('Landing');
  };

  const handleMenuPress = () => {
    Alert.alert('Menu', 'Additional options coming soon!');
  };

  const handleHelpCenter = () => {
    Alert.alert('Help Center', 'FAQs and guides coming soon!');
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://faithdate.com/privacy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://faithdate.com/terms');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Pressable style={styles.menuButton} onPress={handleMenuPress}>
          <Feather name="menu" size={20} color="#fff" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>D</Text>
            </View>
            <View>
              <Text style={styles.profileName}>Daniel</Text>
              <View style={styles.profileFaith}>
                <Ionicons name="heart" size={14} color={COLORS.primary} />
                <Text style={styles.profileFaithText}>Christian</Text>
              </View>
            </View>
          </View>
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>

        {/* Promotional Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>Upgrade to Premium</Text>
            <Text style={styles.promoText}>Get unlimited likes and see who liked you</Text>
          </View>
          <View style={styles.promoIcon}>
            <Feather name="star" size={32} color={COLORS.primary} />
          </View>
        </View>

        {/* AI Dating Assistant */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>AI Dating Assistant</Text>
          <ToggleRow
            icon="cpu"
            label="Enable AI Assistant"
            value={true}
            onValueChange={() => {}}
          />
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Account Settings</Text>
          <SettingsRow
            icon="user"
            label="Edit Profile"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <SettingsRow
            icon="lock"
            label="Change Password"
            onPress={() => navigation.navigate('ChangePassword')}
          />
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Preferences</Text>
          <ToggleRow
            icon="moon"
            label="Dark Mode"
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <ToggleRow
            icon="mail"
            label="Email Notifications"
            value={emailNotifications}
            onValueChange={setEmailNotifications}
          />
          <ToggleRow
            icon="bell"
            label="Push Notifications"
            value={pushNotifications}
            onValueChange={setPushNotifications}
          />
          <ToggleRow
            icon="globe"
            label="Public Profile"
            value={publicProfile}
            onValueChange={setPublicProfile}
          />
        </View>

        {/* Remove Ads */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Premium</Text>
          <View style={styles.removeAdsCard}>
            <View style={styles.removeAdsHeader}>
              <View style={styles.removeAdsIcon}>
                <Feather name="x-circle" size={24} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.removeAdsTitle}>Remove ads forever</Text>
                <Text style={styles.removeAdsPrice}>{removeAdsPrice} one-time</Text>
              </View>
            </View>
            <Pressable
              style={[styles.purchaseButton, isPurchasing && styles.purchaseButtonDisabled]}
              onPress={purchaseRemoveAds}
              disabled={isPurchasing}
            >
              <Text style={styles.purchaseButtonText}>
                {isPurchasing ? 'Processing...' : `Remove Ads - ${removeAdsPrice}`}
              </Text>
            </Pressable>
            <Text style={styles.purchaseNote}>
              {isStoreReady ? 'Store connected' : 'Configure in App Store Connect'}
            </Text>
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Support</Text>
          <SettingsRow
            icon="message-square"
            label="Feedback & Support"
            onPress={() => navigation.navigate('FeedbackSupport')}
          />
          <SettingsRow
            icon="help-circle"
            label="Help Center"
            onPress={handleHelpCenter}
          />
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>About</Text>
          <SettingsRow
            icon="file-text"
            label="Privacy Policy"
            onPress={handlePrivacyPolicy}
          />
          <SettingsRow
            icon="file"
            label="Terms of Service"
            onPress={handleTermsOfService}
          />
          <View style={styles.versionRow}>
            <Text style={styles.versionLabel}>Version</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.secondary,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accentLightPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  profileFaith: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  profileFaithText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.accentLightPink,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  promoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  promoIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 2,
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.accentLightPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  removeAdsCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
  },
  removeAdsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  removeAdsIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.accentLightPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeAdsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  removeAdsPrice: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  purchaseButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  purchaseButtonDisabled: {
    opacity: 0.7,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  purchaseNote: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  versionLabel: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  versionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
