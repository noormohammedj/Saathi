import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { BlurView } from 'expo-blur';
import { Flame, HandHeart, MessageCircleHeart, Sparkles, UsersRound } from 'lucide-react-native';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Press } from '@/components/press';
import { useApp } from '@/store/app-store';
import { C, usePalette } from '@/theme';

const META: Record<string, { label: string; Icon: typeof Flame }> = {
  discover: { label: 'Saathis', Icon: Sparkles },
  sadhana: { label: 'Sadhana', Icon: Flame },
  seva: { label: 'Seva', Icon: HandHeart },
  sangha: { label: 'Sangha', Icon: UsersRound },
  chats: { label: 'Chats', Icon: MessageCircleHeart },
};

function Tab({ focused, name, onPress, badge }: { focused: boolean; name: string; onPress: () => void; badge?: number }) {
  const { label, Icon } = META[name];
  const p = usePalette();
  const pill = useAnimatedStyle(() => ({
    opacity: withSpring(focused ? 1 : 0),
    transform: [{ scale: withSpring(focused ? 1 : 0.6, { damping: 14 }) }],
  }));
  return (
    <Press onPress={onPress} accessibilityLabel={label} accessibilityState={{ selected: focused }} style={{ flex: 1, alignItems: 'center', paddingVertical: 8 }}>
      <View style={{ width: 56, height: 32, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={[{ position: 'absolute', inset: 0, borderRadius: 16, backgroundColor: C.saffronSoft }, pill]} />
        <View style={{ zIndex: 1 }}>
          <Icon size={22} color={focused ? C.saffronDeep : p.muted} strokeWidth={focused ? 2.4 : 2} />
        </View>
        {!!badge && (
          <View style={{ position: 'absolute', top: -2, right: 6, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: C.lotus, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
            <Text style={{ color: 'white', fontSize: 11, fontFamily: 'Inter_700Bold' }}>{badge}</Text>
          </View>
        )}
      </View>
      <Text style={{ marginTop: 3, fontSize: 11, fontFamily: focused ? 'Inter_700Bold' : 'Inter_500Medium', color: focused ? C.saffronDeep : p.muted }}>{label}</Text>
    </Press>
  );
}

export function TabBar({ state, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const p = usePalette();
  const newMatches = useApp((s) => s.matches.filter((m) => !s.threads.some((t) => t.members.includes(m.profileId) && t.messages.length)).length);
  return (
    <View style={{ position: 'absolute', left: 14, right: 14, bottom: Math.max(insets.bottom - 8, 10), borderRadius: 28, overflow: 'hidden', borderWidth: 1, borderColor: p.line, shadowColor: '#2B1B10', shadowOpacity: 0.12, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 12 }}>
      <BlurView intensity={60} tint={p.dark ? 'dark' : 'light'} style={{ flexDirection: 'row', paddingHorizontal: 6, paddingVertical: 4, backgroundColor: p.dark ? 'rgba(34,23,15,0.82)' : 'rgba(255,255,255,0.86)' }}>
        {state.routes.map((route, index) => (
          <Tab
            key={route.key}
            name={route.name}
            focused={state.index === index}
            badge={route.name === 'chats' ? newMatches : undefined}
            onPress={() => navigateToTab(route.key)}
          />
        ))}
      </BlurView>
    </View>
  );
}
