import React from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme';

export default function MoreScreen({onClear}: {onClear: () => void}) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MORE</Text>
      <View style={styles.card}>
        <Text style={styles.h}>NoteBrew</Text>
        <Text style={styles.p}>Plan. Focus. Achieve. Every day is a step forward.</Text>
        <Text style={styles.p}>All your data stays on this device (local storage). No account, no cloud.</Text>
      </View>
      <View style={styles.card}>
        {['Organize your tasks', 'Build habits', 'Track progress', 'Stay motivated'].map(t => (
          <Text key={t} style={styles.feature}>
            ✓  {t}
          </Text>
        ))}
      </View>
      <Pressable
        style={styles.danger}
        onPress={() =>
          Alert.alert('Erase all data?', 'This removes every task and project on this device.', [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Erase', style: 'destructive', onPress: onClear},
          ])
        }>
        <Text style={styles.dangerText}>Erase all data</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {padding: 22},
  title: {fontSize: 34, letterSpacing: 1, color: colors.ink, fontWeight: '300', marginTop: 10, marginBottom: 14},
  card: {backgroundColor: colors.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.cardBorder, marginBottom: 14},
  h: {fontSize: 20, fontWeight: '600', color: colors.ink, marginBottom: 6},
  p: {color: colors.muted, marginBottom: 6, lineHeight: 20},
  feature: {color: colors.ink, fontSize: 16, paddingVertical: 6},
  danger: {borderWidth: 1, borderColor: '#B04A3A', borderRadius: 12, paddingVertical: 14, alignItems: 'center'},
  dangerText: {color: '#B04A3A', fontWeight: '600'},
});
