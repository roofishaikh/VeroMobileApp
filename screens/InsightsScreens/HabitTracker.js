import { Text, View, StyleSheet, Dimensions, Image, FlatList, ScrollView } from "react-native";
import PrimaryButton from "../../components/primaryButton";
import React from "react";
import OutterContainer from "../../components/OutterContainer";
import * as SecureStore from 'expo-secure-store';
import { Checkbox } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { useFocusEffect } from '@react-navigation/native';

function getCurrentWeekDates() {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

const HABIT_STORAGE_KEY = 'vero_habit_data';
const GOALS_STORAGE_KEY = 'vero_goals_data';

function HabitTracker() {
  const [habitData, setHabitData] = React.useState({});
  const [goals, setGoals] = React.useState([]);
  const [weekDates, setWeekDates] = React.useState(getCurrentWeekDates());
  const [loading, setLoading] = React.useState(true);

  // Load all data on focus
  useFocusEffect(
    React.useCallback(() => {
      loadAllData();
    }, [])
  );

  async function loadAllData() {
    setLoading(true);
    // Load habit completions
    let habitJson = await SecureStore.getItemAsync(HABIT_STORAGE_KEY);
    let habitObj = habitJson ? JSON.parse(habitJson) : {};
    // Load goals
    let goalsJson = await SecureStore.getItemAsync(GOALS_STORAGE_KEY);
    let goalsObj = goalsJson ? JSON.parse(goalsJson) : { goals: [] };
    setHabitData(habitObj);
    setGoals(goalsObj.goals || []);
    setWeekDates(getCurrentWeekDates());
    setLoading(false);
  }

  // Helper to get YYYY-MM-DD
  function formatDate(date) {
    return date.toISOString().slice(0, 10);
  }

  // Helper to check if completed
  function isCompleted(type, dateStr, goalId = null) {
    if (!habitData[dateStr]) return false;
    if (type === 'goal') {
      return habitData[dateStr].goals && habitData[dateStr].goals.includes(goalId);
    }
    return habitData[dateStr][type] === true;
  }

  // Export to Excel
  async function handleExport() {
    // Prepare data
    const allData = { ...habitData };
    // JSON export
    const jsonUri = FileSystem.cacheDirectory + 'habit_data.json';
    await FileSystem.writeAsStringAsync(jsonUri, JSON.stringify(allData, null, 2));
    // Excel export
    const rows = [];
    Object.entries(allData).forEach(([date, entry]) => {
      rows.push({ date, ...entry });
    });
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Habits');
    const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
    const xlsxUri = FileSystem.cacheDirectory + 'habit_data.xlsx';
    await FileSystem.writeAsStringAsync(xlsxUri, wbout, { encoding: FileSystem.EncodingType.Base64 });
    // Share
    await Sharing.shareAsync(xlsxUri, { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  // Render table
  const habitRows = [
    { label: 'Morning Ritual', type: 'morning' },
    { label: 'Evening Ritual', type: 'evening' },
    { label: 'Check-in', type: 'checkin' },
    ...goals.map(g => ({ label: g.text, type: 'goal', goalId: g.id }))
  ];

  return (
    <View style={styles.outterContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Habit Tracker</Text>
        <Text style={styles.titleCaption}>Track your core rituals and goals</Text>
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <Text style={{ width: 120, fontWeight: 'bold' }}>Habit</Text>
        {weekDates.map((d, i) => (
          <Text key={i} style={{ width: 36, textAlign: 'center', fontWeight: 'bold' }}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</Text>
        ))}
      </View>
      {loading ? <Text>Loading...</Text> : habitRows.map((row, i) => (
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ width: 120 }}>{row.label}</Text>
          {weekDates.map((d, j) => {
            const dateStr = formatDate(d);
            return (
              <Checkbox
                key={j}
                status={isCompleted(row.type, dateStr, row.goalId) ? 'checked' : 'unchecked'}
                disabled={true}
              />
            );
          })}
        </View>
      ))}
      <PrimaryButton text="Export to Excel" onTap={handleExport} style={{ marginTop: 20 }} />
    </View>
  );
}

export default HabitTracker

const styles = StyleSheet.create({
  outterContainer: {
    flex: 1,
    padding: Dimensions.get("window").width < 390 ? 10 : 20,
    marginTop: 60,
    marginBottom: 140,
    width: Dimensions.get("window").width < 390 ? 350 : 400,
    alignContent: "center",
    alignItems: "center",
    borderRadius: 15,
    alignSelf: "center",
    backgroundColor: 'beige',
  },
  titleContainer: {
    height: 80,
    width: '100%',
    marginBottom: 20,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 30,
    flexDirection: "row",
    flexWrap: "wrap",
    textAlign: "center"
  },
  titleCaption: {
    fontSize: 15,
    flexDirection: "row",
    flexWrap: "wrap",
    textAlign: "center"
  },
  OptionsCard: {
    width: '100%',
    height: Dimensions.get("window").height < 880 ? 410 : 580,
    position: "absolute",
    bottom: 50,
    padding: 10,
  },
  headingRow:{
    width: '100%',
    height: '90%',
    alignSelf:"center",
    position: "absolute",
    top: 20,
  },
  scrollBox: { 
    padding: 3,
    borderWidth: 1,
    margin: 3,
    width: 60,
    marginTop:9,
  }
})



