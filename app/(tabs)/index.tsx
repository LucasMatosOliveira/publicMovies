import { Image } from 'expo-image';
import { Platform, StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { use, useCallback, useEffect, useState } from 'react';
import { MovieAPI, Movie } from '../../api';
import { FlatList } from 'react-native-gesture-handler';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMovies = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const api = new MovieAPI();
    const result = await api.findMovies(page);

    if (result.length > 0) {
      setMovies((prev) => [...prev, ...result]);
      setPage((prev) => prev + 1);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    loadMovies();
  }, []);

  const renderHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedText type="title" style={styles.title}>Filmes</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={movies.filter((movie, index, self) =>
          index === self.findIndex(t => t.identifier === movie.identifier)
        )}
        keyExtractor={(item) => item.identifier}
        renderItem={({ item }) => (
          <Link href={{ pathname: `/movie/[id]`, params: { id: item.identifier } }} asChild>
            <Pressable>
              <View style={styles.movieItem}>
                <Image
                  source={{ uri: `https://archive.org/services/img/${item.identifier}` }}
                  style={styles.movieImage}
                  resizeMode="cover"
                />
                <View style={styles.movieInfo}>
                  <ThemedText style={styles.movieTitle}>{item.title}</ThemedText>
                  <ThemedText numberOfLines={2}>{item.description}</ThemedText>
                </View>
              </View>
            </Pressable>
          </Link>
        )}
        onEndReached={loadMovies}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={
          loading ? <ThemedText style={styles.loadingText}>Carregando mais filmes...</ThemedText> : null
        }
        contentContainerStyle={styles.listContent}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    color: '#000',
    marginTop: 20,
  },
  reactLogo: {
    height: 178,
    width: 290,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  listContent: {
    padding: 16,
  },
  movieItem: {
    marginBottom: 16,
    flexDirection: 'row',
    gap: 10,
  },
  movieImage: {
    width: 80,
    height: 120,
    borderRadius: 6,
  },
  movieInfo: {
    flex: 1,
  },
  movieTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 16,
  },
});

