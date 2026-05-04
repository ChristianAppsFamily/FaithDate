import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../types';
import { COLORS } from '../../constants';

type NavigationProp = NativeStackNavigationProp<SettingsStackParamList, 'PrivacyPolicy'>;

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Paragraph({ children }: { children: React.ReactNode }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bullet}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: May 4, 2026</Text>

        <Section title="Introduction">
          <Paragraph>
            Welcome to FaithDate. We respect your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, store, and protect your information when you use our app.
          </Paragraph>
        </Section>

        <Section title="Information We Collect">
          <Paragraph>
            We collect the following types of information to provide and improve our services:
          </Paragraph>
          <Bullet>Personal information (name, age, gender, faith/religion, location, bio)</Bullet>
          <Bullet>Profile photos and media you upload</Bullet>
          <Bullet>Device information (device ID, operating system, app version)</Bullet>
          <Bullet>Usage data (app interactions, preferences, matches)</Bullet>
          <Bullet>Communications with other users through our messaging system</Bullet>
          <Bullet>Advertising identifiers for personalized ads (with your permission)</Bullet>
        </Section>

        <Section title="How We Use Your Data">
          <Paragraph>
            We use your information to:
          </Paragraph>
          <Bullet>Create and manage your dating profile</Bullet>
          <Bullet>Match you with compatible users based on preferences</Bullet>
          <Bullet>Provide in-app messaging and communication features</Bullet>
          <Bullet>Send notifications about matches, messages, and app updates</Bullet>
          <Bullet>Improve our app and user experience</Bullet>
          <Bullet>Display personalized advertisements (with your consent)</Bullet>
          <Bullet>Prevent fraud and ensure platform safety</Bullet>
        </Section>

        <Section title="Advertising & Analytics">
          <Paragraph>
            FaithDate uses Google AdMob to display advertisements. With your permission (via App Tracking Transparency on iOS), 
            we may collect and use your device's advertising identifier to deliver personalized ads and measure ad performance.
          </Paragraph>
          <Paragraph>
            You can opt out of personalized advertising at any time through your device settings:
          </Paragraph>
          <Bullet>iOS: Settings → Privacy & Security → Tracking</Bullet>
          <Bullet>Android: Settings → Google → Ads → Opt out of Ads Personalization</Bullet>
          <Paragraph style={styles.paragraphSpacing}>
            We also use analytics tools to understand how users interact with our app, helping us improve features and fix issues.
          </Paragraph>
        </Section>

        <Section title="Third-Party Services">
          <Paragraph>
            We use the following third-party services that may collect information:
          </Paragraph>
          <Bullet><Text style={styles.bold}>Google AdMob:</Text> For displaying advertisements. Learn more at <Text style={styles.link}>https://policies.google.com/privacy</Text></Bullet>
          <Bullet><Text style={styles.bold}>Expo:</Text> For app development and over-the-air updates</Bullet>
          <Bullet><Text style={styles.bold}>Apple App Store / Google Play Store:</Text> For in-app purchases and app distribution</Bullet>
        </Section>

        <Section title="Data Storage & Security">
          <Paragraph>
            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, 
            alteration, disclosure, or destruction. Your data is stored securely and encrypted where applicable.
          </Paragraph>
        </Section>

        <Section title="Your Rights">
          <Paragraph>
            You have the following rights regarding your personal data:
          </Paragraph>
          <Bullet><Text style={styles.bold}>Access:</Text> Request a copy of your personal data</Bullet>
          <Bullet><Text style={styles.bold}>Correction:</Text> Update or correct inaccurate information</Bullet>
          <Bullet><Text style={styles.bold}>Deletion:</Text> Request deletion of your account and data</Bullet>
          <Bullet><Text style={styles.bold}>Portability:</Text> Export your data in a portable format</Bullet>
          <Bullet><Text style={styles.bold}>Withdraw Consent:</Text> Opt out of data processing where consent is the legal basis</Bullet>
          <Paragraph style={styles.paragraphSpacing}>
            To exercise these rights, please contact us using the information below.
          </Paragraph>
        </Section>

        <Section title="Children's Privacy">
          <Paragraph>
            FaithDate is intended for users 18 years of age and older. We do not knowingly collect personal information from children 
            under 18. If we discover that a child under 18 has provided us with personal information, we will promptly delete such information.
          </Paragraph>
        </Section>

        <Section title="Changes to This Policy">
          <Paragraph>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
            on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
          </Paragraph>
        </Section>

        <Section title="Contact Us">
          <Paragraph>
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </Paragraph>
          <Bullet>Email: privacy@christianappsfamily.com</Bullet>
          <Bullet>Through the app: Settings → Support → Feedback & Support</Bullet>
          <Paragraph style={styles.paragraphSpacing}>
            We aim to respond to all inquiries within 48 hours.
          </Paragraph>
        </Section>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By using FaithDate, you agree to the collection and use of information in accordance with this Privacy Policy.
          </Text>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textPrimary,
  },
  paragraphSpacing: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 4,
  },
  bullet: {
    fontSize: 15,
    color: COLORS.primary,
    marginRight: 8,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textPrimary,
  },
  bold: {
    fontWeight: '600',
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 16,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
