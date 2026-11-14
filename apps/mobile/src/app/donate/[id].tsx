import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, Coins, ReceiptText, X } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { Icon } from '@/components/icon';
import { Mandala } from '@/components/mandala';
import { Press } from '@/components/press';
import { SEVA_FUNDS } from '@/data/temple';
import { useApp } from '@/store/app-store';
import { C, usePalette } from '@/theme';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function Donate() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = usePalette();
  const fund = SEVA_FUNDS.find((f) => f.id === id)!;
  const fixed = fund.tiers.filter((t) => t.amount);
  const [tierId, setTierId] = useState(fixed[0].id);
  const [earned, setEarned] = useState<number | null>(null);
  const donate = useApp((s) => s.donate);
  const tier = fixed.find((t) => t.id === tierId)!;

  if (earned !== null) {
    return (
      <View style={{ flex: 1, backgroundColor: p.bg, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 }}>
        <Animated.View entering={ZoomIn.springify()} style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: C.tulasi, alignItems: 'center', justifyContent: 'center' }}>
          <Check size={48} color="white" strokeWidth={3} />
        </Animated.View>
        <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 30, color: p.text, textAlign: 'center' }}>Thank you for your seva</Text>
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 15, color: p.textSoft, textAlign: 'center', lineHeight: 22 }}>
          {fund.name} · {tier.label} · {inr(tier.amount!)}{'\n'}May Lord Jagannath bless you and your family.
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: C.goldSoft, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, marginTop: 8 }}>
          <Coins size={16} color="#8A6314" />
          <Text style={{ fontFamily: 'Inter_700Bold', color: '#8A6314' }}>+{earned} seva credits</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <ReceiptText size={14} color={p.muted} />
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: p.muted }}>80G receipt will be sent to your registered email</Text>
        </View>
        <Press onPress={() => router.back()} style={{ marginTop: 20, height: 54, paddingHorizontal: 40, borderRadius: 999, backgroundColor: C.ink, justifyContent: 'center' }}>
          <Text style={{ fontFamily: 'Inter_700Bold', color: 'white', fontSize: 16 }}>Done</Text>
        </Press>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: p.bg }}>
      <LinearGradient colors={fund.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 24, paddingTop: 28, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', right: -70, top: -50 }}>
          <Mandala size={280} opacity={0.2} />
        </View>
        <Press onPress={() => router.back()} accessibilityLabel="Close" style={{ alignSelf: 'flex-end', width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' }}>
          <X size={20} color="white" />
        </Press>
        <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={fund.icon} size={28} color="white" />
        </View>
        <Text style={{ fontFamily: 'Fraunces_700Bold', fontSize: 32, color: 'white', marginTop: 14 }}>{fund.name}</Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, color: 'rgba(255,255,255,0.92)', marginTop: 6 }}>{fund.description}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 20, gap: 10, paddingBottom: 140 }}>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 13, letterSpacing: 1, color: p.textSoft }}>CHOOSE YOUR OFFERING</Text>
        {fixed.map((t) => {
          const on = t.id === tierId;
          return (
            <Press key={t.id} onPress={() => setTierId(t.id)} accessibilityState={{ selected: on }} scaleTo={0.98} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 20, backgroundColor: on ? (p.dark ? '#2E2116' : C.saffronSoft) : p.card, borderWidth: 1.5, borderColor: on ? C.saffron : p.line }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: on ? C.saffronDeep : p.line, alignItems: 'center', justifyContent: 'center' }}>
                {on && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.saffronDeep }} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: p.text }}>{t.label}</Text>
                {t.note && <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: p.muted }}>{t.note}</Text>}
              </View>
              <Text style={{ fontFamily: 'Fraunces_600SemiBold', fontSize: 18, color: p.text }}>{inr(t.amount!)}</Text>
            </Press>
          );
        })}
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: p.muted, textAlign: 'center', marginTop: 6 }}>
          Prototype – no payment is taken. Production uses the temple’s UPI / payment gateway.
        </Text>
      </ScrollView>

      <View style={{ position: 'absolute', left: 20, right: 20, bottom: 36 }}>
        <Press onPress={() => setEarned(donate(fund.id, tier.label, tier.amount!))} style={{ height: 58, borderRadius: 999, backgroundColor: C.saffronDeep, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: 'white' }}>Offer {inr(tier.amount!)} via UPI</Text>
        </Press>
      </View>
    </View>
  );
}
