import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#7E57C2', // Dominan color
        tabBarInactiveTintColor: '#BDBDBD', // Warna tidak aktif
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            backgroundColor: '#F3E5F5', // Warna latar belakang tab
            borderTopWidth: 1,
            borderColor: '#D1C4E9', // Warna pembatas tab
          },
          default: {
            backgroundColor: '#F3E5F5', // Warna latar belakang tab
            borderTopWidth: 1,
            borderColor: '#D1C4E9', // Warna pembatas tab
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Beranda',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="jasa"
        options={{
          title: 'Cari Jasa',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="search.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifikasi"
        options={{
          title: 'Notifikasi',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="notifications.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profil"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
