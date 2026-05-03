import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../types';

import GenderAgeScreen from '../screens/onboarding/GenderAgeScreen';
import FaithStatusScreen from '../screens/onboarding/FaithStatusScreen';
import PhotoUploadScreen from '../screens/onboarding/PhotoUploadScreen';
import PersonalQuestionsScreen from '../screens/onboarding/PersonalQuestionsScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GenderAge" component={GenderAgeScreen} />
      <Stack.Screen name="FaithStatus" component={FaithStatusScreen} />
      <Stack.Screen name="PhotoUpload" component={PhotoUploadScreen} />
      <Stack.Screen name="PersonalQuestions" component={PersonalQuestionsScreen} />
    </Stack.Navigator>
  );
}
