import { format, parseISO } from 'date-fns';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { CalendarDays, Check, ChevronLeft, Clock, MapPin, UsersRound } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Mandala } from '@/components/mandala';
import { Press } from '@/components/press';
import { SkillChip } from '@/components/skill-chip';
import { CURRENT_USER_ID, DEVOTEES } from '@/data/devotees';
import { EVENTS } from '@/data/temple';
import { rolesFor } from '@/lib/match';
import { useApp } from '@/store/app-store';
import { C, usePalette } from '@/theme';

export default function EventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = usePalette();
  const e = EVENTS.find((x) => x.id === id)!;
  const { mySkills, volunteered, volunteer, rsvps, rsvp, formTeam } = useApp();
  const [team, setTeam] = useState<string[]>([]);

  const fits = DEVOTEES.filter((d) => d.id !== CURRENT_USER_ID && rolesFor(e, d.skills).some((r) => r.skill !== 'chanting'));
  const going = !!rsvps[e.id];

  return (
    <View style={{ flex: 1, backgroundColor: p.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: team.length ? 140 : 60 }}>
        <LinearGradient colors={e.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingBottom: 28, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', right: -80, top: -20 }}>
            <Mandala size={340} opacity={0.2} />
          </View>
          <SafeAreaView edges={['top']} style={{ paddingHorizontal: 20 }}>
            <Press onPress={() => router.back()} accessibilityLabel="Back" style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={24} color="white" />
            </Press>
            <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 34, lineHeight: 40, color: 'white', marginTop: 40 }}>{e.title}</Text>
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: 'rgba(255,255,255,0.92)', marginTop: 6 }}>{e.subtitle}</Text>
            <View style={{ gap: 8, marginTop: 16 }}>
              {[
                [CalendarDays, format(parseISO(e.date), 'EEEE, d MMMM yyyy')],
                [Clock, e.time],
                [MapPin, `${e.venue} · Sri Jagannath Mandir`],
              ].map(([I, t], i) => {
                const Ico = I as typeof CalendarDays;
                return (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Ico size={15} color="white" />
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: 'white' }}>{t as string}</Text>
                  </View>
                );
              })}
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={{ padding: 20, gap: 14 }}>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 23, color: p.textSoft }}>{e.description}</Text>
          <Press onPress={() => rsvp(e.id)} disabled={going} style={{ height: 54, borderRadius: 999, backgroundColor: going ? C.tulasiSoft : C.ink, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}>
            {going && <Check size={18} color={C.tulasi} strokeWidth={3} />}
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: going ? C.tulasi : 'white' }}>
              {going ? 'You’re going · check in on the day for +' + e.attendCredits : `I’ll attend · +${e.attendCredits} on check-in`}
            </Text>
          </Press>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: p.muted, textAlign: 'center' }}>{e.going + (going ? 1 : 0)} devotees going</Text>

          <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text, marginTop: 8 }}>Seva roles</Text>
          {e.roles.map((r) => {
            const mine = mySkills.includes(r.skill) || r.skill === 'chanting';
            const signed = !!volunteered[`${e.id}:${r.id}`];
            const filled = r.filled + (signed ? 1 : 0);
            return (
              <View key={r.id} style={{ backgroundColor: p.card, borderRadius: 22, padding: 14, borderWidth: mine ? 1.5 : 1, borderColor: mine ? C.saffron : p.line, gap: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <SkillChip id={r.skill} size="sm" />
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: '#8A6314' }}>+{r.credits} credits</Text>
                </View>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: p.text }}>{r.title}</Text>
                <View style={{ height: 6, borderRadius: 3, backgroundColor: p.line }}>
                  <View style={{ width: `${Math.min(100, (filled / r.needed) * 100)}%`, height: 6, borderRadius: 3, backgroundColor: C.tulasi }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: p.muted }}>{filled} of {r.needed} filled</Text>
                  <Press
                    onPress={() => volunteer(e.id, r.id)}
                    disabled={signed}
                    style={{ height: 38, paddingHorizontal: 16, borderRadius: 999, backgroundColor: signed ? C.tulasiSoft : mine ? C.saffronDeep : p.bg, borderWidth: mine || signed ? 0 : 1, borderColor: p.line, justifyContent: 'center', flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {signed && <Check size={14} color={C.tulasi} strokeWidth={3} />}
                    <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: signed ? C.tulasi : mine ? 'white' : p.text }}>{signed ? 'Signed up' : 'Volunteer'}</Text>
                  </Press>
                </View>
              </View>
            );
          })}

          <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text, marginTop: 8 }}>Saathis who fit this seva</Text>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: p.textSoft, marginTop: -8 }}>Select devotees to form a team – a group chat opens and coordinators are notified.</Text>
          {fits.map((d) => {
            const on = team.includes(d.id);
            const role = rolesFor(e, d.skills).find((r) => r.skill !== 'chanting');
            return (
              <Press key={d.id} onPress={() => setTeam((t) => (on ? t.filter((x) => x !== d.id) : [...t, d.id]))} accessibilityState={{ selected: on }} scaleTo={0.98} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 20, backgroundColor: on ? (p.dark ? '#2E2116' : C.saffronSoft) : p.card, borderWidth: 1, borderColor: on ? C.saffron : p.line }}>
                <Avatar devotee={d} size={48} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: p.text }}>{d.name}</Text>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: p.muted }} numberOfLines={1}>{role?.title} · {d.headline}</Text>
                </View>
                <View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: on ? C.saffronDeep : p.line, backgroundColor: on ? C.saffronDeep : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                  {on && <Check size={16} color="white" strokeWidth={3} />}
                </View>
              </Press>
            );
          })}
        </View>
      </ScrollView>

      {team.length > 0 && (
        <View style={{ position: 'absolute', left: 20, right: 20, bottom: 36 }}>
          <Press onPress={() => router.replace(`/chat/${formTeam(e.id, team)}`)} style={{ height: 58, borderRadius: 999, backgroundColor: C.saffronDeep, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: '#2B1B10', shadowOpacity: 0.25, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } }}>
            <UsersRound size={20} color="white" />
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: 'white' }}>Form seva team with {team.length}</Text>
          </Press>
        </View>
      )}
    </View>
  );
}
