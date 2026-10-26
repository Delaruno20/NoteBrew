import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme';
import {Screen} from '../types';

const tabs: {key: Screen; label: string; icon: string}[] = [
  {key: 'today', label: 'Today', icon: '☕'},
  {key: 'week', label: 'Week', icon: '▤'},
  {key: 'projects', label: 'Projects', icon: '🗂'},
  {key: 'profile', label: 'Profile', icon: '✧'},
  {key: 'more', label: 'More', icon: '⊞'},
];

type Props = {active: Screen; onChange: (s: Screen) => void; onAdd: () => void};

export default function TabBar({active, onChange, onAdd}: Props) {
  return (
    <View style={styles.bar}>
      {tabs.map(t => (
        <Pressable key={t.key} style={styles.tab} onPress={() => onChange(t.key)}>
          <Text style={[styles.icon, active === t.key && styles.on]}>{t.icon}</Text>
          <Text style={[styles.label, active === t.key && styles.on]}>{t.label}</Text>
        </Pressable>
      ))}
      <Pressable style={styles.add} onPress={onAdd}>
        <Text style={styles.plus}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  tab: {flex: 1, alignItems: 'center'},
  icon: {fontSize: 20, color: colors.muted},
  label: {fontSize: 11, color: colors.muted, marginTop: 2},
  on: {color: colors.brown, fontWeight: '700'},
  add: {width: 46, alignItems: 'center'},
  plus: {fontSize: 32, color: colors.brown, fontWeight: '300'},
});
