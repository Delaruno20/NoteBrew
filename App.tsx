import React, {useCallback, useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import TabBar from './src/components/TabBar';
import TaskModal from './src/components/TaskModal';
import {toKey} from './src/dates';
import MoreScreen from './src/screens/MoreScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ProjectsScreen from './src/screens/ProjectsScreen';
import TodayScreen from './src/screens/TodayScreen';
import WeekScreen from './src/screens/WeekScreen';
import {defaultProjects, loadProjects, loadTasks, saveProjects, saveTasks} from './src/storage';
import {colors} from './src/theme';
import {Project, Screen, Task} from './src/types';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const EMOJIS = ['📁', '🌱', '🎯', '📚', '🎨', '🧩'];

export default function App() {
  const [screen, setScreen] = useState<Screen>('today');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [ready, setReady] = useState(false);
  const [modal, setModal] = useState<{task: Task | null; date: string} | null>(null);

  useEffect(() => {
    (async () => {
      setTasks(await loadTasks());
      setProjects(await loadProjects());
      setReady(true);
    })();
  }, []);

  const updateTasks = useCallback((next: Task[]) => {
    setTasks(next);
    saveTasks(next);
  }, []);

  const updateProjects = (next: Project[]) => {
    setProjects(next);
    saveProjects(next);
  };

  const toggle = (id: string, key: string) =>
    updateTasks(
      tasks.map(t =>
        t.id === id
          ? {...t, doneDates: t.doneDates.includes(key) ? t.doneDates.filter(d => d !== key) : [...t.doneDates, key]}
          : t,
      ),
    );

  const quickAdd = (title: string, date: string) =>
    updateTasks([
      ...tasks,
      {id: uid(), title, note: '', projectId: projects[0]?.id ?? '', date, doneDates: [], repeat: false, createdAt: Date.now()},
    ]);

  const save = (data: Omit<Task, 'id' | 'createdAt' | 'doneDates'> & {id?: string}) => {
    if (data.id) {
      updateTasks(tasks.map(t => (t.id === data.id ? {...t, ...data, id: t.id} : t)));
    } else {
      updateTasks([...tasks, {...data, id: uid(), doneDates: [], createdAt: Date.now()}]);
    }
    setModal(null);
  };

  const remove = (id: string) => {
    updateTasks(tasks.filter(t => t.id !== id));
    setModal(null);
  };

  const addProject = (name: string) =>
    updateProjects([...projects, {id: uid(), name, emoji: EMOJIS[projects.length % EMOJIS.length]}]);

  const deleteProject = (id: string) => {
    updateProjects(projects.filter(p => p.id !== id));
    updateTasks(tasks.filter(t => t.projectId !== id));
  };

  const clearAll = () => {
    updateTasks([]);
    updateProjects(defaultProjects);
  };

  const todayKey = toKey(new Date());

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.body}>
          {ready && screen === 'today' && (
            <TodayScreen
              tasks={tasks}
              projects={projects}
              onToggle={toggle}
              onQuickAdd={quickAdd}
              onEdit={t => setModal({task: t, date: t.date})}
            />
          )}
          {ready && screen === 'week' && (
            <WeekScreen
              tasks={tasks}
              projects={projects}
              onToggle={toggle}
              onEdit={t => setModal({task: t, date: t.date})}
              onAddOn={k => setModal({task: null, date: k})}
            />
          )}
          {ready && screen === 'projects' && (
            <ProjectsScreen
              tasks={tasks}
              projects={projects}
              onAddProject={addProject}
              onDeleteProject={deleteProject}
            />
          )}
          {ready && screen === 'profile' && <ProfileScreen tasks={tasks} />}
          {ready && screen === 'more' && <MoreScreen onClear={clearAll} />}
        </View>
        <TabBar active={screen} onChange={setScreen} onAdd={() => setModal({task: null, date: todayKey})} />
        <TaskModal
          visible={!!modal}
          task={modal?.task ?? null}
          defaultDate={modal?.date ?? todayKey}
          projects={projects}
          onClose={() => setModal(null)}
          onSave={save}
          onDelete={remove}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: colors.bg},
  body: {flex: 1},
});
