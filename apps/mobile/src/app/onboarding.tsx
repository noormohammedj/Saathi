import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ArrowRight, Check, Coins, HandHeart, LockKeyhole, Sparkles, UsersRound } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Icon } from '@/components/icon';
import { Mandala } from '@/components/mandala';
import { Press } from '@/components/press';
import { SKILLS } from '@/data/skills';
import { TEMPLE } from '@/data/temple';
import type { SkillId } from '@/data/types';
import { useApp } from '@/store/app-store';
import { C, TONE, usePalette } from '@/theme';

const PILLARS = [
  { Icon: UsersRound, title: 'Find your Saathis', body: 'Meet devotees whose skills complete yours – and serve the next festival together.', color: C.lotus },
  { Icon: HandHeart, title: 'Offer your seva', body: 'Musician, coder, cook or simply a chanter – every gift has a place at the temple.', color: C.saffron },
  { Icon: Coins, title: 'Grow in bhakti', body: 'Visits, japa, Gita and seva build streaks and credits for prasadam, archana and festival passes.', color: C.gold },
];

function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <LinearGradient colors={['#B85410', '#E8761C', '#D9577E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <View style={{ position: 'absolute', top: -80, alignSelf: 'center' }}>
        <Mandala size={520} opacity={0.16} />
      </View>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' }}>
        <Animated.View entering={FadeIn.duration(800)} style={{ marginTop: 24 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', color: 'rgba(255,255,255,0.85)', letterSpacing: 3, fontSize: 12 }}>
            {TEMPLE.name.toUpperCase()}
          </Text>
        </Animated.View>

        <View>
          <Animated.Text entering={FadeInDown.delay(200).duration(700)} style={{ fontFamily: 'Fraunces_700Bold', fontSize: 64, color: 'white', letterSpacing: -1 }}>
            Saathi
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(350).duration(700)} style={{ fontFamily: 'Fraunces_500Medium_Italic', fontSize: 24, lineHeight: 32, color: 'rgba(255,255,255,0.95)', marginTop: 4 }}>
            Every visitor has a gift.{'\n'}Find the devotees to offer it with.
          </Animated.Text>

          <View style={{ marginTop: 32, gap: 12 }}>
            {PILLARS.map(({ Icon: I, title, body }, i) => (
              <Animated.View key={title} entering={FadeInUp.delay(500 + i * 120).duration(600)} style={{ flexDirection: 'row', gap: 14, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 20, padding: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.22)' }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center' }}>
                  <I size={20} color={C.saffronDeep} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', color: 'white', fontSize: 15 }}>{title}</Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 18, marginTop: 2 }}>{body}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>

        <Animated.View entering={FadeInUp.delay(900)} style={{ marginBottom: 12 }}>
          <Press onPress={onNext} style={{ backgroundColor: 'white', height: 58, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: C.saffronDeep }}>Hare Krishna, let’s begin</Text>
            <ArrowRight size={20} color={C.saffronDeep} />
          </Press>
          <Text style={{ textAlign: 'center', marginTop: 12, fontFamily: 'Inter_500Medium', fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
            Signed in as Noor · devotee since 2022
          </Text>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function PickSkills({ onDone }: { onDone: (s: SkillId[]) => void }) {
  const p = usePalette();
  const [picked, setPicked] = useState<SkillId[]>(['tech', 'digital', 'chanting']);
  const toggle = (id: SkillId) => setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: p.bg }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 160 }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, letterSpacing: 2, color: C.saffronDeep }}>STEP 2 OF 2</Text>
        <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 32, lineHeight: 38, color: p.text, marginTop: 8 }}>How would you love to serve?</Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 22, color: p.textSoft, marginTop: 8 }}>
          Pick your skills. No special skill? Chanting, serving prasadam and welcoming guests are treasured seva too.
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 24 }}>
          {SKILLS.map((s) => {
            const on = picked.includes(s.id);
            const tone = TONE[s.tone];
            return (
              <Press
                key={s.id}
                onPress={() => toggle(s.id)}
                accessibilityState={{ selected: on }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, height: 46, borderRadius: 999, borderWidth: 1.5, borderColor: on ? tone.solid : p.line, backgroundColor: on ? tone.bg : p.card }}>
                {on ? <Check size={16} color={tone.fg} strokeWidth={3} /> : <Icon name={s.icon} size={16} color={p.textSoft} />}
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: on ? tone.fg : p.text }}>{s.label}</Text>
              </Press>
            );
          })}
        </View>

        <View style={{ marginTop: 28, flexDirection: 'row', gap: 12, padding: 16, borderRadius: 20, backgroundColor: p.dark ? p.card : C.peacockSoft }}>
          <LockKeyhole size={20} color={C.peacock} />
          <Text style={{ flex: 1, fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 19, color: p.dark ? p.textSoft : C.peacockDeep }}>
            Your mobile number and email are never shown to other devotees. Only temple admins can see them – Saathis talk through in-app chat.
          </Text>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', left: 24, right: 24, bottom: 36 }}>
        <Press onPress={() => onDone(picked)} style={{ backgroundColor: C.saffronDeep, height: 58, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <Sparkles size={18} color="white" />
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: 'white' }}>Show me my Saathis</Text>
        </Press>
      </View>
    </SafeAreaView>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const complete = useApp((s) => s.completeOnboarding);
  if (step === 0) return <Welcome onNext={() => setStep(1)} />;
  return (
    <PickSkills
      onDone={(skills) => {
        complete(skills);
        router.replace('/discover');
      }}
    />
  );
}
