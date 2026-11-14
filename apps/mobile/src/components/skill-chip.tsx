import { Text, View } from 'react-native';

import { Icon } from '@/components/icon';
import { skillById } from '@/data/skills';
import type { SkillId } from '@/data/types';
import { TONE } from '@/theme';

export function SkillChip({ id, size = 'md', onDark }: { id: SkillId; size?: 'sm' | 'md'; onDark?: boolean }) {
  const skill = skillById(id);
  const tone = TONE[skill.tone];
  const small = size === 'sm';
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: small ? 10 : 12,
        paddingVertical: small ? 5 : 7,
        borderRadius: 999,
        backgroundColor: onDark ? 'rgba(255,255,255,0.18)' : tone.bg,
      }}>
      <Icon name={skill.icon} size={small ? 13 : 15} color={onDark ? '#fff' : tone.fg} />
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: small ? 12 : 13, color: onDark ? '#fff' : tone.fg }}>{skill.label}</Text>
    </View>
  );
}
