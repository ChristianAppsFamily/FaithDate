import { useRouter } from 'expo-router';
import { Cross, Heart, Lock, Play } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Waveform } from '@/components/media';
import { Button, Screen, Text } from '@/components/ui';
import { introCards, onboardingCopy } from '@/config/onboarding';
import { adapter } from '@/data';
import { MIN_TOUCH_TARGET, useTheme } from '@/theme';

/**
 * Design 01. Three intro cards advanced by tapping the card or the dots. No swipe.
 * Gold appears once: the cross in the logo mark. The active dot is white.
 */
export function WelcomeScreen() {
  const { colors, radii, spacing } = useTheme();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const card = introCards[index] ?? introCards[0];

  const next = () => setIndex((i) => (i + 1) % introCards.length);

  const start = async () => {
    await adapter.saveOnboardingStep('welcome', { completed_step: 1 });
    router.push({ pathname: '/(onboarding)/step/[n]', params: { n: '2' } });
  };

  return (
    <Screen
      immersive
      scroll={false}
      footer={
        <View style={{ gap: spacing.sm }}>
          <Button label={onboardingCopy.createProfile} variant="inverse" onPress={start} />
          <Button label={onboardingCopy.haveAccount} variant="ghostInverse" onPress={() => router.push('/(onboarding)/sign-in')} />
        </View>
      }
    >
      <View style={[styles.brand, { marginTop: spacing.xxl }]}>
        <View style={[styles.logo, { backgroundColor: colors.primary, borderRadius: radii.md }]}>
          <Cross size={20} color={colors.gold} fill={colors.gold} />
        </View>
        <Text variant="subheading" color="immersiveText" style={{ fontSize: 22 }}>
          FaithDate
        </Text>
      </View>

      <Text variant="display" color="immersiveText" style={{ marginTop: spacing.xxxl }}>
        {onboardingCopy.welcomeHeadline}
      </Text>
      <Text variant="body" color="immersiveMuted" style={{ marginTop: spacing.lg, fontSize: 17, lineHeight: 26 }}>
        {onboardingCopy.welcomeSub}
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${card.title}. ${card.body}. Tap for the next card, ${index + 1} of ${introCards.length}`}
        onPress={next}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: colors.immersiveSurface, borderRadius: radii.xl, padding: spacing.xxl, marginTop: spacing.xxxl, opacity: pressed ? 0.92 : 1 },
        ]}
      >
        <CardIllustration kind={card.id} />
        <Text variant="heading" color="immersiveText" style={{ marginTop: spacing.xl }}>
          {card.title}
        </Text>
        <Text variant="body" color="immersiveMuted" style={{ marginTop: spacing.sm }}>
          {card.body}
        </Text>
      </Pressable>

      <View style={[styles.dots, { marginTop: spacing.xl }]} accessibilityRole="tablist">
        {introCards.map((c, i) => (
          <Pressable
            key={c.id}
            accessibilityRole="tab"
            accessibilityLabel={`Card ${i + 1}: ${c.title}`}
            accessibilityState={{ selected: i === index }}
            onPress={() => setIndex(i)}
            hitSlop={8}
            style={styles.dotHit}
          >
            <View
              style={{
                width: i === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i === index ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
              }}
            />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

function CardIllustration({ kind }: { kind: (typeof introCards)[number]['id'] }) {
  const { colors } = useTheme();
  if (kind === 'hear') {
    return (
      <View style={styles.illustration} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={styles.playCircle}>
          <Play size={22} color={colors.plumDeep} fill={colors.plumDeep} style={{ marginLeft: 2 }} />
        </View>
        <View style={{ flex: 1 }}>
          <Waveform seed="welcome" bars={28} height={40} color="rgba(255,255,255,0.5)" activeColor="#FFFFFF" progress={0.35} />
        </View>
      </View>
    );
  }
  const Icon = kind === 'like' ? Heart : Lock;
  return (
    <View style={styles.illustration} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={styles.playCircle}>
        <Icon size={22} color={colors.plumDeep} />
      </View>
      <View style={styles.pills}>
        {[0.9, 0.6, 0.75].map((w, i) => (
          <View key={i} style={{ height: 10, width: `${w * 100}%`, borderRadius: 5, backgroundColor: i === 0 ? '#FFFFFF' : 'rgba(255,255,255,0.4)' }} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {},
  illustration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  playCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pills: {
    flex: 1,
    gap: 8,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotHit: {
    minWidth: MIN_TOUCH_TARGET,
    minHeight: MIN_TOUCH_TARGET,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
});
