import { formatDistanceToNowStrict } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ChevronLeft, Coins, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { Mandala } from '@/components/mandala';
import { Press } from '@/components/press';
import { CREDIT_RULES, REWARDS, TIERS } from '@/data/temple';
import type { Reward } from '@/data/types';
import { useApp } from '@/store/app-store';
import { C, usePalette } from '@/theme';

const CATS = [
  { id: 'all', label: 'All' },
  { id: 'prasadam', label: 'Prasadam' },
  { id: 'darshan', label: 'Festival passes' },
  { id: 'puja', label: 'Archana' },
  { id: 'gift', label: 'Gifts' },
] as const;

export default function Rewards() {
  const p = usePalette();
  const { credits, ledger, redeem, redemptions } = useApp();
  const [cat, setCat] = useState<(typeof CATS)[number]['id']>('all');
  const [confirm, setConfirm] = useState<Reward | null>(null);
  const [code, setCode] = useState<string | null>(null);

  const tierIdx = TIERS.findLastIndex((t) => credits >= t.min);
  const tier = TIERS[tierIdx];
  const next = TIERS[tierIdx + 1];
  const list = REWARDS.filter((r) => cat === 'all' || r.category === cat);

  return (
    <View style={{ flex: 1, backgroundColor: p.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <LinearGradient colors={['#8A6314', '#C9952B', '#E8761C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingBottom: 26, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', right: -90, top: -30 }}>
            <Mandala size={360} opacity={0.2} />
          </View>
          <SafeAreaView edges={['top']} style={{ paddingHorizontal: 20 }}>
            <Press onPress={() => router.back()} accessibilityLabel="Back" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={24} color="white" />
            </Press>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, letterSpacing: 2, color: 'rgba(255,255,255,0.9)', marginTop: 24 }}>SEVA CREDITS</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Coins size={34} color="white" />
              <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 54, color: 'white' }}>{credits.toLocaleString('en-IN')}</Text>
            </View>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: 'white' }}>{tier.name} tier</Text>
            {next && (
              <>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)', marginTop: 12 }}>
                  <View style={{ width: `${((credits - tier.min) / (next.min - tier.min)) * 100}%`, height: 8, borderRadius: 4, backgroundColor: 'white' }} />
                </View>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: 'rgba(255,255,255,0.92)', marginTop: 6 }}>
                  {next.min - credits} credits to {next.name} – unlocks priority festival seating
                </Text>
              </>
            )}
          </SafeAreaView>
        </LinearGradient>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingVertical: 16 }}>
          {CATS.map((c) => {
            const on = c.id === cat;
            return (
              <Press key={c.id} onPress={() => setCat(c.id)} accessibilityState={{ selected: on }} style={{ height: 36, paddingHorizontal: 14, borderRadius: 999, justifyContent: 'center', backgroundColor: on ? C.ink : p.card, borderWidth: 1, borderColor: on ? C.ink : p.line }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: on ? 'white' : p.text }}>{c.label}</Text>
              </Press>
            );
          })}
        </ScrollView>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 }}>
          {list.map((r) => {
            const afford = credits >= r.cost;
            return (
              <Press key={r.id} onPress={() => afford && setConfirm(r)} accessibilityState={{ disabled: !afford }} style={{ flexBasis: '47%', flexGrow: 1, backgroundColor: p.card, borderRadius: 22, padding: 14, borderWidth: 1, borderColor: p.line, gap: 10, opacity: afford ? 1 : 0.6 }}>
                <View style={{ width: 46, height: 46, borderRadius: 15, backgroundColor: r.category === 'darshan' ? C.peacockSoft : C.goldSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={r.icon} size={22} color={r.category === 'darshan' ? C.peacockDeep : '#8A6314'} />
                </View>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: p.text }}>{r.name}</Text>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.muted, lineHeight: 17 }} numberOfLines={2}>{r.description}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    {afford ? <Coins size={14} color="#8A6314" /> : <Lock size={13} color={p.muted} />}
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: afford ? '#8A6314' : p.muted }}>{r.cost}</Text>
                  </View>
                  {r.limited && <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: C.lotus }}>{r.limited}</Text>}
                </View>
              </Press>
            );
          })}
        </View>

        {redemptions.length > 0 && (
          <View style={{ marginHorizontal: 20, marginTop: 24, gap: 8 }}>
            <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text }}>Ready to collect</Text>
            {redemptions.map((r) => (
              <View key={r.id} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderRadius: 18, backgroundColor: C.tulasiSoft }}>
                <Text style={{ fontFamily: 'Inter_700Bold', color: C.tulasi }}>{REWARDS.find((x) => x.id === r.rewardId)!.name}</Text>
                <Text style={{ fontFamily: 'Inter_700Bold', color: C.tulasi, letterSpacing: 1 }}>{r.code}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={{ marginHorizontal: 20, marginTop: 28, marginBottom: 10, fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text }}>How you earn</Text>
        <View style={{ marginHorizontal: 20, backgroundColor: p.card, borderRadius: 22, borderWidth: 1, borderColor: p.line }}>
          {CREDIT_RULES.map((r, i) => (
            <View key={r.id} style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderTopWidth: i ? 1 : 0, borderColor: p.line }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: p.text }}>{r.label}</Text>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.muted }}>{r.cap}</Text>
              </View>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: '#8A6314' }}>+{r.points}</Text>
            </View>
          ))}
        </View>

        <Text style={{ marginHorizontal: 20, marginTop: 28, marginBottom: 10, fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text }}>History</Text>
        <View style={{ marginHorizontal: 20, gap: 2 }}>
          {ledger.slice(0, 12).map((l) => (
            <View key={l.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: p.text }} numberOfLines={1}>{l.label}</Text>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.muted }}>{formatDistanceToNowStrict(new Date(l.at))} ago</Text>
              </View>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: l.points < 0 ? C.lotus : l.points ? C.tulasi : p.muted }}>{l.points > 0 ? `+${l.points}` : l.points || 'pending'}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {confirm && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(20,13,8,0.6)', justifyContent: 'center', padding: 24 }}>
          <Animated.View entering={ZoomIn.springify().damping(16)} style={{ backgroundColor: p.card, borderRadius: 30, padding: 24, alignItems: 'center', gap: 10 }}>
            {code ? (
              <>
                <Mandala size={120} color={C.gold} opacity={0.8} />
                <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 24, color: p.text, textAlign: 'center' }}>{confirm.name} is yours</Text>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 28, letterSpacing: 4, color: C.saffronDeep }}>{code}</Text>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: p.textSoft, textAlign: 'center' }}>Show this code at the temple counter. Hare Krishna!</Text>
                <Press onPress={() => { setConfirm(null); setCode(null); }} style={{ marginTop: 8, alignSelf: 'stretch', height: 52, borderRadius: 999, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', color: 'white', fontSize: 16 }}>Done</Text>
                </Press>
              </>
            ) : (
              <>
                <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={confirm.icon} size={30} color="#8A6314" />
                </View>
                <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 24, color: p.text, textAlign: 'center' }}>Redeem {confirm.name}?</Text>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: p.textSoft, textAlign: 'center' }}>{confirm.description}</Text>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: '#8A6314' }}>{confirm.cost} credits · {credits - confirm.cost} left after</Text>
                <Press onPress={() => setCode(redeem(confirm.id)?.code ?? null)} style={{ marginTop: 8, alignSelf: 'stretch', height: 52, borderRadius: 999, backgroundColor: C.saffronDeep, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', color: 'white', fontSize: 16 }}>Redeem</Text>
                </Press>
                <Press onPress={() => setConfirm(null)} style={{ height: 44, justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', color: p.muted }}>Not now</Text>
                </Press>
              </>
            )}
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}
