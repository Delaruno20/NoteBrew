import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {toKey} from '../dates';
import {colors} from '../theme';
import {Project, Task} from '../types';

type Props = {
  tasks: Task[];
  projects: Project[];
  onAddProject: (name: string) => void;
  onDeleteProject: (id: string) => void;
};

const count = (t: Task) => (t.repeat ? t.doneDates.length : t.doneDates.length ? 1 : 0);

export default function ProjectsScreen({tasks, projects, onAddProject, onDeleteProject}: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const [name, setName] = useState('');
  const todayKey = toKey(new Date());

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>PROJECTS</Text>
      <View style={styles.addRow}>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="New project…"
          placeholderTextColor={colors.muted}
        />
        <Pressable
          style={styles.addBtn}
          onPress={() => {
            if (name.trim()) {
              onAddProject(name.trim());
              setName('');
            }
          }}>
          <Text style={styles.addText}>ADD</Text>
        </Pressable>
      </View>
      {projects.map(p => {
        const mine = tasks.filter(t => t.projectId === p.id);
        const done = mine.reduce((n, t) => n + count(t), 0);
        const total = mine.length;
        const remaining = mine.filter(t => !t.doneDates.includes(t.repeat ? todayKey : t.date)).length;
        return (
          <Pressable key={p.id} style={styles.card} onPress={() => setOpen(open === p.id ? null : p.id)}>
            <View style={styles.cardHead}>
              <Text style={styles.emoji}>{p.emoji}</Text>
              <Text style={styles.name}>{p.name}</Text>
            </View>
            <View style={styles.stats}>
              <Stat label="Total" value={total} />
              <Stat label="Done" value={done} />
              <Stat label="Remaining" value={remaining} />
            </View>
            {open === p.id && (
              <View>
                {mine.map(t => (
                  <Text key={t.id} style={styles.item}>
                    {t.doneDates.length ? '✓' : '○'} {t.title}
                  </Text>
                ))}
                {!mine.length && <Text style={styles.item}>No tasks yet.</Text>}
                <Pressable onPress={() => onDeleteProject(p.id)}>
                  <Text style={styles.delete}>Delete project</Text>
                </Pressable>
              </View>
            )}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const Stat = ({label, value}: {label: string; value: number}) => (
  <View style={styles.stat}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {padding: 22, paddingBottom: 40},
  title: {fontSize: 34, letterSpacing: 1, color: colors.ink, fontWeight: '300', marginTop: 10, marginBottom: 14},
  addRow: {flexDirection: 'row', marginBottom: 16},
  input: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 14,
    color: colors.ink,
  },
  addBtn: {backgroundColor: colors.brown, borderRadius: 12, paddingHorizontal: 20, justifyContent: 'center', marginLeft: 10},
  addText: {color: colors.white, letterSpacing: 1, fontWeight: '700'},
  card: {backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.cardBorder, padding: 16, marginBottom: 12},
  cardHead: {flexDirection: 'row', alignItems: 'center'},
  emoji: {fontSize: 26, marginRight: 10},
  name: {fontSize: 20, color: colors.ink, fontWeight: '600'},
  stats: {flexDirection: 'row', marginTop: 12, gap: 10},
  stat: {flex: 1, backgroundColor: colors.bg, borderRadius: 10, padding: 10, borderWidth: 1, borderColor: colors.line},
  statLabel: {fontSize: 11, color: colors.muted},
  statValue: {fontSize: 20, color: colors.brown, fontWeight: '600'},
  item: {marginTop: 8, color: colors.ink},
  delete: {marginTop: 12, color: '#B04A3A', fontSize: 13},
});
