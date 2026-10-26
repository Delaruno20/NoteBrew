import React, {useMemo, useState} from 'react';
import {FlatList, Pressable, StyleSheet, Text, TextInput, View} from 'react-native';
import TaskRow from '../components/TaskRow';
import {DAYS, DAY_NAMES, MONTHS, toKey, weekOf} from '../dates';
import {isDone, tasksOn} from '../tasks';
import {colors} from '../theme';
import {Project, Task} from '../types';

type Props = {
  tasks: Task[];
  projects: Project[];
  onToggle: (id: string, key: string) => void;
  onQuickAdd: (title: string, date: string) => void;
  onEdit: (t: Task) => void;
};

export default function TodayScreen({tasks, projects, onToggle, onQuickAdd, onEdit}: Props) {
  const today = new Date();
  const [selected, setSelected] = useState(toKey(today));
  const [draft, setDraft] = useState('');
  const [adding, setAdding] = useState(false);
  const week = useMemo(() => weekOf(today), []); // eslint-disable-line react-hooks/exhaustive-deps
  const list = tasksOn(tasks, selected);
  const done = list.filter(t => isDone(t, selected)).length;
  const sel = new Date(selected + 'T00:00:00');

  const submit = () => {
    if (draft.trim()) {
      onQuickAdd(draft.trim(), selected);
    }
    setDraft('');
    setAdding(false);
  };

  return (
    <FlatList
      data={list}
      keyExtractor={t => t.id}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <View>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>TODAY</Text>
              <Text style={styles.subtitle}>
                {sel.getDate()} {MONTHS[sel.getMonth()]} × {DAY_NAMES[sel.getDay()]}
              </Text>
            </View>
            <View style={styles.cup}>
              <Text style={{fontSize: 30}}>☕</Text>
            </View>
          </View>
          <View style={styles.weekRow}>
            {week.map(d => {
              const k = toKey(d);
              const on = k === selected;
              return (
                <Pressable key={k} style={styles.dayCell} onPress={() => setSelected(k)}>
                  <Text style={styles.dayLabel}>{DAYS[d.getDay()]}</Text>
                  <View style={[styles.dayPill, on && styles.dayPillOn]}>
                    <Text style={[styles.dayNum, on && {color: colors.white}]}>{d.getDate()}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, {width: `${list.length ? (done / list.length) * 100 : 0}%`}]} />
          </View>
          <Text style={styles.month}>{MONTHS[sel.getMonth()]}</Text>
          {adding ? (
            <TextInput
              style={styles.newInput}
              autoFocus
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={submit}
              onBlur={submit}
              placeholder="New task…"
              placeholderTextColor={colors.muted}
              returnKeyType="done"
            />
          ) : (
            <View style={styles.newRow}>
              <Pressable style={styles.newBtn} onPress={() => setAdding(true)}>
                <Text style={styles.newText}>NEW TASK</Text>
              </Pressable>
              <View style={styles.dots}>
                <Text style={styles.dotsText}>•••</Text>
              </View>
            </View>
          )}
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>Nothing planned. Every day is a step forward ☕</Text>}
      renderItem={({item}) => (
        <TaskRow
          task={item}
          done={isDone(item, selected)}
          project={projects.find(p => p.id === item.projectId)}
          onToggle={() => onToggle(item.id, selected)}
          onPress={() => onEdit(item)}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {padding: 22, paddingBottom: 40},
  headerRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10},
  title: {fontSize: 34, letterSpacing: 1, color: colors.ink, fontWeight: '300'},
  subtitle: {fontSize: 14, color: colors.muted, marginTop: 2},
  cup: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  weekRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 24},
  dayCell: {alignItems: 'center', flex: 1},
  dayLabel: {fontSize: 12, color: colors.brownLight, marginBottom: 6},
  dayPill: {width: 34, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center'},
  dayPillOn: {backgroundColor: colors.brown},
  dayNum: {fontSize: 13, color: colors.ink},
  track: {height: 8, borderRadius: 4, backgroundColor: colors.line, marginTop: 16, overflow: 'hidden'},
  fill: {height: 8, backgroundColor: colors.brownLight, borderRadius: 4},
  month: {fontSize: 10, color: colors.muted, marginTop: 4},
  newRow: {flexDirection: 'row', alignItems: 'center', marginTop: 12, marginBottom: 12},
  newBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  newText: {letterSpacing: 1, color: colors.ink, fontSize: 13},
  dots: {
    width: 48,
    paddingVertical: 14,
    borderRadius: 12,
    marginLeft: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
  },
  dotsText: {color: colors.ink, letterSpacing: 2},
  newInput: {
    marginVertical: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.brownLight,
    color: colors.ink,
    fontSize: 16,
  },
  empty: {textAlign: 'center', color: colors.muted, marginTop: 40, fontStyle: 'italic'},
});
