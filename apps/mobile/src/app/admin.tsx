import { router } from 'expo-router';
import { ChevronLeft, Download, Mail, Phone, Search, ShieldCheck, TrendingUp } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Press } from '@/components/press';
import { DEVOTEES } from '@/data/devotees';
import { skillById } from '@/data/skills';
import { EVENTS } from '@/data/temple';
import { useApp } from '@/store/app-store';
import { C, usePalette } from '@/theme';

// Illustrative engagement numbers for the pitch; production reads these from analytics views.
const KPIS = [
  { label: 'Active devotees (7d)', value: '1,284', delta: '+18%' },
  { label: 'Temple check-ins (7d)', value: '3,412', delta: '+11%' },
  { label: 'Seva hours (30d)', value: '2,180', delta: '+24%' },
  { label: 'Japa rounds (7d)', value: '96.4k', delta: '+9%' },
];
const FUNNEL = [
  { label: 'First visit', value: 4200 },
  { label: 'Returned within 30 days', value: 2310 },
  { label: 'Weekly regular', value: 1284 },
  { label: 'Offers seva monthly', value: 612 },
];

export default function Admin() {
  const p = usePalette();
  const role = useApp((s) => s.role);
  const contactFor = useApp((s) => s.contactFor);
  const [q, setQ] = useState('');

  if (role !== 'admin') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: p.bg, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <ShieldCheck size={40} color={p.muted} />
        <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text, marginTop: 12 }}>Admins only</Text>
      </SafeAreaView>
    );
  }

  const members = DEVOTEES.filter((d) => !q || `${d.name} ${d.headline}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: p.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 60 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Press onPress={() => router.back()} accessibilityLabel="Back" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: -10 }}>
            <ChevronLeft size={26} color={p.text} />
          </Press>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, letterSpacing: 2, color: C.saffronDeep }}>ISKCON COIMBATORE · ADMIN</Text>
            <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 28, color: p.text }}>Temple console</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {KPIS.map((k) => (
            <View key={k.label} style={{ flexBasis: '47%', flexGrow: 1, backgroundColor: p.card, borderRadius: 20, padding: 14, borderWidth: 1, borderColor: p.line }}>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.muted }}>{k.label}</Text>
              <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 28, color: p.text, marginTop: 4 }}>{k.value}</Text>
              <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                <TrendingUp size={13} color={C.tulasi} />
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: C.tulasi }}>{k.delta} vs last period</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ backgroundColor: p.card, borderRadius: 22, padding: 16, borderWidth: 1, borderColor: p.line, gap: 10 }}>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: p.text }}>Visitor → committed devotee</Text>
          {FUNNEL.map((f) => (
            <View key={f.label} style={{ gap: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: p.textSoft }}>{f.label}</Text>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: p.text }}>{f.value.toLocaleString('en-IN')}</Text>
              </View>
              <View style={{ height: 10, borderRadius: 5, backgroundColor: p.line }}>
                <View style={{ width: `${(f.value / FUNNEL[0].value) * 100}%`, height: 10, borderRadius: 5, backgroundColor: C.saffron }} />
              </View>
            </View>
          ))}
        </View>

        <View style={{ backgroundColor: p.card, borderRadius: 22, padding: 16, borderWidth: 1, borderColor: p.line, gap: 10 }}>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: p.text }}>Festival staffing</Text>
          {EVENTS.slice(0, 4).map((e) => {
            const need = e.roles.reduce((n, r) => n + r.needed, 0);
            const have = e.roles.reduce((n, r) => n + r.filled, 0);
            const pct = Math.round((have / need) * 100);
            return (
              <View key={e.id} style={{ gap: 4 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: p.textSoft }}>{e.title}</Text>
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: pct < 50 ? C.lotus : C.tulasi }}>{pct}%</Text>
                </View>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: p.line }}>
                  <View style={{ width: `${pct}%`, height: 8, borderRadius: 4, backgroundColor: pct < 50 ? C.lotus : C.tulasi }} />
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text }}>Member directory</Text>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <Download size={14} color={C.peacock} />
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.peacock }}>Export CSV</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, height: 48, borderRadius: 24, paddingHorizontal: 16, backgroundColor: p.card, borderWidth: 1, borderColor: p.line }}>
          <Search size={18} color={p.muted} />
          <TextInput value={q} onChangeText={setQ} placeholder="Search members" placeholderTextColor={p.muted} style={{ flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: p.text }} />
        </View>
        {members.map((d) => {
          const c = contactFor(d.id);
          return (
            <View key={d.id} style={{ backgroundColor: p.card, borderRadius: 20, padding: 14, borderWidth: 1, borderColor: p.line, gap: 10 }}>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                <Avatar devotee={d} size={46} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: p.text }}>{d.name}</Text>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.muted }}>Since {d.sinceYear} · {d.skills.map((s) => skillById(s).label).join(', ')}</Text>
                </View>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 12, color: C.tulasi }}>{d.streakDays}d</Text>
              </View>
              {c && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, backgroundColor: p.dark ? p.bg : C.saffronSoft, padding: 10, borderRadius: 14 }}>
                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                    <Phone size={14} color={C.saffronDeep} />
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: p.text }}>{c.mobile}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                    <Mail size={14} color={C.saffronDeep} />
                    <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: p.text }}>{c.email}</Text>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
