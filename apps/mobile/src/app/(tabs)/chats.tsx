import { formatDistanceToNowStrict } from 'date-fns';
import { router } from 'expo-router';
import { LockKeyhole, UsersRound } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Header } from '@/components/header';
import { Press } from '@/components/press';
import { CURRENT_USER_ID, devoteeById } from '@/data/devotees';
import { EVENTS } from '@/data/temple';
import { useApp } from '@/store/app-store';
import { C, usePalette } from '@/theme';

/** Avatar wrapped in a ring that drains over the 24-hour first-message window. */
function CountdownAvatar({ id, at }: { id: string; at: string }) {
  const p = usePalette();
  const [now] = useState(Date.now);
  const left = Math.max(0, 24 - (now - new Date(at).getTime()) / 3600_000);
  const size = 72;
  const r = size / 2 - 3;
  const circ = 2 * Math.PI * r;
  return (
    <Press onPress={() => router.push(`/chat/${useApp.getState().openDirectThread(id)}`)} style={{ alignItems: 'center', width: 80 }} accessibilityLabel={`${devoteeById(id).name}, ${Math.ceil(left)} hours left to say hello`}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={p.line} strokeWidth={4} fill="none" />
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={C.saffron} strokeWidth={4} fill="none" strokeDasharray={`${circ}`} strokeDashoffset={circ * (1 - left / 24)} strokeLinecap="round" />
        </Svg>
        <Avatar devotee={devoteeById(id)} size={58} />
      </View>
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: p.text, marginTop: 6 }} numberOfLines={1}>
        {devoteeById(id).name.split(' ')[0]}
      </Text>
      <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: C.saffronDeep }}>{Math.ceil(left)}h left</Text>
    </Press>
  );
}

export default function Chats() {
  const p = usePalette();
  const threads = useApp((s) => s.threads);
  const matches = useApp((s) => s.matches);
  const fresh = matches.filter((m) => !threads.some((t) => t.kind === 'direct' && t.members.includes(m.profileId) && t.messages.length));
  const active = threads.filter((t) => t.messages.length);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: p.bg }}>
      <Header eyebrow="Private by design" title="Chats" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={{ marginHorizontal: 20, marginTop: 8, fontFamily: 'Inter_700Bold', fontSize: 13, color: p.textSoft, letterSpacing: 1 }}>NEW SAATHIS</Text>
        {fresh.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 12, gap: 6 }}>
            {fresh.map((m) => (
              <CountdownAvatar key={m.profileId} id={m.profileId} at={m.at} />
            ))}
          </ScrollView>
        ) : (
          <View style={{ margin: 20, padding: 16, borderRadius: 20, backgroundColor: p.card, borderWidth: 1, borderColor: p.line }}>
            <Text style={{ fontFamily: 'Inter_500Medium', color: p.textSoft, fontSize: 14 }}>Connect with devotees on the Saathis tab – mutual connections appear here with 24 hours to say Hare Krishna.</Text>
          </View>
        )}

        <Text style={{ marginHorizontal: 20, marginTop: 12, marginBottom: 6, fontFamily: 'Inter_700Bold', fontSize: 13, color: p.textSoft, letterSpacing: 1 }}>CONVERSATIONS</Text>
        {active.map((t) => {
          const last = t.messages[t.messages.length - 1];
          const otherId = t.members.find((m) => m !== CURRENT_USER_ID)!;
          const event = EVENTS.find((e) => e.id === t.eventId);
          const title = t.kind === 'team' ? t.title! : devoteeById(otherId).name;
          return (
            <Press key={t.id} onPress={() => router.push(`/chat/${t.id}`)} scaleTo={0.98} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingVertical: 12 }}>
              {t.kind === 'team' ? (
                <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: C.peacockSoft, alignItems: 'center', justifyContent: 'center' }}>
                  <UsersRound size={24} color={C.peacockDeep} />
                </View>
              ) : (
                <Avatar devotee={devoteeById(otherId)} size={56} />
              )}
              <View style={{ flex: 1, borderBottomWidth: 1, borderColor: p.line, paddingBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: p.text, flex: 1 }} numberOfLines={1}>{title}</Text>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.muted }}>{formatDistanceToNowStrict(new Date(last.at))}</Text>
                </View>
                {event && <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: C.peacock, marginTop: 2 }}>Seva team · {t.members.length} devotees</Text>}
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: p.textSoft, marginTop: 2 }} numberOfLines={1}>
                  {last.from === CURRENT_USER_ID ? 'You: ' : ''}
                  {last.text}
                </Text>
              </View>
            </Press>
          );
        })}
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
          <LockKeyhole size={13} color={p.muted} />
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.muted }}>Mobile numbers and emails are never shared in chat</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
