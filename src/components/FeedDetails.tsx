import React from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useAppSelector } from '../store/store';
import { colors, radius, shadow, spacing, typography } from '../theme';
import type { RootStackParamList } from '../types';

const formatDate = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
};

const FeedDetails = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { feeds, currentFeedId } = useAppSelector((s) => s.feed);
  const feed = feeds.find((f) => f.id === currentFeedId) ?? null;

  if (!feed) {
    return (
      <View style={styles.center}>
        <Ionicons name="document-text-outline" size={56} color={colors.textMuted} />
        <Text style={[styles.centerTitle, { marginTop: spacing.md }]}>
          Selecciona un feed
        </Text>
        <Text style={[styles.centerText, { marginTop: spacing.xs }]}>
          Abre la pestaña Feeds y elige uno para ver sus artículos.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={feed.articles}
        keyExtractor={(item, idx) => item.id || `${idx}`}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle} numberOfLines={2}>{feed.title}</Text>
            {!!feed.description && (
              <Text style={styles.headerDesc} numberOfLines={3}>{feed.description}</Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => {
              if (!item.url) return;
              navigation.navigate('ArticleView', { url: item.url, title: item.title });
            }}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          >
            <Text style={styles.articleTitle} numberOfLines={3}>{item.title}</Text>
            {!!item.description && (
              <Text style={styles.articleSnippet} numberOfLines={3}>{item.description}</Text>
            )}
            <View style={styles.metaRow}>
              {!!item.published && (
                <View style={styles.metaLeft}>
                  <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
                  <Text style={styles.metaText}>{formatDate(item.published)}</Text>
                </View>
              )}
              <View style={{ flex: 1 }} />
              <Text style={styles.readMore}>Leer</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.primary} style={{ marginLeft: 4 }} />
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.centerText}>No hay artículos en este feed.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  header: { marginBottom: spacing.lg },
  headerTitle: { ...typography.title, fontSize: 22 },
  headerDesc: { ...typography.body, marginTop: spacing.xs },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.995 }] },
  articleTitle: { ...typography.subtitle },
  articleSnippet: { ...typography.body, marginTop: spacing.sm },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
  metaLeft: { flexDirection: 'row', alignItems: 'center' },
  metaText: { ...typography.caption, marginLeft: 4 },
  readMore: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  centerTitle: { ...typography.subtitle },
  centerText: { ...typography.body, marginTop: spacing.sm, textAlign: 'center' },
});

export default FeedDetails;
