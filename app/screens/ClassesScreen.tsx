// screens/ClassesScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { loadData, saveData } from '../storage';

const ClassesScreen: React.FC<any> = ({ navigation }) => {
  const [classes, setClasses] = useState<any[]>([]);

  const load = async () => {
    const data = await loadData();
    setClasses(data.classes);
  };

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation]);

  const deleteClass = (cls: any) => {
    Alert.alert(
      'Delete Class',
      `Delete class "${cls.name}"? This will also delete its students and attendance.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const data = await loadData();
            data.classes = data.classes.filter((c: any) => c.id !== cls.id);
            data.students = data.students.filter((s: any) => s.classId !== cls.id);
            data.attendance = data.attendance.filter((a: any) => a.classId !== cls.id);
            await saveData(data);
            load();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="mb-3 rounded-xl border border-slate-200 bg-white p-4 flex-row justify-between items-center"
      onPress={() =>
        navigation.navigate('Students', {
          classId: item.id,          // ✅ ALWAYS send classId
          className: item.name,      // optional
        })
      }
    >
      <View className="flex-1">
        <Text className="text-lg font-semibold text-slate-800">{item.name}</Text>
        {item.section ? (
          <Text className="text-xs text-slate-500 mt-1">Section: {item.section}</Text>
        ) : null}
      </View>

      <View className="flex-row gap-2">
        <TouchableOpacity
          className="px-3 py-1 rounded-full bg-blue-100"
          onPress={() =>
            navigation.navigate('ClassForm', {
              classId: item.id,
              name: item.name,
              section: item.section,
            })
          }
        >
          <Text className="text-blue-700 text-xs font-semibold">Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-3 py-1 rounded-full bg-red-100"
          onPress={() => deleteClass(item)}
        >
          <Text className="text-red-700 text-xs font-semibold">Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-slate-100 p-4">
      {classes.length === 0 ? (
        <Text className="text-center text-slate-500 mt-4">
          No classes yet. Tap + to add one.
        </Text>
      ) : (
        <FlatList data={classes} keyExtractor={(item) => item.id} renderItem={renderItem} />
      )}

      <TouchableOpacity
        className="absolute right-5 bottom-5 w-14 h-14 rounded-full bg-blue-600 items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('ClassForm')}
      >
        <Text className="text-white text-3xl -mt-1">+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ClassesScreen;
