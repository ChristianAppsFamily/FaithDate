import { Redirect, Tabs } from 'expo-router';

import { TabBar } from '@/components/ui';
import { useAdapterQuery } from '@/hooks/useAdapterQuery';
import { adapter } from '@/data';
import { useSession } from '@/store/useSession';

export default function TabsLayout() {
  const profile = useSession((s) => s.profile);
  const complete = useSession((s) => s.onboardingComplete);
  const likes = useAdapterQuery(() => (profile ? adapter.getLikesInbox() : Promise.resolve([])), [profile?.id]);

  if (!profile || !complete) return <Redirect href="/" />;

  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false, animation: 'none' }} backBehavior="initialRoute">
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="likes" options={{ title: 'Likes', tabBarBadge: likes.data && likes.data.length > 0 ? likes.data.length : undefined }} />
      <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
      <Tabs.Screen name="chats" options={{ title: 'Chats' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
