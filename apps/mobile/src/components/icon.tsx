import {
  BookOpen, Camera, ChefHat, CircleDot, Cookie, Cpu, Flame, Flower, Flower2, Gift,
  GraduationCap, HeartHandshake, Landmark, Megaphone, MoonStar, Music, Palette, Route, Soup,
  Sparkles, Stethoscope, Ticket, Utensils, type LucideIcon,
} from 'lucide-react-native';

const ICONS: Record<string, LucideIcon> = {
  'book-open': BookOpen,
  camera: Camera,
  'chef-hat': ChefHat,
  'circle-dot': CircleDot,
  cookie: Cookie,
  cpu: Cpu,
  flame: Flame,
  flower: Flower,
  'flower-2': Flower2,
  gift: Gift,
  'graduation-cap': GraduationCap,
  'heart-handshake': HeartHandshake,
  landmark: Landmark,
  megaphone: Megaphone,
  'moon-star': MoonStar,
  music: Music,
  palette: Palette,
  route: Route,
  soup: Soup,
  sparkles: Sparkles,
  stethoscope: Stethoscope,
  ticket: Ticket,
  utensils: Utensils,
};

export function Icon({ name, size = 18, color, strokeWidth = 2 }: { name: string; size?: number; color: string; strokeWidth?: number }) {
  const Cmp = ICONS[name] ?? Sparkles;
  return <Cmp size={size} color={color} strokeWidth={strokeWidth} />;
}
