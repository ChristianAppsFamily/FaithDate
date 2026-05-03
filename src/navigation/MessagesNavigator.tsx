import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MessageStackParamList } from '../types';

import ChatListScreen from '../screens/messages/ChatListScreen';
import ChatScreen from '../screens/messages/ChatScreen';

const Stack = createNativeStackNavigator<MessageStackParamList>();

export default function MessagesNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChatList" component={ChatListScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}
