import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { BookOpen, Check, ChevronRight, Flame, Headphones, MapPin, QrCode, Sparkles } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeOut, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '@/components/header';
import { JapaRing } from '@/components/japa-ring';
import { Mandala } from '@/components/mandala';
import { Press } from '@/components/press';
import { ARATI_SCHEDULE, TEMPLE } from '@/data/temple';
import { BEADS_PER_ROUND, useApp } from '@/store/app-store';
import { C, usePalette } from '@/theme';

function TaskCard({ icon, title, sub, points, done, onPress, tint }: { icon: React.ReactNode; title: string; sub: string; points: number; done: boolean; onPress: () => void; tint: string }) {
  const p = usePalette();
  return (
    <Press onPress={onPress} disabled={done} accessibilityState={{ disabled: done }} style={{ flexBasis: '48%', flexGrow: 1, backgroundColor: p.card, borderRadius: 22, padding: 14, borderWidth: 1, borderColor: done ? C.tulasi : p.line, gap: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: tint, alignItems: 'center', justifyContent: 'center' }}>{icon}</View>
        {done ? (
          <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: C.tulasi, alignItems: 'center', justifyContent: 'center' }}>
            <Check size={15} color="white" strokeWidth={3} />
          </View>
        ) : (
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: '#8A6314' }}>+{points}</Text>
        )}
      </View>
      <View>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: p.text }}>{title}</Text>
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.muted, marginTop: 2 }} numberOfLines={2}>{sub}</Text>
      </View>
    </Press>
  );
}

function CheckInSheet({ onClose }: { onClose: () => void }) {
  const p = usePalette();
  const checkIn = useApp((s) => s.checkIn);
  const [stage, setStage] = useState<'locating' | 'found' | 'done'>('locating');
  // Prototype: simulate the geofence; production uses expo-location + rotating temple QR.
  useEffect(() => {
    const t = setTimeout(() => setStage('found'), 1300);
    return () => clearTimeout(t);
  }, []);
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(20,13,8,0.55)', justifyContent: 'flex-end' }}>
      <Press haptic={false} scaleTo={1} onPress={onClose} style={{ flex: 1 }} accessibilityLabel="Close">
        <View />
      </Press>
      <Animated.View entering={FadeInDown.springify().damping(18)} style={{ backgroundColor: p.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 48, alignItems: 'center', gap: 12 }}>
        {stage === 'locating' && (
          <>
            <ActivityIndicator color={C.saffron} size="large" />
            <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text }}>Finding you at the temple…</Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: p.textSoft }}>Using location within 150 m of {TEMPLE.mandir}</Text>
          </>
        )}
        {stage === 'found' && (
          <>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: C.saffronSoft, alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={30} color={C.saffronDeep} />
            </View>
            <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text, textAlign: 'center' }}>You’re at {TEMPLE.mandir}</Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: p.textSoft, textAlign: 'center' }}>{TEMPLE.address}</Text>
            <Press
              onPress={() => {
                checkIn();
                setStage('done');
                setTimeout(onClose, 1600);
              }}
              style={{ marginTop: 8, alignSelf: 'stretch', height: 56, borderRadius: 999, backgroundColor: C.saffronDeep, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'Inter_700Bold', color: 'white', fontSize: 16 }}>Check in for darshan · +10</Text>
            </Press>
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
              <QrCode size={14} color={p.muted} />
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.muted }}>Or scan the QR at the temple entrance</Text>
            </View>
          </>
        )}
        {stage === 'done' && (
          <Animated.View entering={ZoomIn.springify()} style={{ alignItems: 'center', gap: 8 }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: C.tulasi, alignItems: 'center', justifyContent: 'center' }}>
              <Check size={36} color="white" strokeWidth={3} />
            </View>
            <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 24, color: p.text }}>Jaya Jagannath!</Text>
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: p.textSoft }}>+10 credits · visit counted toward your streak</Text>
          </Animated.View>
        )}
      </Animated.View>
    </Animated.View>
  );
}

