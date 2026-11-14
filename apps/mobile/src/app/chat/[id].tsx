import { format, parseISO } from 'date-fns';
import { router, useLocalSearchParams } from 'expo-router';
import { CalendarHeart, ChevronLeft, LockKeyhole, SendHorizontal, UsersRound } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, type ScrollViewInstance, Text, TextInput, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Press } from '@/components/press';
import { CURRENT_USER_ID, devoteeById } from '@/data/devotees';
import { EVENTS } from '@/data/temple';
import type { Message } from '@/data/types';
import { useApp } from '@/store/app-store';
import { C, usePalette } from '@/theme';

const QUICK = ['Hare Krishna 🙏', 'Which role suits you?', 'Meet after Gaura Arati?', 'I’ll draft a plan tonight'];

function Bubble({ m, team }: { m: Message; team: boolean }) {
  const p = usePalette();
  const mine = m.from === CURRENT_USER_ID;
  if (m.kind === 'system') {
    return (
      <View style={{ alignSelf: 'center', backgroundColor: p.dark ? p.card : C.peacockSoft, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, marginVertical: 8, maxWidth: '90%' }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: p.dark ? p.textSoft : C.peacockDeep, textAlign: 'center' }}>{m.text}</Text>
      </View>
    );
  }
  const event = m.kind === 'seva-invite' ? EVENTS.find((e) => e.id === m.eventId) : undefined;
  return (
    <Animated.View entering={FadeInUp.duration(250)} style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '82%', marginVertical: 4 }}>
      {team && !mine && <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: p.muted, marginLeft: 12, marginBottom: 2 }}>{devoteeById(m.from).name.split(' ')[0]}</Text>}
      <View style={{ backgroundColor: mine ? C.saffronDeep : p.card, borderRadius: 22, borderBottomRightRadius: mine ? 6 : 22, borderBottomLeftRadius: mine ? 22 : 6, paddingHorizontal: 14, paddingVertical: 10, borderWidth: mine ? 0 : 1, borderColor: p.line }}>
        {event && (
          <Press onPress={() => router.push(`/event/${event.id}`)} style={{ flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)', padding: 10, borderRadius: 14, marginBottom: 8 }}>
            <CalendarHeart size={18} color={mine ? 'white' : C.saffronDeep} />
            <View>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: mine ? 'white' : p.text }}>Seva invite · {event.title}</Text>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: mine ? 'rgba(255,255,255,0.85)' : p.muted }}>{format(parseISO(event.date), 'EEE, d MMM')} · {event.time}</Text>
            </View>
          </Press>
        )}
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 15, lineHeight: 21, color: mine ? 'white' : p.text }}>{m.text}</Text>
      </View>
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: p.muted, marginTop: 2, alignSelf: mine ? 'flex-end' : 'flex-start', marginHorizontal: 8 }}>{format(new Date(m.at), 'h:mm a')}</Text>
    </Animated.View>
  );
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = usePalette();
  const thread = useApp((s) => s.threads.find((t) => t.id === id));
  const send = useApp((s) => s.sendMessage);
  const [text, setText] = useState('');
  const scroll = useRef<ScrollViewInstance>(null);

  useEffect(() => {
    setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
  }, [thread?.messages.length]);

  if (!thread) return null;
  const team = thread.kind === 'team';
  const otherId = thread.members.find((m) => m !== CURRENT_USER_ID)!;
  const event = EVENTS.find((e) => e.id === thread.eventId);
  const submit = (t: string) => {
    if (!t.trim()) return;
    send(thread.id, t.trim());
    setText('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: p.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingBottom: 10, borderBottomWidth: 1, borderColor: p.line }}>
        <Press onPress={() => router.back()} accessibilityLabel="Back" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={26} color={p.text} />
        </Press>
        {team ? (
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: C.peacockSoft, alignItems: 'center', justifyContent: 'center' }}>
            <UsersRound size={20} color={C.peacockDeep} />
          </View>
        ) : (
          <Press onPress={() => router.push(`/profile/${otherId}`)}>
            <Avatar devotee={devoteeById(otherId)} size={44} />
          </Press>
        )}
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: p.text }} numberOfLines={1}>{team ? thread.title : devoteeById(otherId).name}</Text>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.muted }} numberOfLines={1}>
            {team ? thread.members.map((m) => devoteeById(m).name.split(' ')[0]).join(', ') : devoteeById(otherId).headline}
          </Text>
        </View>
      </View>

      {event && (
        <Press onPress={() => router.push(`/event/${event.id}`)} style={{ margin: 12, marginBottom: 0, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 16, backgroundColor: p.dark ? p.card : C.saffronSoft }}>
          <CalendarHeart size={18} color={C.saffronDeep} />
          <Text style={{ flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 13, color: p.dark ? C.saffron : C.saffronDeep }}>{event.title} · {format(parseISO(event.date), 'd MMM')} · tap to pick roles</Text>
        </Press>
      )}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={8}>
        <ScrollView ref={scroll} contentContainerStyle={{ padding: 14, paddingBottom: 8 }}>
          <View style={{ alignSelf: 'center', flexDirection: 'row', gap: 6, alignItems: 'center', marginBottom: 12 }}>
            <LockKeyhole size={12} color={p.muted} />
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: p.muted }}>Contact details stay private · moderated by ISKCON Coimbatore</Text>
          </View>
          {thread.messages.length === 0 && (
            <View style={{ alignItems: 'center', padding: 24 }}>
              <Avatar devotee={devoteeById(otherId)} size={88} />
              <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 22, color: p.text, marginTop: 12 }}>Say Hare Krishna to {devoteeById(otherId).name.split(' ')[0]}</Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: p.textSoft, marginTop: 4, textAlign: 'center' }}>You have 24 hours to send the first message.</Text>
            </View>
          )}
          {thread.messages.map((m) => (
            <Bubble key={m.id} m={m} team={team} />
          ))}
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 12, gap: 8, paddingVertical: 6 }} style={{ flexGrow: 0 }}>
          {QUICK.map((q) => (
            <Press key={q} onPress={() => submit(q)} style={{ height: 34, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1, borderColor: p.line, backgroundColor: p.card, justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: p.text }}>{q}</Text>
            </Press>
          ))}
        </ScrollView>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, paddingTop: 6 }}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Write a message"
            placeholderTextColor={p.muted}
            accessibilityLabel="Message"
            onSubmitEditing={() => submit(text)}
            returnKeyType="send"
            style={{ flex: 1, minHeight: 48, borderRadius: 24, paddingHorizontal: 18, backgroundColor: p.card, borderWidth: 1, borderColor: p.line, color: p.text, fontFamily: 'Inter_400Regular', fontSize: 15 }}
          />
          <Press onPress={() => submit(text)} accessibilityLabel="Send" style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.saffronDeep, alignItems: 'center', justifyContent: 'center' }}>
            <SendHorizontal size={20} color="white" />
          </Press>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
