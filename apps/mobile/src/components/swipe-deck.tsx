import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import { GestureDetector, useExclusiveGestures, usePanGesture, useTapGesture } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation, interpolate, type SharedValue, useAnimatedStyle, useSharedValue, withSpring, withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { DevoteeCard } from '@/components/devotee-card';
import type { Devotee } from '@/data/types';
import { C } from '@/theme';

export type SwipeDir = 'connect' | 'later' | 'invite';
export interface DeckHandle {
  fling: (dir: SwipeDir) => void;
}

const SWIPE_X = 120;
const SWIPE_Y = 140;

function Stamp({ label, color, style }: { label: string; color: string; style: object }) {
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: 70, borderWidth: 3, borderColor: color, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.92)' }, style]}>
      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 20, letterSpacing: 2, color }}>{label}</Text>
    </Animated.View>
  );
}

interface CardProps {
  devotee: Devotee;
  progress: SharedValue<number>;
  onDone: (id: string, dir: SwipeDir) => void;
}

const TopCard = forwardRef<DeckHandle, CardProps>(function TopCard({ devotee, progress, onDone }, ref) {
  const { width, height } = useWindowDimensions();
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const finish = (dir: SwipeDir) => {
    Haptics.notificationAsync(dir === 'later' ? Haptics.NotificationFeedbackType.Warning : Haptics.NotificationFeedbackType.Success);
    onDone(devotee.id, dir);
  };

  const flingOut = (dir: SwipeDir) => {
    'worklet';
    const tx = dir === 'connect' ? width * 1.5 : dir === 'later' ? -width * 1.5 : 0;
    const ty = dir === 'invite' ? -height : 40;
    progress.set(withTiming(1, { duration: 220 }));
    x.set(withTiming(tx, { duration: 260 }));
    y.set(
      withTiming(ty, { duration: 260 }, (ok) => {
        if (ok) scheduleOnRN(finish, dir);
      }),
    );
  };

  useImperativeHandle(ref, () => ({ fling: (dir) => flingOut(dir) }));

  const pan = usePanGesture({
    minDistance: 6,
    onUpdate: (e) => {
      'worklet';
      x.set(e.translationX);
      y.set(e.translationY);
      progress.set(Math.min(1, Math.max(Math.abs(e.translationX) / SWIPE_X, -e.translationY / SWIPE_Y, 0)));
    },
    onDeactivate: (e) => {
      'worklet';
      if (e.translationX > SWIPE_X || e.velocityX > 900) return flingOut('connect');
      if (e.translationX < -SWIPE_X || e.velocityX < -900) return flingOut('later');
      if (e.translationY < -SWIPE_Y || e.velocityY < -1100) return flingOut('invite');
      x.set(withSpring(0, { damping: 15 }));
      y.set(withSpring(0, { damping: 15 }));
      progress.set(withSpring(0));
    },
  });

  const openProfile = () => router.push(`/profile/${devotee.id}`);
  // Tap and pan compete exclusively, so a drag never also opens the profile.
  const tap = useTapGesture({
    maxDistance: 8,
    onActivate: () => {
      'worklet';
      scheduleOnRN(openProfile);
    },
  });
  const gesture = useExclusiveGestures(pan, tap);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${interpolate(x.value, [-width, 0, width], [-14, 0, 14])}deg` },
    ],
  }));
  const connectStyle = useAnimatedStyle(() => ({ opacity: interpolate(x.value, [20, SWIPE_X], [0, 1], Extrapolation.CLAMP), transform: [{ rotate: '-12deg' }] }));
  const laterStyle = useAnimatedStyle(() => ({ opacity: interpolate(x.value, [-SWIPE_X, -20], [1, 0], Extrapolation.CLAMP), transform: [{ rotate: '12deg' }] }));
  const inviteStyle = useAnimatedStyle(() => ({ opacity: interpolate(y.value, [-SWIPE_Y, -30], [1, 0], Extrapolation.CLAMP) }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[{ position: 'absolute', inset: 0, shadowColor: '#2B1B10', shadowOpacity: 0.18, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 10 }, cardStyle]}>
        <View style={{ flex: 1 }} accessibilityRole="button" accessibilityHint="Opens full profile. Swipe right to connect, left for later, up to invite to seva.">
          <DevoteeCard devotee={devotee} />
        </View>
        <Stamp label="CONNECT" color={C.tulasi} style={[{ left: 24 }, connectStyle]} />
        <Stamp label="LATER" color={C.muted} style={[{ right: 24 }, laterStyle]} />
        <Stamp label="INVITE TO SEVA" color={C.saffronDeep} style={[{ alignSelf: 'center', top: '38%' }, inviteStyle]} />
      </Animated.View>
    </GestureDetector>
  );
});

function NextCard({ devotee, progress }: { devotee: Devotee; progress: SharedValue<number> }) {
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.94, 1]) }, { translateY: interpolate(progress.value, [0, 1], [18, 0]) }],
    opacity: interpolate(progress.value, [0, 1], [0.7, 1]),
  }));
  return (
    <Animated.View pointerEvents="none" style={[{ position: 'absolute', inset: 0 }, style]}>
      <DevoteeCard devotee={devotee} />
    </Animated.View>
  );
}

export const SwipeDeck = forwardRef<DeckHandle, { profiles: Devotee[]; onSwipe: (id: string, dir: SwipeDir) => void; empty: React.ReactNode }>(
  function SwipeDeck({ profiles, onSwipe, empty }, ref) {
    const [gone, setGone] = useState<string[]>([]);
    const progress = useSharedValue(0);
    const top = useRef<DeckHandle>(null);
    const queue = profiles.filter((p) => !gone.includes(p.id));

    useImperativeHandle(ref, () => ({ fling: (dir) => top.current?.fling(dir) }));

    const done = (id: string, dir: SwipeDir) => {
      progress.set(0);
      setGone((g) => [...g, id]);
      onSwipe(id, dir);
    };

    if (!queue.length) return <View style={{ flex: 1 }}>{empty}</View>;
    return (
      <View style={{ flex: 1 }}>
        {queue[1] && <NextCard key={`next-${queue[1].id}`} devotee={queue[1]} progress={progress} />}
        <TopCard key={queue[0].id} ref={top} devotee={queue[0]} progress={progress} onDone={done} />
      </View>
    );
  },
);
