import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const APressable = Animated.createAnimatedComponent(Pressable);

/** Pressable with a spring scale-down and a light haptic tick. */
export function Press({
  children,
  style,
  haptic = true,
  scaleTo = 0.96,
  onPress,
  ...rest
}: Omit<PressableProps, 'style' | 'children'> & { children: ReactNode; style?: StyleProp<ViewStyle>; haptic?: boolean; scaleTo?: number; className?: string }) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <APressable
      accessibilityRole="button"
      {...rest}
      onPressIn={() => scale.set(withSpring(scaleTo, { damping: 18, stiffness: 400 }))}
      onPressOut={() => scale.set(withSpring(1, { damping: 14, stiffness: 300 }))}
      onPress={(e) => {
        if (haptic) Haptics.selectionAsync();
        onPress?.(e);
      }}
      style={[style, anim]}>
      {children}
    </APressable>
  );
}
