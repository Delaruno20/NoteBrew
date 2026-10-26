import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme';
import {Project, Task} from '../types';

type Props = {
  task: Task;
  done: boolean;
  project?: Project;
  onToggle: () => void;
  onPress: () => void;
};

export default function TaskRow({task, done, project, onToggle, onPress}: Props) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      <Pressable onPress={onToggle} hitSlop={10} style={[styles.box, done && styles.boxDone]}>
        {done && <Text style={styles.tick}>✓</Text>}
      </Pressable>
      <View style={styles.body}>
        <Text style={[styles.title, done && styles.done]} numberOfLines={2}>
          {task.title}
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          {project?.name ?? ''}
          {task.note ? `  ·  ${task.note}` : ''}
          {task.repeat ? '  ↻' : ''}
        </Text>
      </View>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{project?.emoji ?? '📝'}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  box: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxDone: {backgroundColor: colors.brown, borderColor: colors.brown},
  tick: {color: colors.white, fontWeight: '700'},
  body: {flex: 1, marginLeft: 14},
  title: {fontSize: 17, color: colors.ink, fontWeight: '500'},
  done: {textDecorationLine: 'line-through', color: colors.muted},
  sub: {fontSize: 12, color: colors.muted, marginTop: 3},
  badge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {fontSize: 16},
});
