// screens/ClassFormScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { loadData, saveData } from '../storage';

/* ---------- Navigation Params ---------- */

type RootStackParamList = {
  ClassForm: {
    classId?: string;
    name?: string;
    section?: string;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'ClassForm'>;

/* ---------- Component ---------- */

const ClassFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const editing = !!route?.params?.classId;
  const [name, setName] = useState(route?.params?.name || '');
  const [section, setSection] = useState(route?.params?.section || '');

  useEffect(() => {
    navigation.setOptions({ title: editing ? 'Edit Class' : 'Add Class' });
  }, [editing, navigation]);

  const onSave = async () => {
    if (!name.trim()) return;

    const data = await loadData();

    if (editing && route.params?.classId) {
      data.classes = data.classes.map((c) =>
        c.id === route.params!.classId ? { ...c, name, section } : c
      );
    } else {
      data.classes.push({
        id: 'class_' + Date.now(),
        name,
        section,
      });
    }

    await saveData(data);
    navigation.goBack();
  };

  return (
    <View className="flex-1 bg-slate-100 p-4">
      <View className="gap-4">
        <TextInput
          placeholder="Class Name"
          value={name}
          onChangeText={setName}
          className="bg-white rounded-xl px-4 py-3 border border-slate-200"
        />
        <TextInput
          placeholder="Section (optional)"
          value={section}
          onChangeText={setSection}
          className="bg-white rounded-xl px-4 py-3 border border-slate-200"
        />
        <TouchableOpacity
          className="mt-2 rounded-xl bg-blue-600 py-3 items-center"
          onPress={onSave}
        >
          <Text className="text-white font-semibold">
            {editing ? 'Save Changes' : 'Add Class'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ClassFormScreen;
