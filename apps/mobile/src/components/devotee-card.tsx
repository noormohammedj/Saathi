import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BadgeCheck, CalendarHeart, Flame, HandHeart, Repeat, Sparkles } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { Mandala } from '@/components/mandala';
import { SkillChip } from '@/components/skill-chip';
import type { Devotee } from '@/data/types';
import { sevaMatch, yearsWithIskcon } from '@/lib/match';
import { C, usePalette } from '@/theme';

function Stat({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  const p = usePalette();
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 2 }}>
      {icon}
      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: p.text }}>{value}</Text>
      <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: p.muted }}>{label}</Text>
    </View>
  );
}

/** Face of a swipe card: devotional art header + seva-match evidence. */
export function DevoteeCard({ devotee, compact }: { devotee: Devotee; compact?: boolean }) {
  const p = usePalette();
  const match = sevaMatch(devotee);
  const initials = devotee.name.replace('Dr. ', '').split(' ').map((s) => s[0]).slice(0, 2).join('');
  const prompt = devotee.prompts[devotee.prompts.length > 1 ? 1 : 0];

  return (
    <View style={{ flex: 1, borderRadius: 32, overflow: 'hidden', backgroundColor: p.card }}>
      <LinearGradient colors={devotee.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1, minHeight: 160, justifyContent: 'flex-end', padding: 20 }}>
        {devotee.photo ? (
          <>
            <Image source={devotee.photo} contentFit="cover" contentPosition="center" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} accessibilityIgnoresInvertColors />
            <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(20,13,8,0.78)']} locations={[0.35, 1]} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          </>
        ) : (
          <View style={{ position: 'absolute', top: -40, right: -60 }}>
            <Mandala size={300} opacity={0.22} />
          </View>
        )}
        <View style={{ position: 'absolute', top: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 }}>
            <Sparkles size={14} color={C.saffronDeep} />
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: C.saffronDeep }}>{match.score}% seva match</Text>
          </View>
          <View style={{ backgroundColor: 'rgba(0,0,0,0.22)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: 'white' }}>Since {devotee.sinceYear}</Text>
          </View>
        </View>

        {!devotee.photo && <View style={{ position: 'absolute', top: 64, right: 20, width: 76, height: 76, borderRadius: 38, backgroundColor: 'rgba(255,255,255,0.16)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 32, color: 'white' }}>{initials}</Text>
        </View>}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 32, color: 'white' }} numberOfLines={1}>
            {devotee.name}
          </Text>
          {devotee.verified && <BadgeCheck size={24} color="white" fill="rgba(255,255,255,0.25)" accessibilityLabel="Verified by temple" />}
        </View>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: 'rgba(255,255,255,0.95)', marginTop: 2 }}>{devotee.headline}</Text>
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>
          {devotee.area} · {yearsWithIskcon(devotee.sinceYear)} yrs with ISKCON · {devotee.languages.slice(0, 2).join(', ')}
        </Text>
      </LinearGradient>

      <View style={{ padding: 16, gap: 12 }}>
        {match.event && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: p.dark ? '#2E2116' : C.saffronSoft, padding: 12, borderRadius: 16 }}>
            <CalendarHeart size={20} color={C.saffronDeep} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: p.dark ? C.saffron : C.saffronDeep }}>{match.reasons[0]}</Text>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.textSoft }} numberOfLines={1}>
                {match.roleTitles.join(' · ')}
              </Text>
            </View>
          </View>
        )}
        <View style={{ flexDirection: 'row', gap: 8, overflow: 'hidden' }}>
          {devotee.skills.slice(0, 3).map((s) => (
            <SkillChip key={s} id={s} size="sm" />
          ))}
        </View>
        {!compact && prompt && (
          <View>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: p.muted }}>{prompt.q}</Text>
            <Text style={{ fontFamily: 'Fraunces_500Medium_Italic', fontSize: 17, lineHeight: 23, color: p.text, marginTop: 4 }} numberOfLines={2}>
              “{prompt.a}”
            </Text>
          </View>
        )}
        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: p.line, paddingTop: 10 }}>
          <Stat icon={<Repeat size={16} color={C.tulasi} />} value={`${devotee.roundsPerDay}`} label="rounds/day" />
          <Stat icon={<Flame size={16} color={C.saffron} />} value={`${devotee.streakDays}`} label="day streak" />
          <Stat icon={<HandHeart size={16} color={C.lotus} />} value={`${devotee.sevaHours}`} label="seva hours" />
        </View>
      </View>
    </View>
  );
}
