export type Project = {id: string; name: string; emoji: string};

export type Task = {
  id: string;
  title: string;
  note: string;
  projectId: string;
  date: string; // YYYY-MM-DD
  doneDates: string[]; // dates (YYYY-MM-DD) on which it was completed
  repeat: boolean;
  createdAt: number;
};

export type Screen = 'today' | 'week' | 'projects' | 'profile' | 'more';
