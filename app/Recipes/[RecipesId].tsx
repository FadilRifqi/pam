import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, StyleSheet, Image, Pressable, ScrollView } from 'react-native';

const recipeDetails = {
  pancakes: {
    title: 'Pancakes',
    image: 'https://www.themealdb.com/images/media/meals/rwuyqx1511383174.jpg',
    calories: 300,
    protein: 20,
    fats: 15,
    carbs: 15,
    time: '60 min',
    description:
      'Lorem ipsum dolor sit amet consectetur. Fringilla mauris est lorem et amet. Vestibulum tristique volutpat massa aliquet ultrices eu pretium.',
  },
  sushi: {
    title: 'Sushi',
    image: 'https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg',
    calories: 244,
    protein: 15,
    fats: 10,
    carbs: 30,
    time: '60 min',
    description:
      'Sushi is a traditional Japanese dish made with vinegared rice and seafood. This version takes around an hour to prepare.',
  },
};

export default function RecipeDetail() {
  const { recipeId } = useLocalSearchParams();
  const router = useRouter();
  const recipe = recipeDetails[recipeId as keyof typeof recipeDetails];

  if (!recipe) return <Text style={{ padding: 20 }}>Recipe not found.</Text>;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <Pressable style={styles.closeBtn} onPress={() => router.back()}>
        <Text style={styles.close}>×</Text>
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>
        <Text style={styles.cal}>{recipe.calories} Cal</Text>
        <View style={styles.nutrients}>
          <Text>🕒 {recipe.time}</Text>
          <Text>{recipe.protein}g Proteins</Text>
          <Text>{recipe.fats}g Fats</Text>
          <Text>{recipe.carbs}g Carbs</Text>
        </View>
        <Text style={styles.desc}>{recipe.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 220 },
  closeBtn: { position: 'absolute', top: 40, left: 20 },
  close: { fontSize: 30 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  cal: { color: 'gray', marginVertical: 4 },
  nutrients: {
    marginVertical: 10,
    gap: 4,
  },
  desc: { marginTop: 10, lineHeight: 20, color: '#444' },
});
