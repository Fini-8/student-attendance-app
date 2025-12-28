// app/index.tsx

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ClassesScreen from './screens/ClassesScreen';
import ClassFormScreen from './screens/ClassFormScreen';
import StudentsScreen from './screens/StudentsScreen';
import StudentFormScreen from './screens/StudentFormScreen';
import AttendanceScreen from './screens/AttendanceScreen';
import ReportScreen from './screens/ReportScreen';

// Cast to any so TS stops complaining about name/component types
const Stack = createNativeStackNavigator() as any;

const Index: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="Classes">
      <Stack.Screen
        name="Classes"
        component={ClassesScreen}
        options={{ title: 'Classes' }}
      />
      <Stack.Screen
        name="ClassForm"
        component={ClassFormScreen}
        options={{ title: 'Add / Edit Class' }}
      />
      <Stack.Screen
        name="Students"
        component={StudentsScreen}
        options={{ title: 'Students' }}
      />
      <Stack.Screen
        name="StudentForm"
        component={StudentFormScreen}
        options={{ title: 'Add / Edit Student' }}
      />
      <Stack.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{ title: 'Mark Attendance' }}
      />
      <Stack.Screen
        name="Report"
        component={ReportScreen}
        options={{ title: 'Monthly Report' }}
      />
    </Stack.Navigator>
  );
};

export default Index;
