import { View, Text, TextInput, StyleSheet, FlatList, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function SearchFood() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const suggestions = ['Egg', 'Chicken', 'Rice'];

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search food"
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />
      {search.length === 0 ? (
        <View style={styles.empty}><Text>Empty{'\n'}Type a food name</Text></View>
      ) : (
        <FlatList
          data={suggestions.filter((item) => item.toLowerCase().includes(search.toLowerCase()))}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/food/${item.toLowerCase()}`)} style={styles.item}>
              <Text>{item}</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
const foodOptions: Record<string, { name: string; calPer100g: number }[]> = {
    egg: [
      { name: 'Boiled egg', calPer100g: 160 },
      { name: 'Fried eggs', calPer100g: 191 },
    ],
  };
  
const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  input: { borderBottomWidth: 1, marginBottom: 20, fontSize: 16 },
  empty: { alignItems: 'center', marginTop: 100 },
  item: { padding: 10, borderBottomWidth: 0.5, borderColor: '#ccc' },
});
