import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { createSignedUrl } from '../config/oAuthHelper';
import { Ionicons } from '@expo/vector-icons'; // Gunakan Ionicons untuk icon "timer"
import StarRating from '../Components/StarRating';

export default function RecipeDetail() {
  const { recipeId } = useLocalSearchParams(); // Ambil recipe_id dari parameter
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const url = createSignedUrl(
          'https://platform.fatsecret.com/rest/server.api',
          'GET',
          {
            method: 'recipe.get',
            format: 'json',
            recipe_id: recipeId,
          }
        );

        const response = await fetch(url);
        const data = await response.json();

        if (data.recipe) {
          setRecipe(data.recipe); // Simpan detail resep
          console.log('Recipe details:', data.recipe);
        } else {
          Alert.alert('Error', 'Recipe not found.');
        }
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        Alert.alert('Error', 'Failed to fetch recipe details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Recipe not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Gambar Resep */}
      {recipe.recipe_images?.recipe_image ? (
        Array.isArray(recipe.recipe_images.recipe_image) ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.carouselContainer}
          >
            {recipe.recipe_images.recipe_image.map(
              (img: string, index: number) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={styles.carouselImage}
                />
              )
            )}
          </ScrollView>
        ) : (
          <Image
            source={{
              uri: recipe.recipe_images.recipe_image,
            }}
            style={styles.image}
          />
        )
      ) : (
        <Image
          source={{
            uri: 'https://dummyimage.com/400x300/efefef/000000.jpg',
          }}
          style={styles.image}
        />
      )}
      <View style={{ padding: 16 }}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          {/* Nama Resep */}
          <View style={{ display: 'flex', flexDirection: 'column' }}>
            <Text style={styles.title}>{recipe.recipe_name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <StarRating rating={recipe.rating || 0} />
            </View>
          </View>

          {/* Deskripsi Resep */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            <Ionicons
              name="time-outline"
              size={16}
              color="#555"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.description}>
              {recipe.preparation_time_min || 'No time info'} Minutes
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Informasi Nutrisi */}
        <Text style={styles.sectionTitle}>Nutrition Facts</Text>
        <View style={styles.nutritionContainer}>
          {[
            ['Serving Size', recipe.serving_sizes.serving.serving_size],
            ['Calories', `${recipe.serving_sizes.serving.calories} Kcal`],
            ['Fat', `${recipe.serving_sizes.serving.fat} g`],
            ['Protein', `${recipe.serving_sizes.serving.protein} g`],
            ['Carbohydrates', `${recipe.serving_sizes.serving.carbohydrate} g`],
            ['Fiber', `${recipe.serving_sizes.serving.fiber} g`],
            ['Sugar', `${recipe.serving_sizes.serving.sugar} g`],
            ['Sodium', `${recipe.serving_sizes.serving.sodium} mg`],
          ].map(([label, value], index) => (
            <Text key={index} style={styles.nutritionText}>
              {label}: {value || 'N/A'}
            </Text>
          ))}
        </View>

        {/* Bahan-Bahan */}
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredients.ingredient.map((ingredient: any, index: number) => (
          <Text key={index} style={styles.ingredientText}>
            • {ingredient.ingredient_description}
          </Text>
        ))}

        {/* Langkah-Langkah */}
        <Text style={styles.sectionTitle}>Steps</Text>
        {recipe.directions.direction.map((step: any, index: number) => (
          <Text key={index} style={styles.stepText}>
            {index + 1}. {step.direction_description}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: 'red' },
  image: { width: '100%', height: 300, borderRadius: 10 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 14, color: 'gray' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  nutritionContainer: { marginVertical: 10 },
  nutritionText: { fontSize: 14, color: 'black', marginBottom: 5 },
  ingredientText: { fontSize: 14, color: 'black', marginBottom: 5 },
  stepText: { fontSize: 14, color: 'black', marginBottom: 5 },
  carouselContainer: {},
  carouselImage: {
    width: 400,
    height: 300,
    borderRadius: 10,
    marginRight: 10,
  },
  separator: {
    height: 1, // tinggi garis 1 pixel
    backgroundColor: '#ccc', // warna abu-abu terang
    marginVertical: 10, // jarak atas bawah
    width: '100%', // lebar full container
  },
});
