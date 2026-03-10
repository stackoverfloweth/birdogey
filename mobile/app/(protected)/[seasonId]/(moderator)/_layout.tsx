import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../../../src/contexts/AuthContext';

export default function ModeratorLayout() {
  const { user } = useAuth();

  if (user?.isReadonly) {
    return <Redirect href="/(protected)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
