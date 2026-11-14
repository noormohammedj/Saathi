import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BadgeCheck } from 'lucide-react-native';
import { Text, View } from 'react-native';

import type { Devotee } from '@/data/types';

export function Avatar({ devotee, size = 48, ring }: { devotee: Pick<Devotee, 'name' | 'gradient' | 'verified' | 'photo'>; size?: number; ring?: string }) {
  const initials = devotee.name
    .replace('Dr. ', '')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');
  return (
    <View
      accessibilityLabel={devotee.name}
      style={{ width: size + (ring ? 6 : 0), height: size + (ring ? 6 : 0), borderRadius: size, borderWidth: ring ? 3 : 0, borderColor: ring, alignItems: 'center', justifyContent: 'center' }}>
      {devotee.photo ? (
        <Image source={devotee.photo} contentFit="cover" contentPosition="top" style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <LinearGradient
          colors={devotee.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: 'white', fontFamily: 'Fraunces_600SemiBold', fontSize: size * 0.38 }}>{initials}</Text>
        </LinearGradient>
      )}
      {devotee.verified && size >= 44 && (
        <View style={{ position: 'absolute', right: -2, bottom: -2, backgroundColor: 'white', borderRadius: 10 }}>
          <BadgeCheck size={Math.max(14, size * 0.3)} color="#0B6B78" fill="#D6EEF0" />
        </View>
      )}
    </View>
  );
}
