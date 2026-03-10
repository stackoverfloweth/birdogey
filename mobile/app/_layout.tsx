import { Stack } from 'expo-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../src/services/queryClient';
import { AuthProvider } from '../src/contexts/AuthContext';
import { SeasonProvider } from '../src/contexts/SeasonContext';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SeasonProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </SeasonProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
