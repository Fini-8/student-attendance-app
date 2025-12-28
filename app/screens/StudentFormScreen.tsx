// screens/StudentFormScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { loadData, saveData } from '../storage';

// --- Navigation params for this screen ---
type RootStackParamList = {
  StudentForm: {
    classId: string;
    studentId?: string;
    name?: string;
    rollNo?: string;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'StudentForm'>;

const StudentFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { classId, studentId, name: initialName, rollNo: initialRoll } = route.params;

  const editing = !!studentId;

  const [name, setName] = useState(initialName || '');
  const [rollNo, setRollNo] = useState(initialRoll || '');

  useEffect(() => {
    navigation.setOptions({ title: editing ? 'Edit Student' : 'Add Student' });
  }, [editing, navigation]);

  const onSave = async (): Promise<void> => {
    if (!name.trim()) return;

    const data = await loadData();

    if (editing) {
      // update existing student
      data.students = data.students.map((s) =>
        s.id === studentId ? { ...s, name, rollNo } : s
      );
    } else {
      // create new student
      data.students.push({
        id: 'stu_' + Date.now(),
        classId,
        name,
        rollNo,
      });
    }

    await saveData(data);
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-slate-100 p-4">
      <View className="gap-4">
        <TextInput
          placeholder="Student Name"
          value={name}
          onChangeText={setName}
          className="bg-white rounded-xl px-4 py-3 border border-slate-200"
        />
        <TextInput
          placeholder="Roll No (optional)"
          value={rollNo}
          onChangeText={setRollNo}
          className="bg-white rounded-xl px-4 py-3 border border-slate-200"
        />

        <TouchableOpacity
          className="mt-2 items-center rounded-xl bg-blue-600 py-3"
          onPress={onSave}
        >
          <Text className="font-semibold text-white">
            {editing ? 'Save Changes' : 'Add Student'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StudentFormScreen;
