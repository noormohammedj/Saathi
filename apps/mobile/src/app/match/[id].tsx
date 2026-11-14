import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { CalendarHeart, Hourglass, MessageCircleHeart, UsersRound } from 'lucide-react-native';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '@/components/avatar';
import { Mandala } from '@/components/mandala';
import { Press } from '@/components/press';
import { CURRENT_USER_ID, devoteeById } from '@/data/devotees';
import { sevaMatch } from '@/lib/match';
import { useApp } from '@/store/app-store';
import { C } from '@/theme';

export default function MatchScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const other = devoteeById(id);
  const me = devoteeById(CURRENT_USER_ID);
  const match = sevaMatch(other);
  const { openDirectThread, formTeam } = useApp();
  const first = other.name.split(' ')[0];

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  return (
    <Animated.View entering={FadeIn.duration(300)} style={{ flex: 1 }}>
      <LinearGradient colors={['#074954', '#0B6B78', '#C9952B']} locations={[0, 0.55, 1]} style={{ flex: 1 }}>
        <View style={{ position: 'absolute', top: 60, alignSelf: 'center' }}>
          <Animated.View entering={ZoomIn.duration(900)}>
            <Mandala size={460} opacity={0.2} />
          </Animated.View>
        </View>
        <SafeAreaView style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}>
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Animated.Text entering={FadeInDown.delay(150)} style={{ fontFamily: 'Inter_600SemiBold', letterSpacing: 3, color: 'rgba(255,255,255,0.85)', fontSize: 12 }}>
              HARE KRISHNA!
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(250)} style={{ fontFamily: 'Fraunces_700Bold', fontSize: 44, color: 'white', textAlign: 'center', marginTop: 8, lineHeight: 50 }}>
              You’re Saathis
            </Animated.Text>
            <Animated.Text entering={FadeInDown.delay(350)} style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginTop: 8 }}>
              You and {first} both offered to serve together.
            </Animated.Text>

            <View style={{ flexDirection: 'row', marginTop: 36, alignItems: 'center' }}>
              <Animated.View entering={ZoomIn.delay(400).springify()} style={{ transform: [{ rotate: '-8deg' }] }}>
                <Avatar devotee={me} size={120} ring="white" />
              </Animated.View>
              <Animated.View entering={ZoomIn.delay(550).springify()} style={{ marginLeft: -24, transform: [{ rotate: '8deg' }] }}>
                <Avatar devotee={other} size={120} ring="white" />
              </Animated.View>
            </View>

            {match.event && (
              <Animated.View entering={FadeInDown.delay(700)} style={{ marginTop: 28, backgroundColor: 'rgba(255,255,255,0.14)', borderColor: 'rgba(255,255,255,0.3)', borderWidth: 1, borderRadius: 20, padding: 16, flexDirection: 'row', gap: 12, alignSelf: 'stretch' }}>
                <CalendarHeart size={22} color="white" />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter_700Bold', color: 'white', fontSize: 15 }}>{match.event.title} needs you both</Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 4, lineHeight: 18 }}>{match.roleTitles.join(' · ')}</Text>
                </View>
              </Animated.View>
            )}
          </View>

          <Animated.View entering={FadeInDown.delay(850)} style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
              <Hourglass size={14} color="rgba(255,255,255,0.9)" />
              <Text style={{ fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>Send the first Hare Krishna within 24 hours</Text>
            </View>
            {match.event && (
              <Press
                onPress={() => {
                  const t = formTeam(match.event!.id, [other.id]);
                  router.dismiss();
                  router.push(`/chat/${t}`);
                }}
                style={{ backgroundColor: 'white', height: 58, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <UsersRound size={20} color={C.peacockDeep} />
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: C.peacockDeep }}>Form a seva team for {match.event.title.split(' ')[0]} {match.event.title.split(' ')[1]}</Text>
              </Press>
            )}
            <Press
              onPress={() => {
                const t = openDirectThread(other.id);
                router.dismiss();
                router.push(`/chat/${t}`);
              }}
              style={{ backgroundColor: 'rgba(255,255,255,0.16)', borderWidth: 1.5, borderColor: 'white', height: 56, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <MessageCircleHeart size={20} color="white" />
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: 'white' }}>Message {first}</Text>
            </Press>
            <Press onPress={() => router.back()} style={{ height: 44, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', color: 'rgba(255,255,255,0.85)' }}>Keep exploring</Text>
            </Press>
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
    </Animated.View>
  );
}
