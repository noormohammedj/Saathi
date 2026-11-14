import { router } from 'expo-router';
import { ArrowUp, HandHeart, RotateCcw, X } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/components/header';
import { Mandala } from '@/components/mandala';
import { Press } from '@/components/press';
import { type DeckHandle, type SwipeDir, SwipeDeck } from '@/components/swipe-deck';
import { CURRENT_USER_ID, DEVOTEES, devoteeById } from '@/data/devotees';
import { sevaMatch } from '@/lib/match';
import { useApp } from '@/store/app-store';
import { C, usePalette } from '@/theme';

const FILTERS = [
  { id: 'all', label: 'Best matches' },
  { id: 'gita', label: 'Gita Jayanti team' },
  { id: 'same', label: 'Shares my skills' },
  { id: 'mentor', label: 'New devotees to guide' },
] as const;
type FilterId = (typeof FILTERS)[number]['id'];

function ActionButton({ onPress, size, bg, label, children }: { onPress: () => void; size: number; bg: string; label: string; children: React.ReactNode }) {
  return (
    <Press onPress={onPress} accessibilityLabel={label} scaleTo={0.9} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', shadowColor: '#2B1B10', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 }}>
      {children}
    </Press>
  );
}

export default function Discover() {
  const p = usePalette();
  const deck = useRef<DeckHandle>(null);
  const [filter, setFilter] = useState<FilterId>('all');
  const [toast, setToast] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const { swipes, mySkills, swipe, openDirectThread, sendMessage } = useApp();

  const profiles = useMemo(() => {
    const pool = DEVOTEES.filter((d) => d.id !== CURRENT_USER_ID && !swipes[d.id]);
    const filtered = pool.filter((d) => {
      if (filter === 'gita') return sevaMatch(d).event?.id === 'gita-jayanti' || d.skills.includes('gita');
      if (filter === 'same') return d.skills.some((s) => s !== 'chanting' && mySkills.includes(s));
      if (filter === 'mentor') return new Date().getFullYear() - d.sinceYear <= 2;
      return true;
    });
    return filtered.sort((a, b) => sevaMatch(b).score - sevaMatch(a).score);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, round, mySkills]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const onSwipe = (id: string, dir: SwipeDir) => {
    const d = devoteeById(id);
    if (dir === 'invite') {
      swipe(id, 'connect');
      const match = sevaMatch(d);
      const t = openDirectThread(id);
      sendMessage(t, `Hare Krishna ${d.name.split(' ')[0]}! Would you serve with me at ${match.event?.title ?? 'the Sunday Love Feast'}?`, 'seva-invite', match.event?.id ?? 'sunday-feast');
      flash(`Seva invite sent to ${d.name.split(' ')[0]}`);
      return;
    }
    const matched = swipe(id, dir);
    if (matched) router.push(`/match/${id}`);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: p.bg }}>
      <Header eyebrow="Hare Krishna, Noor" title="Your Saathis" />

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 12 }}>
          {FILTERS.map((f) => {
            const on = f.id === filter;
            return (
              <Press key={f.id} onPress={() => setFilter(f.id)} accessibilityState={{ selected: on }} style={{ height: 36, paddingHorizontal: 14, borderRadius: 999, justifyContent: 'center', backgroundColor: on ? C.ink : p.card, borderWidth: 1, borderColor: on ? C.ink : p.line }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: on ? 'white' : p.text }}>{f.label}</Text>
              </Press>
            );
          })}
        </ScrollView>
      </View>

      <View style={{ flex: 1, marginHorizontal: 16 }}>
        <SwipeDeck
          key={`${filter}-${round}`}
          ref={deck}
          profiles={profiles}
          onSwipe={onSwipe}
          empty={
            <View style={{ flex: 1, borderRadius: 32, backgroundColor: p.card, alignItems: 'center', justifyContent: 'center', padding: 32, borderWidth: 1, borderColor: p.line }}>
              <Mandala size={160} color={C.saffron} opacity={0.5} />
              <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 24, color: p.text, marginTop: 16, textAlign: 'center' }}>You’ve met everyone for now</Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: p.textSoft, textAlign: 'center', marginTop: 6, lineHeight: 20 }}>
                New devotees join every Sunday feast. Meanwhile, see who needs hands for upcoming seva.
              </Text>
              <Press onPress={() => router.push('/seva')} style={{ marginTop: 20, backgroundColor: C.saffronDeep, paddingHorizontal: 22, height: 48, borderRadius: 999, justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'Inter_700Bold', color: 'white' }}>Browse seva openings</Text>
              </Press>
              <Press onPress={() => { useApp.setState({ swipes: {} }); setRound((r) => r + 1); }} style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10 }}>
                <RotateCcw size={14} color={p.muted} />
                <Text style={{ fontFamily: 'Inter_600SemiBold', color: p.muted }}>Show profiles again</Text>
              </Press>
            </View>
          }
        />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 22, paddingTop: 14, paddingBottom: 104 }}>
        <ActionButton label="Maybe later" size={58} bg={p.card} onPress={() => deck.current?.fling('later')}>
          <X size={26} color={p.muted} strokeWidth={2.6} />
        </ActionButton>
        <ActionButton label="Invite to seva" size={50} bg={C.goldSoft} onPress={() => deck.current?.fling('invite')}>
          <ArrowUp size={22} color="#8A6314" strokeWidth={2.6} />
        </ActionButton>
        <ActionButton label="Connect" size={68} bg={C.saffronDeep} onPress={() => deck.current?.fling('connect')}>
          <HandHeart size={30} color="white" strokeWidth={2.2} />
        </ActionButton>
      </View>

      {toast && (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={{ position: 'absolute', top: 120, alignSelf: 'center', backgroundColor: C.ink, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 999 }}>
          <Text style={{ color: 'white', fontFamily: 'Inter_600SemiBold' }}>{toast}</Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}