export default function Sadhana() {
  const p = usePalette();
  const { today, streakDays, history, gitaChapter, logGita, logLecture } = useApp();
  const [celebrate, setCelebrate] = useState<string | null>(null);
  const [checkin, setCheckin] = useState(false);
  const toBonus = Math.max(0, 30 - streakDays);

  const onRound = (goal: boolean) => {
    setCelebrate(goal ? '16 rounds complete! +8 bonus' : 'Round complete · +1');
    setTimeout(() => setCelebrate(null), 1800);
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: p.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }}>
        <Header eyebrow={`Day ${streakDays} of your streak`} title="Daily Sadhana" />

        <LinearGradient colors={['#B85410', '#E8761C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ marginHorizontal: 20, borderRadius: 28, padding: 18, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', right: -50, top: -50 }}>
            <Mandala size={200} opacity={0.2} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
              <Flame size={30} color="white" fill="rgba(255,255,255,0.35)" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 30, color: 'white' }}>{streakDays}-day streak</Text>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: 'rgba(255,255,255,0.92)' }}>
                {toBonus ? `${toBonus} more days to the 30-day bonus · +250` : '30-day bonus unlocked!'}
              </Text>
            </View>
          </View>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)', marginTop: 16 }}>
            <View style={{ width: `${Math.min(100, (streakDays / 30) * 100)}%`, height: 8, borderRadius: 4, backgroundColor: 'white' }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
              const v = history[history.length - 7 + i];
              return (
                <View key={i} style={{ alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: v ? 'white' : 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                    {v ? <Check size={15} color={C.saffronDeep} strokeWidth={3} /> : null}
                  </View>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: 'rgba(255,255,255,0.9)' }}>{d}</Text>
                </View>
              );
            })}
          </View>
        </LinearGradient>

        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <JapaRing onRound={onRound} />
          <Text style={{ fontFamily: 'Fraunces_500Medium_Italic', fontSize: 15, color: p.textSoft, textAlign: 'center', marginTop: 16, lineHeight: 22, paddingHorizontal: 32 }}>
            Hare Krishna Hare Krishna Krishna Krishna Hare Hare{'\n'}Hare Rama Hare Rama Rama Rama Hare Hare
          </Text>
          <Press onPress={() => { for (let i = 0; i < BEADS_PER_ROUND - today.beads; i++) useApp.getState().tapBead(); onRound(useApp.getState().today.rounds === 16); }} style={{ marginTop: 10, paddingHorizontal: 14, height: 36, borderRadius: 999, borderWidth: 1, borderColor: p.line, justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: p.textSoft }}>Chanted on my own mala · log round</Text>
          </Press>
          {celebrate && (
            <Animated.View entering={ZoomIn.springify()} exiting={FadeOut} style={{ position: 'absolute', top: 110, flexDirection: 'row', gap: 6, alignItems: 'center', backgroundColor: C.tulasi, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 }}>
              <Sparkles size={16} color="white" />
              <Text style={{ fontFamily: 'Inter_700Bold', color: 'white' }}>{celebrate}</Text>
            </Animated.View>
          )}
        </View>

        <Text style={{ marginHorizontal: 20, marginTop: 28, marginBottom: 12, fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text }}>Today’s offerings</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginHorizontal: 20 }}>
          <TaskCard icon={<MapPin size={20} color={C.saffronDeep} />} tint={C.saffronSoft} title="Temple visit" sub={today.visited ? 'Checked in today' : 'Geo + QR check-in'} points={10} done={today.visited} onPress={() => setCheckin(true)} />
          <TaskCard icon={<BookOpen size={20} color="#8A6314" />} tint={C.goldSoft} title="Read the Gita" sub={today.gitaChapters ? `${today.gitaChapters} chapter today` : `Continue Chapter ${gitaChapter}`} points={8} done={today.gitaChapters >= 2} onPress={logGita} />
          <TaskCard icon={<Headphones size={20} color={C.peacockDeep} />} tint={C.peacockSoft} title="Hear a lecture" sub={today.lectureMins ? `${today.lectureMins} min heard` : 'Bhagavatam class · 8:00 AM'} points={6} done={today.lectureMins >= 60} onPress={logLecture} />
          <TaskCard icon={<Sparkles size={20} color="#A8355A" />} tint={C.lotusSoft} title="Attend a programme" sub="Sunday Love Feast · 4:30 PM" points={20} done={false} onPress={() => router.push('/event/sunday-feast')} />
        </View>

        <Text style={{ marginHorizontal: 20, marginTop: 28, marginBottom: 12, fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text }}>Five weeks of bhakti</Text>
        <View style={{ marginHorizontal: 20, backgroundColor: p.card, borderRadius: 22, padding: 16, borderWidth: 1, borderColor: p.line }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {history.map((v, i) => (
              <View key={i} style={{ width: '12.4%', aspectRatio: 1, borderRadius: 8, backgroundColor: [p.line, '#CFE5CC', '#9FCB9C', '#62A26C', C.tulasi][v] }} />
            ))}
          </View>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.muted, marginTop: 10 }}>Darker = more of japa, Gita, hearing and visits that day</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 28, marginBottom: 12 }}>
          <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text }}>Darshan today</Text>
          <Press onPress={() => router.push('/rewards')} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', color: C.saffronDeep }}>How credits work</Text>
            <ChevronRight size={16} color={C.saffronDeep} />
          </Press>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
          {ARATI_SCHEDULE.map((a, i) => (
            <View key={a.name} style={{ width: 128, padding: 14, borderRadius: 20, backgroundColor: i === 8 ? C.peacock : p.card, borderWidth: 1, borderColor: i === 8 ? C.peacock : p.line }}>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: i === 8 ? 'white' : p.text }}>{a.time}</Text>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: i === 8 ? 'rgba(255,255,255,0.9)' : p.textSoft, marginTop: 4 }}>{a.name}</Text>
              {i === 8 && <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: C.goldSoft, marginTop: 6 }}>NEXT</Text>}
            </View>
          ))}
        </ScrollView>
      </ScrollView>
      {checkin && <CheckInSheet onClose={() => setCheckin(false)} />}
    </SafeAreaView>
  );
}
