import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function WaterIntake({ current, goal, lastTime }: any) {
  const percentage = Math.round((current / goal) * 100);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Water</Text>
        <Text style={styles.amount}>{current} / {goal} L</Text>
        <Text style={styles.time}>Last time {lastTime}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.button}>＋</Text>
        <View style={styles.progress}>
          <View style={[styles.fill, { height: `${percentage}%` }]} />
        </View>
        <Text style={styles.button}>−</Text>
        <Text style={styles.percent}>{percentage}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, backgroundColor: '#f6f6f6', borderRadius: 12 },
  label: { fontSize: 14 },
  amount: { fontSize: 16, fontWeight: 'bold' },
  time: { fontSize: 12, color: 'gray' },
  right: { alignItems: 'center' },
  progress: { height: 60, width: 20, backgroundColor: '#ddd', borderRadius: 10, justifyContent: 'flex-end', overflow: 'hidden', marginVertical: 5 },
  fill: { width: '100%', backgroundColor: '#64b5f6' },
  button: { fontSize: 20 },
  percent: { fontSize: 12 },
});
