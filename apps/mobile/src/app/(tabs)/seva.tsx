import { format, parseISO } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { CalendarDays, ChevronRight, MapPin, UsersRound } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/components/header';
import { Icon } from '@/components/icon';
import { Mandala } from '@/components/mandala';
import { Press } from '@/components/press';
import { SkillChip } from '@/components/skill-chip';
import { EVENTS, SEVA_FUNDS } from '@/data/temple';
import type { TempleEvent } from '@/data/types';
import { useApp } from '@/store/app-store';
import { C, usePalette } from '@/theme';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

function EventRow({ e }: { e: TempleEvent }) {
  const p = usePalette();
  const open = e.roles.reduce((n, r) => n + Math.max(0, r.needed - r.filled), 0);
  return (
    <Press onPress={() => router.push(`/event/${e.id}`)} scaleTo={0.98} style={{ flexDirection: 'row', gap: 14, backgroundColor: p.card, borderRadius: 22, padding: 12, borderWidth: 1, borderColor: p.line }}>
      <LinearGradient colors={e.gradient} style={{ width: 64, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>{format(parseISO(e.date), 'MMM').toUpperCase()}</Text>
        <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 26, color: 'white' }}>{format(parseISO(e.date), 'd')}</Text>
      </LinearGradient>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: p.text }}>{e.title}</Text>
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: p.textSoft, marginTop: 2 }} numberOfLines={1}>{e.subtitle}</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 6 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: C.saffronDeep }}>{open} seva spots open</Text>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.muted }}>{e.going} going</Text>
        </View>
      </View>
      <ChevronRight size={20} color={p.muted} style={{ alignSelf: 'center' }} />
    </Press>
  );
}

export default function Seva() {
  const p = usePalette();
  const [tab, setTab] = useState<'serve' | 'give'>('serve');
  const mySkills = useApp((s) => s.mySkills);
  const featured = EVENTS[0];
  const forMe = EVENTS.flatMap((e) => e.roles.filter((r) => mySkills.includes(r.skill) && r.filled < r.needed).map((r) => ({ e, r })));

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: p.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} stickyHeaderIndices={[1]}>
        <Header eyebrow="ISKCON Coimbatore" title="Offer your seva" />
        <View style={{ backgroundColor: p.bg, paddingHorizontal: 20, paddingBottom: 12 }}>
          <View style={{ flexDirection: 'row', backgroundColor: p.card, borderRadius: 999, padding: 4, borderWidth: 1, borderColor: p.line }}>
            {(['serve', 'give'] as const).map((t) => (
              <Press key={t} onPress={() => setTab(t)} accessibilityState={{ selected: tab === t }} style={{ flex: 1, height: 42, borderRadius: 999, alignItems: 'center', justifyContent: 'center', backgroundColor: tab === t ? C.ink : 'transparent' }}>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: tab === t ? 'white' : p.textSoft }}>{t === 'serve' ? 'Volunteer' : 'Donate & sevas'}</Text>
              </Press>
            ))}
          </View>
        </View>

        {tab === 'serve' ? (
          <View style={{ paddingHorizontal: 20, gap: 14 }}>
            <Press onPress={() => router.push(`/event/${featured.id}`)} scaleTo={0.98}>
              <LinearGradient colors={featured.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 28, padding: 20, overflow: 'hidden', minHeight: 210, justifyContent: 'flex-end' }}>
                <View style={{ position: 'absolute', top: -60, right: -60 }}>
                  <Mandala size={260} opacity={0.22} />
                </View>
                <View style={{ position: 'absolute', top: 18, left: 18, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: C.saffronDeep }}>FEATURED FESTIVAL</Text>
                </View>
                <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 30, color: 'white' }}>{featured.title}</Text>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: 'rgba(255,255,255,0.92)', marginTop: 4 }}>{featured.subtitle}</Text>
                <View style={{ flexDirection: 'row', gap: 16, marginTop: 12 }}>
                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                    <CalendarDays size={14} color="white" />
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: 'white' }}>{format(parseISO(featured.date), 'EEE, d MMM')}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                    <MapPin size={14} color="white" />
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: 'white' }}>{featured.venue}</Text>
                  </View>
                </View>
              </LinearGradient>
            </Press>

            {forMe.length > 0 && (
              <>
                <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text, marginTop: 8 }}>Needs your skills</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }} style={{ marginHorizontal: -20 }}>
                  {forMe.map(({ e, r }) => (
                    <Press key={`${e.id}-${r.id}`} onPress={() => router.push(`/event/${e.id}`)} style={{ width: 220, backgroundColor: p.card, borderRadius: 22, padding: 14, borderWidth: 1, borderColor: p.line, gap: 8 }}>
                      <SkillChip id={r.skill} size="sm" />
                      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: p.text }} numberOfLines={2}>{r.title}</Text>
                      <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.muted }}>{e.title} · {format(parseISO(e.date), 'd MMM')}</Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: C.saffronDeep }}>{r.needed - r.filled} spots</Text>
                        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: '#8A6314' }}>+{r.credits} credits</Text>
                      </View>
                    </Press>
                  ))}
                </ScrollView>
              </>
            )}

            <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text, marginTop: 8 }}>Upcoming at the temple</Text>
            {EVENTS.slice(1).map((e) => (
              <EventRow key={e.id} e={e} />
            ))}
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', padding: 14, borderRadius: 18, backgroundColor: p.dark ? p.card : C.tulasiSoft }}>
              <UsersRound size={18} color={C.tulasi} />
              <Text style={{ flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13, color: p.dark ? p.textSoft : C.tulasi, lineHeight: 18 }}>
                No special skill? Every event has chanting, serving and welcome roles – they count just as much.
              </Text>
            </View>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20, gap: 14 }}>
            {SEVA_FUNDS.map((f) => {
              const min = Math.min(...f.tiers.filter((t) => t.amount).map((t) => t.amount!));
              return (
                <Press key={f.id} onPress={() => router.push(`/donate/${f.id}`)} scaleTo={0.98} style={{ borderRadius: 26, overflow: 'hidden', backgroundColor: p.card, borderWidth: 1, borderColor: p.line }}>
                  <LinearGradient colors={f.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={f.icon} size={24} color="white" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 21, color: 'white' }}>{f.name}</Text>
                      <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: 'rgba(255,255,255,0.92)' }}>{f.tagline}</Text>
                    </View>
                  </LinearGradient>
                  <View style={{ padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: p.textSoft, flex: 1 }} numberOfLines={1}>
                      {f.tiers.slice(0, 3).map((t) => t.label).join(' · ')}
                    </Text>
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: C.saffronDeep }}>from {inr(min)}</Text>
                  </View>
                </Press>
              );
            })}
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: p.muted, textAlign: 'center', lineHeight: 18 }}>
              Seva amounts from iskconcoimbatore.com · donations eligible for 80G receipts
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
