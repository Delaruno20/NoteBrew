import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import TaskRow from '../components/TaskRow';
import {addDays, DAY_NAMES, MONTHS, toKey, weekOf} from '../dates';
import {isDone, tasksOn} from '../tasks';
import {colors} from '../theme';
import {Project, Task} from '../types';

type Props = {
  tasks: Task[];
  projects: Project[];
  onToggle: (id: string, key: string) => void;
  onEdit: (t: Task) => void;
  onAddOn: (key: string) => void;
};

export default function WeekScreen({tasks, projects, onToggle, onEdit, onAddOn}: Props) {
  const [offset, setOffset] = useState(0);
  const [showDone, setShowDone] = useState(true);
  const days = weekOf(addDays(new Date(), offset * 7));
  const todayKey = toKey(new Date());

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.nav}>
        <Pressable onPress={() => setOffset(offset - 1)}>
          <Text style={styles.arrow}>←</Text>
        </Pressable>
        <Pressable onPress={() => setOffset(0)}>
          <Text style={styles.arrow}>☀</Text>
        </Pressable>
        <Pressable onPress={() => setOffset(offset + 1)}>
          <Text style={styles.arrow}>→</Text>
        </Pressable>
        <Pressable onPress={() => setShowDone(!showDone)} style={{marginLeft: 'auto'}}>
          <Text style={styles.showDone}>{showDone ? 'HIDE DONE' : 'SHOW DONE'}</Text>
        </Pressable>
      </View>
      {days.map(d => {
        const k = toKey(d);
        const list = tasksOn(tasks, k).filter(t => showDone || !isDone(t, k));
        return (
          <View key={k} style={[styles.day, k === todayKey && styles.dayToday]}>
            <View style={styles.dayHead}>
              <Text style={styles.dayName}>{DAY_NAMES[d.getDay()].toUpperCase()}</Text>
              <Pressable onPress={() => onAddOn(k)} hitSlop={10}>
                <Text style={styles.plus}> +</Text>
              </Pressable>
              <Text style={styles.dayDate}>
                {d.getDate()} {MONTHS[d.getMonth()]}
              </Text>
            </View>
            {list.map(t => (
              <TaskRow
                key={t.id}
                task={t}
                done={isDone(t, k)}
                project={projects.find(p => p.id === t.projectId)}
                onToggle={() => onToggle(t.id, k)}
                onPress={() => onEdit(t)}
              />
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {padding: 18, paddingBottom: 40},
  nav: {flexDirection: 'row', alignItems: 'center', gap: 22, marginBottom: 14},
  arrow: {fontSize: 22, color: colors.brown},
  showDone: {fontSize: 11, letterSpacing: 1, color: colors.muted},
  day: {
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingBottom: 4,
    marginBottom: 12,
    backgroundColor: colors.bg,
  },
  dayToday: {borderColor: colors.brown, backgroundColor: '#F2E9DB'},
  dayHead: {flexDirection: 'row', alignItems: 'center', paddingVertical: 12},
  dayName: {fontSize: 14, color: colors.brown, letterSpacing: 1},
  plus: {fontSize: 18, color: colors.brown},
  dayDate: {marginLeft: 'auto', color: colors.muted, fontSize: 13},
});
