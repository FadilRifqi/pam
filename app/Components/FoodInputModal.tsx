import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

type Props = {
  visible: boolean;
  foodName: string | null;
  onCancel: () => void;
  onConfirm: (grams: number) => void;
};

export default function FoodInputModal({ visible, foodName, onCancel, onConfirm }: Props) {
  const [grams, setGrams] = useState('100');

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{foodName}</Text>
          <Text style={styles.row}>416 Calories</Text>
          <Text style={styles.row}>20g Proteins   15g Fats   15g Carbs</Text>
          <TextInput
            keyboardType="numeric"
            value={grams}
            onChangeText={setGrams}
            style={styles.input}
          />
          <Text>grams</Text>

          <View style={styles.actions}>
            <Pressable onPress={onCancel}><Text style={styles.cancel}>Cancel</Text></Pressable>
            <Pressable onPress={() => onConfirm(Number(grams))}><Text style={styles.ok}>OK</Text></Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', padding: 24, borderRadius: 12, width: 300, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  row: { marginVertical: 4 },
  input: {
    borderBottomWidth: 1,
    width: 100,
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, width: '100%' },
  cancel: { color: 'gray', fontSize: 16 },
  ok: { color: 'green', fontSize: 16 },
});
