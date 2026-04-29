import { Feather, FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const matches = [
  {
    name: 'Sophia',
    age: 29,
    city: 'Austin, TX',
    faith: 'Worship leader',
    score: '96%',
    gradient: ['#fbe2d1', '#d96e88'] as const,
    quote: 'I am praying for a relationship rooted in patience, honesty, and joyful service.',
  },
  {
    name: 'Grace',
    age: 27,
    city: 'Dallas, TX',
    faith: 'Bible study host',
    score: '91%',
    gradient: ['#f9d7e7', '#9566b8'] as const,
    quote: 'I love building community around Scripture, laughter, and shared Sunday rhythms.',
  },
  {
    name: 'Naomi',
    age: 31,
    city: 'Houston, TX',
    faith: 'Mission volunteer',
    score: '89%',
    gradient: ['#fee5b6', '#ce7a5a'] as const,
    quote: 'Serving others keeps my heart grounded, and I hope to share that calling.',
  },
];

const faithFilters = ['Shared values', 'Church attendance', 'Prayer life', 'Family goals'];

const messages = [
  {
    name: 'Sophia',
    text: 'I loved your answer about serving together. Coffee after Sunday service?',
    time: '8m',
  },
  {
    name: 'Grace',
    text: 'That devotional recommendation was exactly what I needed.',
    time: '1h',
  },
];

type Match = (typeof matches)[number];

function MatchCard({ match, onNext }: { match: Match; onNext: () => void }) {
  return (
    <View style={styles.matchCard} accessibilityLabel={`${match.name} profile preview`}>
      <LinearGradient colors={match.gradient} style={styles.photoPanel}>
        <View style={styles.topBadge}>
          <Feather name="zap" size={14} color="#fff" />
          <Text style={styles.topBadgeText}>{match.score} aligned</Text>
        </View>
        <View style={styles.silhouette} />
      </LinearGradient>

      <View style={styles.matchContent}>
        <View>
          <Text style={styles.eyebrow}>Today's match</Text>
          <Text style={styles.matchName}>
            {match.name}, {match.age}
          </Text>
          <View style={styles.inlineRow}>
            <Feather name="map-pin" size={15} color="#8e7169" />
            <Text style={styles.muted}>{match.city}</Text>
          </View>
        </View>
        <Text style={styles.bio}>
          Loves worship nights, slow mornings, and building a Christ-centered home with someone
          intentional.
        </Text>
        <View style={styles.tags}>
          {[match.faith, 'Serves weekly', 'Wants family'].map((tag) => (
            <Text key={tag} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
        <Pressable style={styles.nextMatchButton} onPress={onNext}>
          <Feather name="search" size={17} color="#fff" />
          <Text style={styles.nextMatchText}>Next match</Text>
        </Pressable>
        <View style={styles.actions}>
          <Pressable style={styles.roundButton} accessibilityLabel="Browse matches">
            <Feather name="search" size={22} color="#a87a6f" />
          </Pressable>
          <Pressable style={[styles.roundButton, styles.likeButton]} accessibilityLabel="Like profile">
            <Ionicons name="heart" size={27} color="#fff" />
          </Pressable>
          <Pressable style={styles.roundButton} accessibilityLabel="Send message">
            <Feather name="message-circle" size={22} color="#a87a6f" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function FaithPreferences() {
  return (
    <View style={styles.panel}>
      <View style={styles.sectionHeading}>
        <View style={styles.sectionText}>
          <Text style={styles.eyebrow}>Faith first</Text>
          <Text style={styles.sectionTitle}>Set your spiritual priorities</Text>
        </View>
        <View style={styles.iconButton}>
          <Feather name="sliders" size={20} color="#3a251e" />
        </View>
      </View>

      <View style={styles.filterGrid}>
        {faithFilters.map((filter) => (
          <View key={filter} style={styles.filterPill}>
            <Feather name="check" size={15} color="#7d564b" />
            <Text style={styles.filterText}>{filter}</Text>
          </View>
        ))}
      </View>

      <View style={styles.valuesCard}>
        <FontAwesome5 name="church" size={24} color="#75a478" />
        <View style={styles.flexOne}>
          <Text style={styles.valuesTitle}>Weekly church rhythm</Text>
          <Text style={styles.valuesBody}>Prioritize matches who worship and serve consistently.</Text>
        </View>
      </View>
    </View>
  );
}

function MessagesPreview() {
  return (
    <View style={styles.panel}>
      <View style={styles.sectionHeading}>
        <View style={styles.sectionText}>
          <Text style={styles.eyebrow}>Conversations</Text>
          <Text style={styles.sectionTitle}>Start with intention</Text>
        </View>
        <Text style={styles.notificationDot}>2</Text>
      </View>
      <View style={styles.messageList}>
        {messages.map((message) => (
          <View key={message.name} style={styles.messageItem}>
            <Text style={styles.avatar}>{message.name[0]}</Text>
            <View style={styles.flexOne}>
              <View style={styles.messageMeta}>
                <Text style={styles.messageName}>{message.name}</Text>
                <Text style={styles.messageTime}>{message.time}</Text>
              </View>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

function ProfileDetail({ match }: { match: Match }) {
  return (
    <View style={styles.profileDetail} accessibilityLabel="Profile detail preview">
      <LinearGradient colors={match.gradient} style={styles.detailHero}>
        <View style={styles.lightIconButton}>
          <Feather name="home" size={18} color="#3a251e" />
        </View>
        <View style={styles.verifiedBadge}>
          <Feather name="shield" size={14} color="#3a251e" />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </LinearGradient>
      <View style={styles.detailBody}>
        <Text style={styles.eyebrow}>Compatibility</Text>
        <Text key={`compatibility-${match.name}`} style={styles.compatibilityTitle}>
          {match.name} shares 7 of your top values
        </Text>
        <View style={styles.compatibility}>
          <ValuePill icon="star" label="Prayer" />
          <ValuePill icon="calendar-heart" label="Marriage minded" />
          <ValuePill icon="hand-heart" label="Service" />
        </View>
        <Text style={styles.quote}>"{match.quote}"</Text>
      </View>
    </View>
  );
}

function ValuePill({ icon, label }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }) {
  return (
    <LinearGradient colors={['#ff6f86', '#f9b74d']} style={styles.valuePill}>
      <MaterialCommunityIcons name={icon} size={15} color="#fff" />
      <Text style={styles.valuePillText}>{label}</Text>
    </LinearGradient>
  );
}

function App() {
  const [matchIndex, setMatchIndex] = useState(0);
  const activeMatch = matches[matchIndex];

  function showNextMatch() {
    setMatchIndex((currentIndex) => (currentIndex + 1) % matches.length);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff7ee" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.brandRow}>
          <LinearGradient colors={['#ff6f86', '#f9b74d']} style={styles.brandMark}>
            <MaterialCommunityIcons name="heart-multiple" size={24} color="#fff" />
          </LinearGradient>
          <Text style={styles.brandText}>FaithDate</Text>
        </View>

        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>Faith-based dating app</Text>
          <Text style={styles.heroTitle}>Meet someone who shares your walk with God.</Text>
          <Text style={styles.heroSubtitle}>
              FaithDate brings intentional discovery, values-led matching, and meaningful
              conversations into one calm mobile experience.
          </Text>
          <View style={styles.ctaRow}>
            <Pressable style={styles.primaryCta}>
              <Text style={styles.primaryCtaText}>Create your profile</Text>
            </Pressable>
            <Pressable style={styles.secondaryCta}>
              <Text style={styles.secondaryCtaText}>Explore matches</Text>
            </Pressable>
          </View>
          <View style={styles.trustRow}>
            <TrustPill icon="shield-check" label="Verified profiles" />
            <TrustPill icon="church" label="Faith filters" />
          </View>
        </View>

        <View style={styles.phoneFrame}>
          <View style={styles.phoneScreen}>
            <View style={styles.appHeader}>
              <View>
                <Text style={styles.eyebrowSmall}>Good morning</Text>
                <Text style={styles.userName}>Daniel</Text>
              </View>
              <View style={styles.iconButton}>
                <Feather name="bell" size={20} color="#3a251e" />
              </View>
            </View>
            <MatchCard match={activeMatch} onNext={showNextMatch} />
            <View style={styles.tabBar}>
              <Feather name="home" size={22} color="#9c7c72" />
              <Ionicons name="heart-outline" size={24} color="#9c7c72" />
              <Feather name="message-circle" size={22} color="#9c7c72" />
              <Feather name="user" size={22} color="#9c7c72" />
            </View>
          </View>
        </View>

        <FaithPreferences />
        <ProfileDetail match={activeMatch} />
        <MessagesPreview />
      </ScrollView>
    </SafeAreaView>
  );
}

function TrustPill({ icon, label }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string }) {
  return (
    <View style={styles.trustPill}>
      <MaterialCommunityIcons name={icon} size={17} color="#704f43" />
      <Text style={styles.trustText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff7ee',
  },
  scrollContent: {
    gap: 22,
    padding: 20,
    paddingBottom: 44,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  brandMark: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 46,
    height: 46,
    borderRadius: 18,
  },
  brandText: {
    color: '#3a251e',
    fontSize: 19,
    fontWeight: '900',
  },
  heroCopy: {
    gap: 18,
  },
  eyebrow: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    overflow: 'hidden',
    color: '#a24e3c',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderColor: 'rgba(255,137,107,0.22)',
    borderWidth: 1,
    borderRadius: 999,
  },
  eyebrowSmall: {
    color: '#a24e3c',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#30201a',
    fontFamily: 'Georgia',
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -2.5,
    lineHeight: 47,
  },
  heroSubtitle: {
    color: '#765a51',
    fontSize: 17,
    lineHeight: 28,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  primaryCta: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 22,
    backgroundColor: '#ff6f86',
    borderRadius: 999,
  },
  primaryCtaText: {
    color: '#fff',
    fontWeight: '900',
  },
  secondaryCta: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 22,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderColor: 'rgba(116,77,62,0.12)',
    borderWidth: 1,
    borderRadius: 999,
  },
  secondaryCtaText: {
    color: '#3a251e',
    fontWeight: '900',
  },
  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  trustPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.58)',
    borderRadius: 999,
  },
  trustText: {
    color: '#704f43',
    fontSize: 13,
    fontWeight: '800',
  },
  phoneFrame: {
    padding: 12,
    backgroundColor: '#2f2522',
    borderRadius: 42,
  },
  phoneScreen: {
    minHeight: 760,
    paddingBottom: 22,
    overflow: 'hidden',
    backgroundColor: '#fffaf4',
    borderRadius: 32,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 16,
  },
  userName: {
    color: '#3a251e',
    fontSize: 20,
    fontWeight: '900',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 42,
    backgroundColor: '#fff',
    borderColor: 'rgba(73,37,27,0.08)',
    borderWidth: 1,
    borderRadius: 16,
  },
  matchCard: {
    marginHorizontal: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderRadius: 30,
    shadowColor: '#753c25',
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 6,
  },
  photoPanel: {
    minHeight: 240,
  },
  topBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: 'rgba(48,32,26,0.3)',
    borderRadius: 999,
  },
  topBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  silhouette: {
    position: 'absolute',
    top: 54,
    alignSelf: 'center',
    width: 170,
    height: 184,
    backgroundColor: '#ffd4b4',
    borderRadius: 86,
  },
  matchContent: {
    gap: 14,
    padding: 20,
  },
  matchName: {
    color: '#30201a',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
  },
  muted: {
    color: '#8e7169',
  },
  bio: {
    color: '#6f5148',
    lineHeight: 23,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 11,
    paddingVertical: 8,
    overflow: 'hidden',
    color: '#7d564b',
    fontSize: 12,
    fontWeight: '900',
    backgroundColor: '#fff0e6',
    borderRadius: 999,
  },
  nextMatchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 44,
    backgroundColor: '#e84f71',
    borderRadius: 999,
  },
  nextMatchText: {
    color: '#fff',
    fontWeight: '900',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
  },
  roundButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    backgroundColor: '#fff5ef',
    borderRadius: 20,
  },
  likeButton: {
    width: 64,
    height: 64,
    backgroundColor: '#ff6f86',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    minHeight: 58,
    marginHorizontal: 22,
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 24,
  },
  panel: {
    gap: 20,
    padding: 22,
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderColor: 'rgba(122,81,61,0.1)',
    borderWidth: 1,
    borderRadius: 30,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 14,
  },
  sectionText: {
    flex: 1,
    gap: 12,
  },
  sectionTitle: {
    color: '#30201a',
    fontFamily: 'Georgia',
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 32,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff0e6',
    borderRadius: 999,
  },
  filterText: {
    color: '#7d564b',
    fontWeight: '900',
  },
  valuesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: '#fff7f0',
    borderRadius: 22,
  },
  flexOne: {
    flex: 1,
  },
  valuesTitle: {
    color: '#634a42',
    fontWeight: '900',
  },
  valuesBody: {
    marginTop: 4,
    color: '#8e7169',
    lineHeight: 21,
  },
  profileDetail: {
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.76)',
    borderColor: 'rgba(122,81,61,0.1)',
    borderWidth: 1,
    borderRadius: 30,
  },
  detailHero: {
    minHeight: 230,
  },
  lightIconButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 42,
    backgroundColor: 'rgba(255,255,255,0.84)',
    borderRadius: 16,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 9,
    backgroundColor: 'rgba(255,255,255,0.84)',
    borderRadius: 999,
  },
  verifiedText: {
    color: '#3a251e',
    fontSize: 12,
    fontWeight: '900',
  },
  detailBody: {
    gap: 16,
    padding: 22,
  },
  compatibilityTitle: {
    color: '#30201a',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 34,
  },
  compatibility: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  valuePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
  },
  valuePillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  quote: {
    padding: 17,
    color: '#60483f',
    lineHeight: 25,
    backgroundColor: '#fff0e6',
    borderLeftColor: '#ff6f86',
    borderLeftWidth: 4,
    borderRadius: 18,
  },
  notificationDot: {
    minWidth: 34,
    height: 34,
    overflow: 'hidden',
    color: '#fff',
    fontWeight: '900',
    lineHeight: 34,
    textAlign: 'center',
    backgroundColor: '#ff6f86',
    borderRadius: 17,
  },
  messageList: {
    gap: 13,
  },
  messageItem: {
    flexDirection: 'row',
    gap: 13,
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: '#fff7f0',
    borderRadius: 22,
  },
  avatar: {
    width: 46,
    height: 46,
    overflow: 'hidden',
    color: '#fff',
    fontWeight: '900',
    lineHeight: 46,
    textAlign: 'center',
    backgroundColor: '#75a478',
    borderRadius: 23,
  },
  messageMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 4,
  },
  messageName: {
    color: '#30201a',
    fontWeight: '900',
  },
  messageTime: {
    color: '#8e7169',
  },
  messageText: {
    color: '#8e7169',
    lineHeight: 21,
  },
});

export default App;
