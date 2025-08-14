export type PlanningCategory = {
  id: number;
  label: string;
  completed: boolean;
  parnet: number;
  tag: string;
  parentLabel: string;
  lastDone: string;
  repeatFreq: number | null;
  effort: number;
};

export type PlanningCategories = PlanningCategory[];

export type DailyTodo = {
  id: number;
  label: string;
  completed: boolean;
  timelineId: number;
  catId: number;
  effort: number;
};

export type TodoTimelineItem = {
  date: string;
  id: number;
  energyCap: number;
};

export type TodoTimeline = TodoTimelineItem[];

export type Routine = {
  title: string;
  id: number;
};

export type Routines = Routine[];

export type RoutineItem = {
  id: number;
  label: string;
  routineId: number;
  catId?: number;
  effort: number;
};
