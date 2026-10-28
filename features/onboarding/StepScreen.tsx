import { ActivityIndicator, View } from 'react-native';

import { Screen, Text } from '@/components/ui';
import { useTheme } from '@/theme';

import { BasicsStep } from './steps/BasicsStep';
import { FaithStep } from './steps/FaithStep';
import { IntentStep } from './steps/IntentStep';
import { LifeStageStep } from './steps/LifeStageStep';
import { PhotosStep } from './steps/PhotosStep';
import { PreferencesStep } from './steps/PreferencesStep';
import { StoryStep } from './steps/StoryStep';
import { VerifyStep } from './steps/VerifyStep';
import { VoiceIntroStep } from './steps/VoiceIntroStep';
import { useOnboardingDraft } from './useOnboardingDraft';

/** Steps 2 to 10. Each step owns its form; this routes by step id and handles the draft load. */
export function StepScreen() {
  const ctrl = useOnboardingDraft();
  const { colors, spacing } = useTheme();

  if (ctrl.loading || !ctrl.draft) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: spacing.huge }}>
          {ctrl.error ? (
            <Text variant="body" color="danger" align="center">
              {ctrl.error}
            </Text>
          ) : (
            <ActivityIndicator color={colors.primary} size="large" />
          )}
        </View>
      </Screen>
    );
  }

  switch (ctrl.stepId) {
    case 'basics':
      return <BasicsStep ctrl={ctrl} />;
    case 'faith':
      return <FaithStep ctrl={ctrl} />;
    case 'life_stage':
      return <LifeStageStep ctrl={ctrl} />;
    case 'intent':
      return <IntentStep ctrl={ctrl} />;
    case 'verify':
      return <VerifyStep ctrl={ctrl} />;
    case 'photos':
      return <PhotosStep ctrl={ctrl} />;
    case 'voice_intro':
      return <VoiceIntroStep ctrl={ctrl} />;
    case 'story':
      return <StoryStep ctrl={ctrl} />;
    case 'preferences':
      return <PreferencesStep ctrl={ctrl} />;
    default:
      return <BasicsStep ctrl={ctrl} />;
  }
}
