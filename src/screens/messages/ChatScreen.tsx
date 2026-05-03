import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MessageStackParamList } from '../../types';
import { COLORS } from '../../constants';

type NavigationProp = NativeStackNavigationProp<MessageStackParamList, 'Chat'>;
type ChatRouteProp = RouteProp<MessageStackParamList, 'Chat'>;

const AI_SUGGESTIONS = [
  'Ask about their faith journey',
  'Share a favorite Bible verse',
  'Suggest a coffee meetup',
  'Ask about their church',
];

const INITIAL_MESSAGES = [
  {
    id: '1',
    senderId: 'them',
    text: 'Hi there! I saw your profile and was really encouraged by your faith statement.',
    timestamp: '10:30 AM',
    isRead: true,
  },
  {
    id: '2',
    senderId: 'me',
    text: 'Thank you so much! That means a lot. I really appreciated reading about your mission work.',
    timestamp: '10:32 AM',
    isRead: true,
  },
  {
    id: '3',
    senderId: 'them',
    text: 'It has been such a blessing! Serving others really puts things in perspective.',
    timestamp: '10:35 AM',
    isRead: true,
  },
];

export default function ChatScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ChatRouteProp>();
  const { userName } = route.params;
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: 'me',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const applyAiSuggestion = (suggestion: string) => {
    setInputText(suggestion);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="chevron-left" size={24} color="#fff" />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{userName}</Text>
          <View style={styles.onlineStatus}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Active Now</Text>
          </View>
        </View>
        <Pressable style={styles.moreButton}>
          <Feather name="more-vertical" size={20} color="#fff" />
        </Pressable>
      </View>

      {/* AI Assistant Toggle */}
      <View style={styles.aiToggleContainer}>
        <View style={styles.aiToggleLeft}>
          <View style={styles.aiIcon}>
            <Feather name="cpu" size={18} color={COLORS.primary} />
          </View>
          <Text style={styles.aiToggleText}>AI Dating Assistant</Text>
        </View>
        <Switch
          value={aiAssistantEnabled}
          onValueChange={setAiAssistantEnabled}
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
          thumbColor="#fff"
        />
      </View>

      {/* AI Suggestions */}
      {aiAssistantEnabled && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsContainer}
        >
          {AI_SUGGESTIONS.map((suggestion, index) => (
            <Pressable
              key={index}
              style={styles.suggestionChip}
              onPress={() => applyAiSuggestion(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.senderId === 'me' ? styles.myMessage : styles.theirMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.senderId === 'me' ? styles.myMessageText : styles.theirMessageText,
              ]}
            >
              {message.text}
            </Text>
            <View style={styles.messageFooter}>
              <Text
                style={[
                  styles.messageTime,
                  message.senderId === 'me' ? styles.myMessageTime : styles.theirMessageTime,
                ]}
              >
                {message.timestamp}
              </Text>
              {message.senderId === 'me' && (
                <Feather
                  name="check"
                  size={14}
                  color={message.isRead ? COLORS.success : COLORS.textMuted}
                />
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <Pressable style={styles.attachButton}>
            <Feather name="paperclip" size={20} color={COLORS.textSecondary} />
          </Pressable>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Enter text here..."
            placeholderTextColor={COLORS.textSecondary}
            multiline
          />
          {inputText.trim() ? (
            <Pressable style={styles.sendButton} onPress={sendMessage}>
              <Feather name="send" size={20} color="#fff" />
            </Pressable>
          ) : (
            <Pressable style={styles.micButton}>
              <Feather name="mic" size={20} color="#fff" />
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.secondary,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  onlineText: {
    color: COLORS.success,
    fontSize: 12,
  },
  moreButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  aiToggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  aiIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.accentLightPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  suggestionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  messagesContainer: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: COLORS.textPrimary,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
  },
  myMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  theirMessageTime: {
    color: COLORS.textSecondary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  attachButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: COLORS.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
