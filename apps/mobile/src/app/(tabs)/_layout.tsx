import { Tabs } from 'expo-router/js-tabs';

import { TabBar } from '@/components/tab-bar';

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="discover" />
      <Tabs.Screen name="sadhana" />
      <Tabs.Screen name="seva" />
      <Tabs.Screen name="sangha" />
      <Tabs.Screen name="chats" />
    </Tabs>
  );
}
