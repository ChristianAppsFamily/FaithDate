export type RootStackParamList = {
  Landing: undefined;
  Onboarding: { step?: number } | undefined;
  MainApp: undefined;
};

export type OnboardingStackParamList = {
  GenderAge: undefined;
  FaithStatus: undefined;
  PhotoUpload: undefined;
  PersonalQuestions: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Notifications: undefined;
  Search: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  FullProfile: { userId: string };
  Reels: undefined;
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  FeedbackSupport: undefined;
  ContactSupport: undefined;
  RateReview: undefined;
};

export type MessageStackParamList = {
  ChatList: undefined;
  Chat: { userId: string; userName: string };
};

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  faith: string;
  location: string;
  bio: string;
  photos: string[];
  interests: string[];
  isVerified: boolean;
  compatibility?: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'message' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Chat {
  id: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}
