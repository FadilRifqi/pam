import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import NutrientIndicator from '../Components/NutrientIndicator';
import WaterIntake from '../Components/WaterIntake';
import MealCard from '../Components/MealList';
import DateTimePicker from '@react-native-community/datetimepicker';

function DiaryPage() {
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (event: any, date?: Date) => {
    if (date) setSelectedDate(date);
    setCalendarVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://placekitten.com/100/100' }}
          style={styles.avatar}
        />
        <Text style={styles.today}>{selectedDate.toDateString()}</Text>
        <Pressable onPress={() => setCalendarVisible(true)}>
          <Text style={styles.calendar}>📅</Text>
        </Pressable>
      </View>

      {/* Calendar Modal */}
      {calendarVisible && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="calendar"
          onChange={handleDateChange}
        />
      )}

      {/* Nutrients */}
      <View style={styles.section}>
        <NutrientIndicator
          protein={{ value: 150, goal: 225 }}
          fats={{ value: 30, goal: 118 }}
          carbs={{ value: 319, goal: 340 }}
          calories={{ value: 2456, goal: 3400 }}
        />
      </View>

      {/* Water Intake */}
      <View style={styles.section}>
        <WaterIntake current={1.9} goal={2.5} lastTime="10:45 AM" />
      </View>

      {/* Meals */}
      <View style={styles.mealHeader}>
        <Text style={styles.mealTitle}>Meals</Text>
        <Pressable>
          <Text style={{ fontSize: 20 }}>＋</Text>
        </Pressable>
      </View>
      <MealCard name="Breakfast" calories={531} time="10:45 AM" />
      <MealCard name="Lunch" calories={1024} time="03:45 PM" />

      {/* Footer */}
      <View style={styles.footer}>
        <Text>📖 Recipes</Text>
        <Text style={styles.active}>📝 Diary</Text>
        <Text>📊 Reports</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  today: { fontSize: 18, fontWeight: '500' },
  calendar: { fontSize: 20 },
  section: { marginVertical: 20 },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  mealTitle: { fontSize: 16, fontWeight: '600' },
  footer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  active: { fontWeight: 'bold', color: 'green' },
});

export default DiaryPage;
