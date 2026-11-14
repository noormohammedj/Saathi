import * as Haptics from 'expo-haptics';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { BEADS_PER_ROUND, ROUNDS_GOAL, useApp } from '@/store/app-store';
import { C, usePalette } from '@/theme';

const SIZE = 268;
const R = 116;

/** Tap-to-chant counter: 108 beads around a ring, one tap per mantra. */
export function JapaRing({ onRound }: { onRound: (goalDone: boolean) => void }) {
  const p = usePalette();
  const { beads, rounds } = useApp((s) => s.today);
  const tapBead = useApp((s) => s.tapBead);
  const pulse = useSharedValue(1);
  const glow = useSharedValue(0);

  const ringStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  const glowStyle = useAnimatedStyle(() => ({ opacity: glow.value }));

  const onTap = () => {
    const res = tapBead();
    pulse.set(withSequence(withTiming(0.97, { duration: 60 }), withSpring(1, { damping: 10 })));
    if (res.roundDone) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      glow.set(withSequence(withTiming(1, { duration: 200 }), withTiming(0, { duration: 900 })));
      onRound(res.goalDone);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  return (
    <Pressable onPress={onTap} accessibilityRole="button" accessibilityLabel={`Japa counter. Round ${rounds} of ${ROUNDS_GOAL}, bead ${beads} of 108. Tap to count one mantra.`}>
      <Animated.View style={[{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }, ringStyle]}>
        <Animated.View style={[{ position: 'absolute', width: SIZE, height: SIZE, borderRadius: SIZE / 2, backgroundColor: C.tulasiSoft }, glowStyle]} />
        <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
          {Array.from({ length: BEADS_PER_ROUND }).map((_, i) => {
            const a = (i / BEADS_PER_ROUND) * Math.PI * 2 - Math.PI / 2;
            const done = i < beads;
            return <Circle key={i} cx={SIZE / 2 + R * Math.cos(a)} cy={SIZE / 2 + R * Math.sin(a)} r={done ? 4.6 : 3.4} fill={done ? C.tulasi : p.line} />;
          })}
          <Circle cx={SIZE / 2} cy={SIZE / 2 - R} r={7} fill={C.gold} />
        </Svg>
        <View style={{ width: 176, height: 176, borderRadius: 88, backgroundColor: p.card, alignItems: 'center', justifyContent: 'center', shadowColor: '#2B1B10', shadowOpacity: 0.1, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 4 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 11, letterSpacing: 2, color: p.muted }}>ROUND</Text>
          <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 52, color: p.text, lineHeight: 60 }}>
            {rounds}
            <Text style={{ fontSize: 22, color: p.muted }}>/{ROUNDS_GOAL}</Text>
          </Text>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.tulasi }}>{beads} / 108 beads</Text>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: p.muted, marginTop: 6 }}>Tap to chant</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}
