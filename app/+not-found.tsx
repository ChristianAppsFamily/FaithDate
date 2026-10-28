import { Link } from 'expo-router';

import { Button, Screen, Text } from '@/components/ui';

export default function NotFound() {
  return (
    <Screen>
      <Text variant="title" color="heading" style={{ marginTop: 64 }}>
        That page is not here
      </Text>
      <Text variant="body" color="muted" style={{ marginTop: 8 }}>
        {"The link may be old. Head back to today's profiles."}
      </Text>
      <Link href="/" asChild>
        <Button label="Go home" style={{ marginTop: 24 }} />
      </Link>
    </Screen>
  );
}
