import AsyncStorage from '@react-native-async-storage/async-storage';
import {Project, Task} from './types';

const TASKS_KEY = 'notebrew:tasks:v1';
const PROJECTS_KEY = 'notebrew:projects:v1';

export const defaultProjects: Project[] = [
  {id: 'home', name: 'Home', emoji: '🏠'},
  {id: 'work', name: 'Work', emoji: '💼'},
  {id: 'growth', name: 'Self growth', emoji: '🧠'},
  {id: 'ideas', name: 'Ideas', emoji: '💡'},
];

async function read<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const loadTasks = () => read<Task[]>(TASKS_KEY, []);
export const loadProjects = () => read<Project[]>(PROJECTS_KEY, defaultProjects);
export const saveTasks = (t: Task[]) => AsyncStorage.setItem(TASKS_KEY, JSON.stringify(t));
export const saveProjects = (p: Project[]) =>
  AsyncStorage.setItem(PROJECTS_KEY, JSON.stringify(p));
