import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type StarRatingProps = {
  rating: number; // nilai rating, misal 3.5
  maxStars?: number; // optional, default 5
};

const StarRating = ({ rating, maxStars = 5 }: StarRatingProps) => {
  const stars = [];

  for (let i = 1; i <= maxStars; i++) {
    if (i <= Math.floor(rating)) {
      // bintang penuh
      stars.push(<Ionicons key={i} name="star" size={20} color="#FFD700" />);
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      // bintang setengah (kalau mau setengah bisa pake icon lain atau custom, tapi Ionicons ga ada setengah)
      // Sebagai alternatif, tampilkan bintang setengah dengan warna lebih muda:
      stars.push(
        <Ionicons key={i} name="star-half" size={20} color="#FFD700" />
      );
    } else {
      // bintang kosong
      stars.push(
        <Ionicons key={i} name="star-outline" size={20} color="#FFD700" />
      );
    }
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {stars}
      <Text style={{ marginLeft: 6, fontSize: 14, color: '#333' }}>
        {rating}
      </Text>
    </View>
  );
};

export default StarRating;
