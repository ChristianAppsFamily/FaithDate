import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../types';

import SettingsScreen from '../screens/settings/SettingsScreen';
import EditProfileScreen from '../screens/settings/EditProfileScreen';
import ChangePasswordScreen from '../screens/settings/ChangePasswordScreen';
import FeedbackSupportScreen from '../screens/settings/FeedbackSupportScreen';
import ContactSupportScreen from '../screens/settings/ContactSupportScreen';
import RateReviewScreen from '../screens/settings/RateReviewScreen';
import PrivacyPolicyScreen from '../screens/settings/PrivacyPolicyScreen';

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export default function SettingsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SettingsMain" component={SettingsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="FeedbackSupport" component={FeedbackSupportScreen} />
      <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
      <Stack.Screen name="RateReview" component={RateReviewScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
  );
}
