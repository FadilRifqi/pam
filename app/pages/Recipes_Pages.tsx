import { View, Text, TextInput, FlatList, Image, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

const recipes = [
  {
    id: 'sushi',
    title: 'Sushi',
    calories: 244,
    time: '60 min',
    image: 'https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg',
  },
  {
    id: 'pancakes',
    title: 'Pancakes',
    calories: 300,
    time: '60 min',
    image: 'https://www.themealdb.com/images/media/meals/rwuyqx1511383174.jpg',
  },
];

export default function Recipes() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Itami</Text>
      <TextInput
        placeholder="Search for recipes"
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/Recipes/[RecipesId]',
                params: { RecipesId: item.id }, // Passing the dynamic parameter
              })
            }
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardInfo}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.sub}>{item.calories} Cal</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  search: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: 100, height: 100 },
  cardInfo: { padding: 10, flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold' },
  sub: { fontSize: 14, color: 'gray' },
  time: { marginTop: 5, fontSize: 12, color: '#666' },
});
