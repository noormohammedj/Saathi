import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MessageCircle, Search } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Header } from '@/components/header';
import { Icon } from '@/components/icon';
import { Mandala } from '@/components/mandala';
import { Press } from '@/components/press';
import { CURRENT_USER_ID, DEVOTEES } from '@/data/devotees';
import { SKILLS, skillById } from '@/data/skills';
import { CIRCLES } from '@/data/temple';
import type { Circle, SkillId } from '@/data/types';
import { useApp } from '@/store/app-store';
import { TONE, usePalette } from '@/theme';

function CircleCard({ c, joined }: { c: Circle; joined: boolean }) {
  const skill = skillById(c.skill);
  return (
    <Press onPress={() => router.push(`/circle/${c.id}`)} scaleTo={0.97} style={{ width: 230 }}>
      <LinearGradient colors={c.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 24, padding: 16, height: 170, overflow: 'hidden', justifyContent: 'space-between' }}>
        <View style={{ position: 'absolute', right: -50, bottom: -60 }}>
          <Mandala size={180} opacity={0.22} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={skill.icon} size={20} color="white" />
          </View>
          {joined && (
            <View style={{ backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 10, height: 24, borderRadius: 12, justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 11, color: '#2B1B10' }}>JOINED</Text>
            </View>
          )}
        </View>
        <View>
          <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 20, color: 'white' }} numberOfLines={1}>{c.name}</Text>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: 'rgba(255,255,255,0.9)', marginTop: 2 }} numberOfLines={2}>{c.tagline}</Text>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: 'white', marginTop: 8 }}>{c.members} members · {c.nextMeet}</Text>
        </View>
      </LinearGradient>
    </Press>
  );
}

export default function Sangha() {
  const p = usePalette();
  const joined = useApp((s) => s.joinedCircles);
  const openDirectThread = useApp((s) => s.openDirectThread);
  const [skill, setSkill] = useState<SkillId | null>('music');
  const [q, setQ] = useState('');

  const mine = CIRCLES.filter((c) => joined.includes(c.id));
  const others = CIRCLES.filter((c) => !joined.includes(c.id));
  const query = q.trim().toLowerCase();
  const people = DEVOTEES.filter((d) => d.id !== CURRENT_USER_ID).filter((d) =>
    query
      ? d.name.toLowerCase().includes(query) || d.headline.toLowerCase().includes(query) || d.skills.some((s) => skillById(s).label.toLowerCase().includes(query))
      : skill
        ? d.skills.includes(skill)
        : true,
  );

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: p.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} keyboardShouldPersistTaps="handled">
        <Header eyebrow="Micro-communities" title="Your Sangha" />

        <Text style={{ marginHorizontal: 20, marginBottom: 12, fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text }}>My circles</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {mine.map((c) => (
            <CircleCard key={c.id} c={c} joined />
          ))}
        </ScrollView>

        <Text style={{ marginHorizontal: 20, marginTop: 28, marginBottom: 12, fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text }}>Discover circles</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
          {others.map((c) => (
            <CircleCard key={c.id} c={c} joined={false} />
          ))}
        </ScrollView>

        <Text style={{ marginHorizontal: 20, marginTop: 28, fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text }}>Find devotees by skill</Text>
        <View style={{ marginHorizontal: 20, marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, borderRadius: 25, paddingHorizontal: 16, backgroundColor: p.card, borderWidth: 1, borderColor: p.line }}>
          <Search size={18} color={p.muted} />
          <TextInput value={q} onChangeText={setQ} placeholder="Try “mridanga”, “video” or “Gita”" placeholderTextColor={p.muted} accessibilityLabel="Search devotees" style={{ flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: p.text }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingVertical: 12 }}>
          {SKILLS.map((s) => {
            const on = skill === s.id && !query;
            const tone = TONE[s.tone];
            return (
              <Press key={s.id} onPress={() => { setQ(''); setSkill(on ? null : s.id); }} accessibilityState={{ selected: on }} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 38, paddingHorizontal: 12, borderRadius: 999, backgroundColor: on ? tone.solid : p.card, borderWidth: 1, borderColor: on ? tone.solid : p.line }}>
                <Icon name={s.icon} size={14} color={on ? 'white' : tone.fg} />
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: on ? 'white' : p.text }}>{s.label}</Text>
              </Press>
            );
          })}
        </ScrollView>
        <View style={{ marginHorizontal: 20, gap: 10 }}>
          {people.map((d) => (
            <Animated.View key={d.id} entering={FadeIn}>
              <Press onPress={() => router.push(`/profile/${d.id}`)} scaleTo={0.98} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 20, backgroundColor: p.card, borderWidth: 1, borderColor: p.line }}>
                <Avatar devotee={d} size={50} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: p.text }}>{d.name}</Text>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: p.muted }} numberOfLines={1}>{d.headline} · since {d.sinceYear}</Text>
                </View>
                <Press onPress={() => router.push(`/chat/${openDirectThread(d.id)}`)} accessibilityLabel={`Message ${d.name}`} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: p.bg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: p.line }}>
                  <MessageCircle size={19} color={p.text} />
                </Press>
              </Press>
            </Animated.View>
          ))}
          {!people.length && <Text style={{ fontFamily: 'Inter_500Medium', color: p.muted, textAlign: 'center', padding: 20 }}>No devotees found – invite a friend with this skill!</Text>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
