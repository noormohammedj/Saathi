import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { BadgeCheck, Languages, LockKeyhole, Mail, MapPin, MessageCircle, Phone, ShieldCheck, X } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Mandala } from '@/components/mandala';
import { Press } from '@/components/press';
import { SkillChip } from '@/components/skill-chip';
import { devoteeById } from '@/data/devotees';
import { CIRCLES } from '@/data/temple';
import { sevaMatch, yearsWithIskcon } from '@/lib/match';
import { useApp } from '@/store/app-store';
import { C, usePalette } from '@/theme';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const p = usePalette();
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 1.4, color: p.muted }}>{title}</Text>
      {children}
    </View>
  );
}

export default function Profile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = usePalette();
  const d = devoteeById(id);
  const match = sevaMatch(d);
  const role = useApp((s) => s.role);
  const contact = useApp((s) => s.contactFor)(d.id);
  const openDirectThread = useApp((s) => s.openDirectThread);
  void role; // re-render when the admin role changes

  return (
    <View style={{ flex: 1, backgroundColor: p.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <LinearGradient colors={d.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingTop: 24, paddingBottom: 28, alignItems: 'center', overflow: 'hidden' }}>
          <View style={{ position: 'absolute', top: -60 }}>
            <Mandala size={420} opacity={0.18} />
          </View>
          <Press onPress={() => router.back()} accessibilityLabel="Close" style={{ alignSelf: 'flex-end', marginRight: 16, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} color="white" />
          </Press>
          <Avatar devotee={{ ...d, verified: false }} size={112} ring="rgba(255,255,255,0.7)" />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 }}>
            <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 32, color: 'white' }}>{d.name}</Text>
            {d.verified && <BadgeCheck size={24} color="white" />}
          </View>
          {d.initiatedName && <Text style={{ fontFamily: 'Fraunces_500Medium_Italic', fontSize: 16, color: 'rgba(255,255,255,0.92)' }}>{d.initiatedName}</Text>}
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: 'white', marginTop: 4 }}>{d.headline}</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 }}>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: C.saffronDeep }}>{match.score}% seva match</Text>
            </View>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: 'white' }}>With ISKCON since {d.sinceYear} · {yearsWithIskcon(d.sinceYear)} yrs</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={{ padding: 20, gap: 24 }}>
          <View style={{ flexDirection: 'row', backgroundColor: p.card, borderRadius: 22, padding: 16, borderWidth: 1, borderColor: p.line }}>
            {[
              [`${d.roundsPerDay}`, 'rounds a day'],
              [`${d.streakDays}`, 'day streak'],
              [`${d.sevaHours}`, 'seva hours'],
            ].map(([v, l]) => (
              <View key={l} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 26, color: p.text }}>{v}</Text>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.muted }}>{l}</Text>
              </View>
            ))}
          </View>

          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 24, color: p.text }}>{d.bio}</Text>

          <Section title="SKILLS TO OFFER">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {d.skills.map((s) => <SkillChip key={s} id={s} />)}
            </View>
          </Section>

          {match.reasons.length > 0 && (
            <Section title="WHY YOU’D SERVE WELL TOGETHER">
              {match.reasons.map((r) => (
                <View key={r} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.saffron }} />
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: p.text }}>{r}</Text>
                </View>
              ))}
            </Section>
          )}

          {d.prompts.map((pr) => (
            <View key={pr.q} style={{ backgroundColor: p.card, borderRadius: 22, padding: 18, borderWidth: 1, borderColor: p.line }}>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 1.2, color: C.saffronDeep }}>{pr.q.toUpperCase()}</Text>
              <Text style={{ fontFamily: 'Fraunces_500Medium_Italic', fontSize: 20, lineHeight: 28, color: p.text, marginTop: 8 }}>“{pr.a}”</Text>
            </View>
          ))}

          <Section title="DETAILS">
            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}><MapPin size={16} color={p.muted} /><Text style={{ fontFamily: 'Inter_500Medium', color: p.text }}>{d.area}, Coimbatore</Text></View>
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}><Languages size={16} color={p.muted} /><Text style={{ fontFamily: 'Inter_500Medium', color: p.text }}>{d.languages.join(', ')}</Text></View>
              <Text style={{ fontFamily: 'Inter_500Medium', color: p.textSoft }}>Available: {d.availability.join(', ')}</Text>
              <Text style={{ fontFamily: 'Inter_500Medium', color: p.textSoft }}>Circles: {d.circles.map((c) => CIRCLES.find((x) => x.id === c)?.name ?? 'Vrinda youth').join(', ')}</Text>
            </View>
          </Section>

          <Section title="CONTACT">
            {contact ? (
              <View style={{ backgroundColor: p.dark ? p.card : C.saffronSoft, borderRadius: 20, padding: 16, gap: 10, borderWidth: 1, borderColor: C.saffron }}>
                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                  <ShieldCheck size={15} color={C.saffronDeep} />
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: C.saffronDeep, letterSpacing: 1 }}>VISIBLE TO TEMPLE ADMINS ONLY</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}><Phone size={16} color={p.text} /><Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: p.text }}>{contact.mobile}</Text></View>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}><Mail size={16} color={p.text} /><Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: p.text }}>{contact.email}</Text></View>
              </View>
            ) : (
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: p.card, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: p.line }}>
                <LockKeyhole size={20} color={C.peacock} />
                <Text style={{ flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14, lineHeight: 20, color: p.textSoft }}>
                  Mobile and email are private. Reach {d.name.split(' ')[0]} through Saathi chat.
                </Text>
              </View>
            )}
          </Section>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', left: 20, right: 20, bottom: 32 }}>
        <Press onPress={() => { router.back(); setTimeout(() => router.push(`/chat/${openDirectThread(d.id)}`), 250); }} style={{ height: 58, borderRadius: 999, backgroundColor: C.saffronDeep, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <MessageCircle size={20} color="white" />
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: 'white' }}>Message {d.name.split(' ')[0]}</Text>
        </Press>
      </View>
    </View>
  );
}
