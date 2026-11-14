import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, LayoutDashboard, LockKeyhole, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react-native';
import { ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Press } from '@/components/press';
import { SkillChip } from '@/components/skill-chip';
import { CURRENT_USER_ID, devoteeById } from '@/data/devotees';
import { TEMPLE } from '@/data/temple';
import { useApp } from '@/store/app-store';
import { C, usePalette } from '@/theme';

function Row({ icon, title, sub, onPress, right }: { icon: React.ReactNode; title: string; sub?: string; onPress?: () => void; right?: React.ReactNode }) {
  const p = usePalette();
  return (
    <Press onPress={onPress} disabled={!onPress} scaleTo={0.98} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 }}>
      {icon}
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: p.text }}>{title}</Text>
        {sub && <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.muted, marginTop: 2 }}>{sub}</Text>}
      </View>
      {right ?? (onPress ? <ChevronRight size={18} color={p.muted} /> : null)}
    </Press>
  );
}

export default function Me() {
  const p = usePalette();
  const me = devoteeById(CURRENT_USER_ID);
  const { role, setRole, mySkills, credits, streakDays, reset } = useApp();
  const admin = role === 'admin';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: p.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18, paddingBottom: 60 }}>
        <Press onPress={() => router.back()} accessibilityLabel="Back" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: -10 }}>
          <ChevronLeft size={26} color={p.text} />
        </Press>
        <View style={{ alignItems: 'center', gap: 6 }}>
          <Avatar devotee={me} size={104} ring={admin ? C.saffron : undefined} />
          <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 30, color: p.text, marginTop: 6 }}>{me.name}</Text>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: p.textSoft }}>{me.headline} · with {TEMPLE.name} since {me.sinceYear}</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
            <View style={{ backgroundColor: C.goldSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 }}>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: '#8A6314' }}>{credits} credits</Text>
            </View>
            <View style={{ backgroundColor: C.saffronSoft, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 }}>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: C.saffronDeep }}>{streakDays}-day streak</Text>
            </View>
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 1.4, color: p.muted }}>SKILLS I OFFER</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {mySkills.map((s) => <SkillChip key={s} id={s} />)}
          </View>
        </View>

        <View style={{ backgroundColor: p.card, borderRadius: 22, borderWidth: 1, borderColor: p.line }}>
          <Row icon={<LockKeyhole size={20} color={C.peacock} />} title="Contact privacy" sub="Mobile & email visible to temple admins only" />
          <View style={{ height: 1, backgroundColor: p.line, marginLeft: 50 }} />
          <Row icon={<Sparkles size={20} color={C.saffron} />} title="Edit skills & replay welcome" onPress={() => { useApp.setState({ onboarded: false }); router.replace('/onboarding'); }} />
        </View>

        <View style={{ backgroundColor: p.card, borderRadius: 22, borderWidth: 1, borderColor: admin ? C.saffron : p.line }}>
          <Row
            icon={<ShieldCheck size={20} color={C.saffronDeep} />}
            title="Temple admin mode"
            sub="Prototype switch – production grants this role server-side"
            right={<Switch value={admin} onValueChange={(v) => setRole(v ? 'admin' : 'devotee')} trackColor={{ true: C.saffron }} accessibilityLabel="Temple admin mode" />}
          />
          {admin && (
            <>
              <View style={{ height: 1, backgroundColor: p.line, marginLeft: 50 }} />
              <Row icon={<LayoutDashboard size={20} color={C.peacock} />} title="Open admin console" sub="Members, contacts, engagement, redemptions" onPress={() => router.push('/admin')} />
            </>
          )}
        </View>

        <View style={{ backgroundColor: p.card, borderRadius: 22, borderWidth: 1, borderColor: p.line }}>
          <Row icon={<RotateCcw size={20} color={p.muted} />} title="Reset demo data" sub="Start the prototype walkthrough again" onPress={() => { reset(); router.replace('/onboarding'); }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
