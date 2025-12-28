// screens/StudentsScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { loadData, saveData, Student } from '../storage';

/* ---------- Navigation types for this screen ---------- */

type RootStackParamList = {
  Students: { classId: string; className?: string };
  StudentForm: {
    classId: string;
    studentId?: string;
    name?: string;
    rollNo?: string;
  };
  Attendance: { classId: string; className?: string };
  Report: { classId: string; className?: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Students'>;

/* ---------- Component ---------- */

const StudentsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { classId, className } = route.params;

  const [students, setStudents] = useState<Student[]>([]);

  const load = async (): Promise<void> => {
    const data = await loadData();
    setStudents(data.students.filter((s) => s.classId === classId));
  };

  useEffect(() => {
    navigation.setOptions({ title: className || 'Students' });
  }, [className, navigation]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const deleteStudent = (student: Student): void => {
    Alert.alert('Delete Student', `Delete student "${student.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const data = await loadData();
          // remove from students
          data.students = data.students.filter((s) => s.id !== student.id);
          // remove from attendance records
          data.attendance = data.attendance.map((a) => {
            const newRecords = { ...a.records };
            delete newRecords[student.id];
            return { ...a, records: newRecords };
          });

          await saveData(data);
          load();
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Student }) => (
    <View className="mb-3 flex-row items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
      <View className="flex-1">
        <Text className="text-base font-semibold text-slate-800">
          {item.name}
        </Text>
        {item.rollNo ? (
          <Text className="mt-1 text-xs text-slate-500">
            Roll No: {item.rollNo}
          </Text>
        ) : null}
      </View>
      <View className="flex-row gap-2">
        <TouchableOpacity
          className="rounded-full bg-blue-100 px-3 py-1"
          onPress={() =>
            navigation.navigate('StudentForm', {
              classId,
              studentId: item.id,
              name: item.name,
              rollNo: item.rollNo,
            })
          }
        >
          <Text className="text-xs font-semibold text-blue-700">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-full bg-red-100 px-3 py-1"
          onPress={() => deleteStudent(item)}
        >
          <Text className="text-xs font-semibold text-red-700">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-100 p-4">
      {students.length === 0 ? (
        <Text className="mt-4 text-center text-slate-500">
          No students yet. Add your first student.
        </Text>
      ) : (
        <FlatList<Student>
          data={students}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}

      <View className="mt-4 gap-3">
        <TouchableOpacity
          className="items-center rounded-xl bg-emerald-600 py-3"
          onPress={() => navigation.navigate('StudentForm', { classId })}
        >
          <Text className="font-semibold text-white">Add Student</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center rounded-xl bg-blue-600 py-3"
          onPress={() => navigation.navigate('Attendance', { classId, className })}
        >
          <Text className="font-semibold text-white">Mark Attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center rounded-xl bg-purple-600 py-3"
          onPress={() => navigation.navigate('Report', { classId, className })}
        >
          <Text className="font-semibold text-white">Monthly Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StudentsScreen;
