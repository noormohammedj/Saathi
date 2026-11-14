import { Redirect } from 'expo-router';

import { useApp } from '@/store/app-store';

export default function Index() {
  const onboarded = useApp((s) => s.onboarded);
  return <Redirect href={onboarded ? '/discover' : '/onboarding'} />;
}
