import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import Parser from 'react-native-rss-parser';
import type { Article, Feed } from '../types';

type State = {
  feeds: Feed[];
  currentFeedId: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: State = {
  feeds: [],
  currentFeedId: null,
  loading: false,
  error: null,
};

const stripHtml = (value: string | undefined | null): string =>
  (value ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const toIso = (value: unknown): string | null => {
  if (!value) return null;
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export const fetchFeeds = createAsyncThunk<Feed, string>(
  'feed/fetchFeeds',
  async (url) => {
    const response = await fetch(url);
    const raw = await response.text();
    const normalized = raw.replace(/<row>/g, '<item>').replace(/<\/row>/g, '</item>');
    const parsed = await Parser.parse(normalized);

    const articles: Article[] = (parsed.items ?? []).map((it: any, idx: number) => ({
      id: it.id || it.links?.[0]?.url || `${url}#${idx}`,
      title: stripHtml(it.title) || 'Sin título',
      description: stripHtml(it.description),
      url: it.links?.[0]?.url ?? '',
      published: toIso(it.published),
    }));

    return {
      id: url,
      title: stripHtml(parsed.title) || 'RSS',
      description: stripHtml(parsed.description),
      lastUpdated: toIso(parsed.lastUpdated ?? parsed.lastPublished),
      articles,
    };
  },
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setCurrentFeed(state, action: PayloadAction<string>) {
      state.currentFeedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        const feed = action.payload;
        const existingIdx = state.feeds.findIndex((f) => f.id === feed.id);
        if (existingIdx >= 0) state.feeds[existingIdx] = feed;
        else state.feeds.push(feed);
        if (!state.currentFeedId) state.currentFeedId = feed.id;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error desconocido';
      });
  },
});

export const { setCurrentFeed } = feedSlice.actions;
export default feedSlice.reducer;
