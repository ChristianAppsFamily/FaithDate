import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants';

const FILTERS = [
  { id: 'faith', label: 'Faith', options: ['Christian', 'Catholic', 'Jewish', 'Muslim'] },
  { id: 'age', label: 'Age Range', options: ['18-25', '26-32', '33-40', '40+'] },
  { id: 'location', label: 'Location', options: ['Near me', 'Same state', 'Any'] },
  { id: 'values', label: 'Values', options: ['Family', 'Service', 'Prayer', 'Community'] },
];

const SEARCH_RESULTS = [
  {
    id: '1',
    name: 'Sarah',
    age: 28,
    faith: 'Christian',
    location: 'Austin, TX',
    distance: '5 miles away',
  },
  {
    id: '2',
    name: 'Rachel',
    age: 26,
    faith: 'Christian',
    location: 'Dallas, TX',
    distance: '15 miles away',
  },
  {
    id: '3',
    name: 'Esther',
    age: 30,
    faith: 'Christian',
    location: 'Houston, TX',
    distance: '25 miles away',
  },
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

  const toggleFilter = (filterId: string, option: string) => {
    setActiveFilters((prev) => {
      const current = prev[filterId] || [];
      if (current.includes(option)) {
        return { ...prev, [filterId]: current.filter((o) => o !== option) };
      }
      return { ...prev, [filterId]: [...current, option] };
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.secondary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color={COLORS.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, location..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color={COLORS.textSecondary} />
            </Pressable>
          )}
        </View>

        {/* Filters */}
        <View style={styles.filtersSection}>
          <Text style={styles.sectionTitle}>Filters</Text>
          {FILTERS.map((filter) => (
            <View key={filter.id} style={styles.filterContainer}>
              <Pressable
                style={styles.filterHeader}
                onPress={() => setExpandedFilter(expandedFilter === filter.id ? null : filter.id)}
              >
                <Text style={styles.filterLabel}>{filter.label}</Text>
                <View style={styles.filterRight}>
                  {(activeFilters[filter.id]?.length || 0) > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{activeFilters[filter.id]?.length}</Text>
                    </View>
                  )}
                  <Feather
                    name={expandedFilter === filter.id ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </View>
              </Pressable>
              
              {expandedFilter === filter.id && (
                <View style={styles.filterOptions}>
                  {filter.options.map((option) => (
                    <Pressable
                      key={option}
                      style={[
                        styles.filterOption,
                        activeFilters[filter.id]?.includes(option) && styles.filterOptionActive,
                      ]}
                      onPress={() => toggleFilter(filter.id, option)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          activeFilters[filter.id]?.includes(option) && styles.filterOptionTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                      {activeFilters[filter.id]?.includes(option) && (
                        <Feather name="check" size={16} color={COLORS.primary} />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Results */}
        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Results ({SEARCH_RESULTS.length})</Text>
          {SEARCH_RESULTS.map((result) => (
            <Pressable key={result.id} style={styles.resultCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{result.name[0]}</Text>
              </View>
              <View style={styles.resultInfo}>
                <Text style={styles.resultName}>{result.name}, {result.age}</Text>
                <View style={styles.resultMeta}>
                  <Ionicons name="location" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.resultLocation}>{result.location}</Text>
                </View>
                <Text style={styles.resultDistance}>{result.distance}</Text>
              </View>
              <View style={styles.faithBadge}>
                <Ionicons name="heart" size={12} color={COLORS.primary} />
                <Text style={styles.faithText}>{result.faith}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.secondary,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  content: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  filtersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  filterContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  filterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  filterOptions: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: 12,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 4,
  },
  filterOptionActive: {
    backgroundColor: COLORS.accentLightPink,
  },
  filterOptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  filterOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  resultsSection: {
    marginBottom: 24,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accentLightPink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  resultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  resultLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  resultDistance: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  faithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.accentLightPink,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  faithText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
