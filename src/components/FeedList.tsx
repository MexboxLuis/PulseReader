import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useAppDispatch, useAppSelector } from '../store/store';
import { fetchFeeds, setCurrentFeed } from '../store/feedSlice';
import { colors, radius, shadow, spacing, typography } from '../theme';
import type { Feed, RootStackParamList } from '../types';

const FEED_URL = 'https://www.inegi.org.mx/rss/noticias/xmlfeeds?p=2,1';

const formatDate = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
};

const FeedList = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { feeds, loading, error } = useAppSelector((s) => s.feed);

  const load = useCallback(() => {
    dispatch(fetchFeeds(FEED_URL));
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  const openFeed = (feed: Feed) => {
    dispatch(setCurrentFeed(feed.id));
    navigation.navigate('FeedDetails');
  };

  if (loading && feeds.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.centerText}>Cargando feeds...</Text>
      </View>
    );
  }

  if (error && feeds.length === 0) {
    return (
      <View style={styles.center}>
        <Ionicons name="cloud-offline-outline" size={56} color={colors.textMuted} />
        <Text style={[styles.centerTitle, { marginTop: spacing.md }]}>
          No se pudo cargar
        </Text>
        <Text style={[styles.centerText, { marginTop: spacing.xs }]}>{error}</Text>
        <Pressable onPress={load} style={({ pressed }) => [styles.retry, pressed && styles.pressed]}>
          <Ionicons name="refresh" size={16} color={colors.surface} />
          <Text style={styles.retryText}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={feeds}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={load}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openFeed(item)}
            style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          >
            <View style={styles.iconWrap}>
              <Ionicons name="newspaper" size={22} color={colors.primary} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              {!!item.description && (
                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item.description}
                </Text>
              )}
              <View style={styles.meta}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {item.articles.length} artículo{item.articles.length === 1 ? '' : 's'}
                  </Text>
                </View>
                {!!item.lastUpdated && (
                  <Text style={styles.metaDate}>{formatDate(item.lastUpdated)}</Text>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.centerText}>No hay feeds disponibles.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  listContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadow.card,
  },
  pressed: { opacity: 0.75, transform: [{ scale: 0.99 }] },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardBody: { flex: 1 },
  cardTitle: { ...typography.subtitle },
  cardDesc: { ...typography.body, marginTop: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  badge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: { color: colors.primary, fontSize: 11, fontWeight: '600' },
  metaDate: { ...typography.caption, marginLeft: spacing.sm },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  centerTitle: { ...typography.subtitle },
  centerText: { ...typography.body, marginTop: spacing.sm, textAlign: 'center' },
  retry: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  retryText: { color: colors.surface, fontWeight: '600', fontSize: 15, marginLeft: spacing.sm },
});

export default FeedList;
