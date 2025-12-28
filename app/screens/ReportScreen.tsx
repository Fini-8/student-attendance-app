// screens/ReportScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { loadData } from '../storage';

// --- Navigation types for this screen only ---
type RootStackParamList = {
  Report: { classId: string; className?: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Report'>;

// --- Type for each row in the report list ---
interface ReportRow {
  id: string;
  name: string;
  present: number;
  total: number;
  percent: number;
}

const ReportScreen: React.FC<Props> = ({ route }) => {
  const { classId, className } = route.params;

  const [result, setResult] = useState<ReportRow[]>([]);
  const [month] = useState<number>(new Date().getMonth() + 1);
  const [year] = useState<number>(new Date().getFullYear());

  const load = async (): Promise<void> => {
    const data = await loadData();

    const students = data.students.filter((s) => s.classId === classId);

    const attendance = data.attendance.filter(
      (a) =>
        a.classId === classId &&
        a.date.startsWith(`${year}-${String(month).padStart(2, '0')}`)
    );

    const mapped: ReportRow[] = students.map((stu) => {
      let present = 0;
      attendance.forEach((att) => {
        if (att.records[stu.id]) present++;
      });

      const total = attendance.length;
      const percent = total ? Math.round((present / total) * 100) : 0;

      return {
        id: stu.id,
        name: stu.name,
        present,
        total,
        percent,
      };
    });

    setResult(mapped);
  };

  useEffect(() => {
    load();
  }, []);

  const exportCsv = async (): Promise<void> => {
    if (!result.length) {
      Alert.alert('No data', 'No attendance data to export for this month.');
      return;
    }

    try {
      const header = 'Name,Present,Total,Percent\n';
      const rows = result
        .map((r) => `${r.name},${r.present},${r.total},${r.percent}`)
        .join('\n');
      const csv = header + rows;

      const fileName = `attendance_${className || classId}_${month}_${year}.csv`.replace(
        /\s+/g,
        '_'
      );

      // use `any` to access documentDirectory / cacheDirectory to satisfy TS
      const fsAny = FileSystem as any;
      const dir: string =
        (fsAny.documentDirectory as string | undefined) ??
        (fsAny.cacheDirectory as string | undefined) ??
        '';

      const fileUri = dir + fileName;

      // default encoding is UTF-8
      await FileSystem.writeAsStringAsync(fileUri, csv);

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Share attendance CSV',
        });
      } else {
        Alert.alert('Saved', `CSV saved to: ${fileUri}`);
      }
    } catch (e) {
      console.log('CSV export error', e);
      Alert.alert('Error', 'Failed to export CSV.');
    }
  };

  const monthName = new Date(year, month - 1).toLocaleString('default', {
    month: 'long',
  });

  const renderItem = ({ item }: { item: ReportRow }) => (
    <View className="mb-2 flex-row items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
      <View>
        <Text className="text-base font-semibold text-slate-800">
          {item.name}
        </Text>
        <Text className="mt-1 text-xs text-slate-500">
          {item.present}/{item.total} classes
        </Text>
      </View>
      <Text className="text-sm font-semibold text-blue-700">
        {item.percent}%
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-slate-100 p-4">
      <Text className="text-lg font-bold text-slate-800">
        {className ? `${className} – ` : ''}Attendance Report
      </Text>
      <Text className="mb-4 text-sm text-slate-500">
        {monthName} {year}
      </Text>

      {result.length === 0 ? (
        <Text className="mt-4 text-slate-500">
          No attendance data found for this month.
        </Text>
      ) : (
        <FlatList<ReportRow>
          data={result}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}

      <TouchableOpacity
        className="mt-4 items-center rounded-xl bg-blue-600 py-3"
        onPress={exportCsv}
      >
        <Text className="font-semibold text-white">Export as CSV</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReportScreen;
