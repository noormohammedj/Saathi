import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { CalendarClock, Check, ChevronLeft, Crown, Plus } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Icon } from '@/components/icon';
import { Mandala } from '@/components/mandala';
import { Press } from '@/components/press';
import { DEVOTEES, devoteeById } from '@/data/devotees';
import { skillById } from '@/data/skills';
import { CIRCLES, EVENTS } from '@/data/temple';
import { useApp } from '@/store/app-store';
import { C, usePalette } from '@/theme';

export default function CircleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = usePalette();
  const c = CIRCLES.find((x) => x.id === id)!;
  const joined = useApp((s) => s.joinedCircles.includes(c.id));
  const toggle = useApp((s) => s.toggleCircle);
  const lead = devoteeById(c.leadId);
  const members = DEVOTEES.filter((d) => d.circles.includes(c.id) || d.skills.includes(c.skill));
  const events = EVENTS.filter((e) => e.roles.some((r) => r.skill === c.skill));
  const skill = skillById(c.skill);

  return (
    <View style={{ flex: 1, backgroundColor: p.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <LinearGradient colors={c.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingBottom: 28, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', right: -70, top: 10 }}>
            <Mandala size={320} opacity={0.2} />
          </View>
          <SafeAreaView edges={['top']} style={{ paddingHorizontal: 20 }}>
            <Press onPress={() => router.back()} accessibilityLabel="Back" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={24} color="white" />
            </Press>
            <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center', marginTop: 28 }}>
              <Icon name={skill.icon} size={28} color="white" />
            </View>
            <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 34, color: 'white', marginTop: 14 }}>{c.name}</Text>
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: 'rgba(255,255,255,0.92)', marginTop: 4 }}>{c.tagline}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 }}>
              <CalendarClock size={15} color="white" />
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: 'white' }}>{c.nextMeet} · {c.members} members</Text>
            </View>
            <Press onPress={() => toggle(c.id)} style={{ marginTop: 18, alignSelf: 'flex-start', height: 46, paddingHorizontal: 20, borderRadius: 999, backgroundColor: joined ? 'rgba(255,255,255,0.2)' : 'white', borderWidth: joined ? 1.5 : 0, borderColor: 'white', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {joined ? <Check size={18} color="white" strokeWidth={3} /> : <Plus size={18} color={C.ink} strokeWidth={3} />}
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: joined ? 'white' : C.ink }}>{joined ? 'Joined' : c.openToAll ? 'Join circle' : 'Request to join'}</Text>
            </Press>
          </SafeAreaView>
        </LinearGradient>

        <View style={{ padding: 20, gap: 14 }}>
          <Press onPress={() => router.push(`/profile/${lead.id}`)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 20, backgroundColor: p.card, borderWidth: 1, borderColor: p.line }}>
            <Avatar devotee={lead} size={52} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Crown size={14} color={C.gold} />
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: '#8A6314', letterSpacing: 1 }}>CIRCLE LEAD</Text>
              </View>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: p.text }}>{lead.name}</Text>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: p.muted }}>{lead.headline}</Text>
            </View>
          </Press>

          {events.length > 0 && (
            <>
              <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text, marginTop: 6 }}>Circle seva coming up</Text>
              {events.map((e) => {
                const role = e.roles.find((r) => r.skill === c.skill)!;
                return (
                  <Press key={e.id} onPress={() => router.push(`/event/${e.id}`)} style={{ padding: 14, borderRadius: 20, backgroundColor: p.card, borderWidth: 1, borderColor: p.line }}>
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: p.text }}>{e.title}</Text>
                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: p.muted, marginTop: 2 }}>{role.title} · {role.needed - role.filled} spots · +{role.credits} credits</Text>
                  </Press>
                );
              })}
            </>
          )}

          <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text, marginTop: 6 }}>Members you can meet</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
            {members.map((d) => (
              <Press key={d.id} onPress={() => router.push(`/profile/${d.id}`)} style={{ alignItems: 'center', width: 72 }}>
                <Avatar devotee={d} size={60} />
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: p.text, marginTop: 6 }} numberOfLines={1}>{d.name.split(' ')[0]}</Text>
              </Press>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
