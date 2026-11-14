import type { Skill, SkillId } from './types';

export const SKILLS: Skill[] = [
  { id: 'tech', label: 'App & Tech', icon: 'cpu', tone: 'peacock' },
  { id: 'digital', label: 'Digital outreach', icon: 'megaphone', tone: 'lotus' },
  { id: 'yoga', label: 'Yoga', icon: 'flower', tone: 'tulasi' },
  { id: 'music', label: 'Kirtan & Music', icon: 'music', tone: 'saffron' },
  { id: 'art', label: 'Art & Rangoli', icon: 'palette', tone: 'lotus' },
  { id: 'gita', label: 'Gita teaching', icon: 'book-open', tone: 'gold' },
  { id: 'story', label: 'Storytelling', icon: 'sparkles', tone: 'peacock' },
  { id: 'cooking', label: 'Prasadam cooking', icon: 'chef-hat', tone: 'saffron' },
  { id: 'photo', label: 'Photo & Video', icon: 'camera', tone: 'peacock' },
  { id: 'medical', label: 'Medical care', icon: 'stethoscope', tone: 'tulasi' },
  { id: 'teaching', label: 'Teaching kids', icon: 'graduation-cap', tone: 'gold' },
  { id: 'finance', label: 'Accounts & Finance', icon: 'landmark', tone: 'gold' },
  { id: 'decor', label: 'Flower & Deity décor', icon: 'flower-2', tone: 'lotus' },
  { id: 'logistics', label: 'Crowd & Logistics', icon: 'route', tone: 'tulasi' },
  { id: 'chanting', label: 'Chanting & Japa', icon: 'circle-dot', tone: 'tulasi' },
];

export const skillById = (id: SkillId) => SKILLS.find((s) => s.id === id)!;
