import { Redirect } from 'expo-router';

import { useSession } from '@/store/useSession';

/** Entry: send people to onboarding, back to where they left off, or into the app. */
export default function Index() {
  const profile = useSession((s) => s.profile);
  const complete = useSession((s) => s.onboardingComplete);
  const resumeStep = useSession((s) => s.resumeStep);

  if (profile && complete) return <Redirect href="/(tabs)/discover" />;
  if (resumeStep > 1) return <Redirect href={{ pathname: '/(onboarding)/step/[n]', params: { n: String(Math.min(resumeStep, 10)) } }} />;
  return <Redirect href="/(onboarding)/welcome" />;
}
