import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { copy } from '@/copy';
import { colors } from '@/ui/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.textPrimary,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="record"
          options={{ title: '', headerBackVisible: false }}
        />
        <Stack.Screen name="review" options={{ title: copy.review.header }} />
        <Stack.Screen name="reflection" options={{ title: '' }} />
        <Stack.Screen
          name="history/index"
          options={{ title: copy.history.title }}
        />
        <Stack.Screen name="history/[id]" options={{ title: '' }} />
        <Stack.Screen
          name="settings"
          options={{ title: copy.settings.title }}
        />
      </Stack>
    </>
  );
}
