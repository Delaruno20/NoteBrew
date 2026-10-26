import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {addDays, toKey} from '../dates';
import {colors} from '../theme';
import {Task} from '../types';

export default function ProfileScreen({tasks}: {tasks: Task[]}) {
  const today = new Date();
  const doneByDay = new Map<string, number>();
  tasks.forEach(t => t.doneDates.forEach(d => doneByDay.set(d, (doneByDay.get(d) ?? 0) + 1)));

  const total = tasks.length;
  const done = tasks.filter(t => t.doneDates.length > 0).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  // 5 weeks heatmap, Sunday-first columns ending on the current week
  const start = addDays(today, -today.getDay() - 28);
  const cols = Array.from({length: 5}, (_, c) =>
    Array.from({length: 7}, (_, r) => addDays(start, c * 7 + r)),
  );

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    if (doneByDay.get(toKey(addDays(today, -i)))) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>PROFILE</Text>
      <Text style={styles.quote}>Your day. Your goals. Your way. ♡</Text>
      <View style={styles.row}>
        <Box label="Total" value={total} />
        <Box label="Done" value={done} />
        <Box label="Remaining" value={total - done} />
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Activity</Text>
        <View style={styles.heat}>
          {cols.map((col, ci) => (
            <View key={ci} style={styles.col}>
              {col.map(d => {
                const n = doneByDay.get(toKey(d)) ?? 0;
                const future = d > today;
                return (
                  <View
                    key={toKey(d)}
                    style={[
                      styles.cell,
                      n > 0 && {backgroundColor: colors.brownLight, opacity: Math.min(1, 0.4 + n * 0.2)},
                      future && {opacity: 0.35},
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>
      </View>
      <View style={styles.row}>
        <Box label="Streak (days)" value={streak} />
        <Box label="Completion" value={`${pct}%`} />
      </View>
    </ScrollView>
  );
}

const Box = ({label, value}: {label: string; value: number | string}) => (
  <View style={styles.box}>
    <Text style={styles.boxLabel}>{label}</Text>
    <Text style={styles.boxValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {padding: 22, paddingBottom: 40},
  title: {fontSize: 34, letterSpacing: 1, color: colors.ink, fontWeight: '300', marginTop: 10},
  quote: {color: colors.brownLight, fontStyle: 'italic', marginTop: 4, marginBottom: 16, fontSize: 16},
  row: {flexDirection: 'row', gap: 10, marginBottom: 14},
  box: {flex: 1, backgroundColor: colors.card, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.cardBorder},
  boxLabel: {fontSize: 11, color: colors.muted},
  boxValue: {fontSize: 24, color: colors.brown, fontWeight: '600'},
  card: {backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.cardBorder, marginBottom: 14},
  cardTitle: {color: colors.ink, fontWeight: '600', marginBottom: 12},
  heat: {flexDirection: 'row', gap: 6},
  col: {gap: 6},
  cell: {width: 30, height: 30, borderRadius: 6, backgroundColor: colors.line},
});
