import { router } from 'expo-router';
import { Coins } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Press } from '@/components/press';
import { CURRENT_USER_ID, devoteeById } from '@/data/devotees';
import { useApp } from '@/store/app-store';
import { C } from '@/theme';

/** Tab-screen header: eyebrow + serif title, credits pill and profile avatar. */
export function Header({ eyebrow, title }: { eyebrow: string; title: string }) {
  const credits = useApp((s) => s.credits);
  const role = useApp((s) => s.role);
  return (
    <View className="flex-row items-end justify-between px-5 pb-3 pt-2">
      <View className="flex-1 pr-3">
        <Text className="font-semibold text-xs uppercase tracking-[2px] text-saffronDeep dark:text-saffron">{eyebrow}</Text>
        <Text className="mt-1 font-display text-[30px] leading-[36px] text-ink dark:text-sand" accessibilityRole="header">
          {title}
        </Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Press
          onPress={() => router.push('/rewards')}
          accessibilityLabel={`${credits} seva credits. Open rewards`}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.goldSoft, paddingHorizontal: 12, height: 40, borderRadius: 999 }}>
          <Coins size={16} color="#8A6314" />
          <Text style={{ fontFamily: 'Inter_700Bold', color: '#8A6314', fontSize: 14 }}>{credits.toLocaleString('en-IN')}</Text>
        </Press>
        <Press onPress={() => router.push('/me')} accessibilityLabel="Open my profile">
          <Avatar devotee={devoteeById(CURRENT_USER_ID)} size={40} ring={role === 'admin' ? C.saffron : undefined} />
        </Press>
      </View>
    </View>
  );
}
