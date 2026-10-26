import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {addDays, toKey, DAY_NAMES, fromKey} from '../dates';
import {colors} from '../theme';
import {Project, Task} from '../types';

type Props = {
  visible: boolean;
  task: Task | null;
  defaultDate: string;
  projects: Project[];
  onClose: () => void;
  onSave: (t: Omit<Task, 'id' | 'createdAt' | 'doneDates'> & {id?: string}) => void;
  onDelete: (id: string) => void;
};

export default function TaskModal({visible, task, defaultDate, projects, onClose, onSave, onDelete}: Props) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const [date, setDate] = useState(defaultDate);
  const [repeat, setRepeat] = useState(false);

  useEffect(() => {
    if (!visible) {
      return;
    }
    setTitle(task?.title ?? '');
    setNote(task?.note ?? '');
    setProjectId(task?.projectId ?? projects[0]?.id ?? '');
    setDate(task?.date ?? defaultDate);
    setRepeat(task?.repeat ?? false);
  }, [visible, task, defaultDate, projects]);

  const days = Array.from({length: 14}, (_, i) => addDays(new Date(), i));

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.heading}>{task ? 'Edit task' : 'New task'}</Text>
          <TextInput
            style={styles.input}
            placeholder="What do you want to do?"
            placeholderTextColor={colors.muted}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />
          <TextInput
            style={[styles.input, styles.noteInput]}
            placeholder="Notes…"
            placeholderTextColor={colors.muted}
            value={note}
            onChangeText={setNote}
            multiline
          />
          <Text style={styles.label}>Project</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {projects.map(p => (
              <Pressable
                key={p.id}
                onPress={() => setProjectId(p.id)}
                style={[styles.chip, projectId === p.id && styles.chipOn]}>
                <Text style={[styles.chipText, projectId === p.id && styles.chipTextOn]}>
                  {p.emoji} {p.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <Text style={styles.label}>Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {days.map(d => {
              const k = toKey(d);
              const on = k === date;
              return (
                <Pressable key={k} onPress={() => setDate(k)} style={[styles.chip, on && styles.chipOn]}>
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>
                    {DAY_NAMES[d.getDay()].slice(0, 3)} {d.getDate()}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <View style={styles.switchRow}>
            <Text style={styles.label}>Repeat every day</Text>
            <Switch value={repeat} onValueChange={setRepeat} trackColor={{true: colors.brownLight}} thumbColor={colors.brown} />
          </View>
          <View style={styles.actions}>
            {task && (
              <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => onDelete(task.id)}>
                <Text style={styles.ghostText}>Delete</Text>
              </Pressable>
            )}
            <Pressable
              style={[styles.btn, !title.trim() && {opacity: 0.4}]}
              disabled={!title.trim()}
              onPress={() =>
                onSave({id: task?.id, title: title.trim(), note: note.trim(), projectId, date: date || toKey(fromKey(defaultDate)), repeat})
              }>
              <Text style={styles.btnText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {flex: 1, justifyContent: 'flex-end'},
  backdrop: {position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(43,37,34,0.35)'},
  sheet: {backgroundColor: colors.bg, padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24},
  heading: {fontSize: 22, color: colors.ink, fontWeight: '600', marginBottom: 12},
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.ink,
    marginBottom: 10,
  },
  noteInput: {minHeight: 70, textAlignVertical: 'top'},
  label: {fontSize: 12, color: colors.muted, textTransform: 'uppercase', letterSpacing: 1, marginTop: 8, marginBottom: 6},
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  chipOn: {backgroundColor: colors.brown, borderColor: colors.brown},
  chipText: {color: colors.ink},
  chipTextOn: {color: colors.white},
  switchRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  actions: {flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16},
  btn: {backgroundColor: colors.brown, paddingHorizontal: 28, paddingVertical: 12, borderRadius: 14, marginLeft: 10},
  btnGhost: {backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.brown},
  btnText: {color: colors.white, fontWeight: '700'},
  ghostText: {color: colors.brown, fontWeight: '700'},
});
