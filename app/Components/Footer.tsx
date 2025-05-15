import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useRouter, usePathname } from 'expo-router';

const Footer = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Helper untuk cek apakah route aktif
  const isActive = (path: string) => pathname === path;

  return (
    <View style={styles.footer}>
      <Pressable onPress={() => router.push('/pages/Recipes_Pages')}>
        <Text style={isActive('/pages/Recipes_Pages') ? styles.active : null}>
          📖 Recipes
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push('/pages/DiaryPage')}>
        <Text style={isActive('/pages/DiaryPage') ? styles.active : null}>
          📝 Diary
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push('/pages/Reports_Page')}>
        <Text style={isActive('/pages/Reports_Page') ? styles.active : null}>
          📊 Reports
        </Text>
      </Pressable>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    position: 'fixed',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#DBFBED',
    padding: 10,
  },
  active: { fontWeight: 'bold', color: 'green' },
});
