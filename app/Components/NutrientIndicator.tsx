import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function NutrientIndicator({
  protein,
  fats,
  carbs,
  calories,
}: any) {
  const renderBar = (val: number, goal: number, color: string) => (
    <View style={styles.bar}>
      <View
        style={[
          styles.fill,
          {
            width: `${(val / goal) * 100 > 100 ? 100 : (val / goal) * 100}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {[
        {
          label: 'Proteins',
          val: protein.value,
          goal: protein.goal,
          color: 'red',
        },
        { label: 'Fats', val: fats.value, goal: fats.goal, color: 'orange' },
        { label: 'Carbs', val: carbs.value, goal: carbs.goal, color: 'green' },
      ].map(({ label, val, goal, color }) => (
        <View key={label} style={{ marginBottom: 10 }}>
          <Text>{`${val} / ${goal}`}</Text>
          <Text>{label}</Text>
          {renderBar(val, goal, color)}
        </View>
      ))}
      <Text
        style={{ marginTop: 10, fontWeight: 'bold' }}
      >{`${calories.value} / ${calories.goal} Calories`}</Text>
      {renderBar(calories.value, calories.goal, '#00c853')}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  bar: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 5,
    marginTop: 4,
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
});
