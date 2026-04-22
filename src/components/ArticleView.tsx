import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, type RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, typography } from '../theme';
import type { RootStackParamList } from '../types';

const ArticleView = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'ArticleView'>>();
  const url = route.params?.url;
  const [loading, setLoading] = useState(true);

  if (!url) {
    return (
      <View style={styles.center}>
        <Ionicons name="globe-outline" size={56} color={colors.textMuted} />
        <Text style={styles.centerText}>Selecciona un artículo para ver.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
      {loading && (
        <View style={styles.overlay} pointerEvents="none">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[typography.body, { marginTop: spacing.md }]}>Cargando artículo...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  centerText: { ...typography.body, marginTop: spacing.md, textAlign: 'center' },
});

export default ArticleView;
