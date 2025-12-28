// storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'ATTENDANCE_DATA_V1';

/* ---------- Types ---------- */

export interface ClassItem {
  id: string;
  name: string;
  section?: string;
}

export interface Student {
  id: string;
  name: string;
  rollNo?: string;
  classId: string; // which class they belong to
}

export interface AttendanceRecordMap {
  /** key = studentId, value = true (present) | false (absent) */
  [studentId: string]: boolean;
}

export interface AttendanceEntry {
  id: string;
  classId: string;
  /** date in YYYY-MM-DD format */
  date: string;
  records: AttendanceRecordMap;
}

export interface AttendanceData {
  classes: ClassItem[];
  students: Student[];
  attendance: AttendanceEntry[];
}

/* ---------- Default data ---------- */

const defaultData: AttendanceData = {
  classes: [],
  students: [],
  attendance: [],
};

/* ---------- Helpers ---------- */

export const loadData = async (): Promise<AttendanceData> => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return defaultData;

    const parsed = JSON.parse(raw) as AttendanceData;
    // basic sanity fallback
    return {
      classes: parsed.classes ?? [],
      students: parsed.students ?? [],
      attendance: parsed.attendance ?? [],
    };
  } catch (e) {
    console.log('Error loading:', e);
    return defaultData;
  }
};

export const saveData = async (data: AttendanceData): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(data));
  } catch (e) {
    console.log('Error saving:', e);
  }
};
