import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import Footer from '../Components/Footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSignedUrl } from '../config/oAuthHelper';

export default function Recipes() {
  const [search, setSearch] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]); // State untuk hasil resep
  const [loading, setLoading] = useState(false); // State untuk loading
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null); // Resep yang dipilih
  const [ingredients, setIngredients] = useState<any[]>([]); // Bahan-bahan
  const [directions, setDirections] = useState<any[]>([]); // Langkah-langkah
  const [modalVisible, setModalVisible] = useState(false); // State untuk modal
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');

        if (userData) {
          const parsedData = JSON.parse(userData);
          setProfileImage(parsedData.photo); // Ambil URI gambar profil
          setUserName(parsedData.name); // Ambil nama pengguna
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) {
      Alert.alert('Error', 'Please enter a search term.');
      return;
    }

    setLoading(true);
    try {
      const url = createSignedUrl(
        'https://platform.fatsecret.com/rest/server.api',
        'GET',
        {
          method: 'recipes.search',
          format: 'json',
          search_expression: search,
          max_results: 10,
        }
      );

      const response = await fetch(url);
      const data = await response.json();

      if (data.recipes && data.recipes.recipe) {
        const recipesArray = Array.isArray(data.recipes.recipe)
          ? data.recipes.recipe
          : [data.recipes.recipe];
        setRecipes(recipesArray);
      } else {
        setRecipes([]);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      Alert.alert('Error', 'Failed to fetch recipes.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeSelect = (recipe: any) => {
    router.push({
      pathname: '/pages/RecipeDetail',
      params: { recipeId: recipe.recipe_id }, // Kirim recipe_id sebagai parameter
    });
  };

  const handleUserProfile = () => {
    router.push('/Profile/Main');
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Pressable
          onPress={handleUserProfile}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Image
            source={{
              uri: profileImage || 'https://placekitten.com/100/100', // Default jika tidak ada gambar
            }}
            style={styles.avatar}
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              marginLeft: 6,
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {userName || 'User Name'}
          </Text>
        </Pressable>
        <TextInput
          placeholder="Search for recipes"
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch} // Panggil pencarian saat tekan enter
        />
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <FlatList
            data={recipes}
            keyExtractor={(item) => item.recipe_id}
            renderItem={({ item }) => (
              <Pressable
                style={styles.card}
                onPress={() => handleRecipeSelect(item)} // Buka modal dengan detail resep
              >
                <Image
                  source={{
                    uri: item.recipe_image || 'https://via.placeholder.com/100',
                  }}
                  style={styles.image}
                />
                <View style={styles.cardInfo}>
                  <Text style={styles.title}>{item.recipe_name}</Text>
                  <Text style={styles.sub}>
                    {item.recipe_description || 'No description available'}
                  </Text>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No recipes found</Text>
            }
          />
        )}
      </View>
      <Footer />
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
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 5,
  },

  carouselContainer: {
    marginBottom: 10,
  },

  carouselImage: {
    width: 400,
    height: 300,
    borderRadius: 12,
    marginRight: 10,
  },

  closeButton: {
    position: 'absolute',
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 20,
    height: 40,
    width: 40,
    top: 0,
  },

  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },

  modalImage: { width: '100%', height: 200, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  modalDescription: { fontSize: 14, color: 'gray', textAlign: 'center' },
  nutritionContainer: { marginVertical: 10 },
  nutritionText: { fontSize: 14, color: 'black' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 20 },
  ingredientText: { fontSize: 14, color: 'black', marginBottom: 5 },
  stepText: { fontSize: 14, color: 'black', marginBottom: 5 },
});
