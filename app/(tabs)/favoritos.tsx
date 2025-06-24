import { StyleSheet, View, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { Movie } from '@/api';
import { getFavoriteMovies } from '@/services/favorites';
import { FlatList } from 'react-native-gesture-handler';
import { Link } from 'expo-router';
import { Image as ExpoImage } from 'expo-image';

export default function FavoritosScreen() {
    const [favorites, setFavorites] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFavorites();
    }, []);

    const loadFavorites = async () => {
        setLoading(true);
        const movies = await getFavoriteMovies();
        setFavorites(movies);
        setLoading(false);
    };

    if (loading) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText>Carregando favoritos...</ThemedText>
            </ThemedView>
        );
    }

    if (favorites.length === 0) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText type="title" style={styles.title}>Favoritos</ThemedText>
                <ThemedText style={styles.emptyText}>Nenhum filme favorito ainda.</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>Favoritos</ThemedText>
            <FlatList
                data={favorites}
                keyExtractor={(item) => item.identifier}
                renderItem={({ item }) => (
                    <Link href={{ pathname: `/movie/[id]`, params: { id: item.identifier } }} asChild>
                        <Pressable style={styles.movieItem}>
                            <ExpoImage
                                source={{ uri: `https://archive.org/services/img/${item.identifier}` }}
                                style={styles.movieImage}
                                contentFit="cover"
                                transition={1000}
                            />
                            <View style={styles.movieInfo}>
                                <ThemedText style={styles.movieTitle}>{item.title}</ThemedText>
                                <ThemedText numberOfLines={2} style={styles.movieDescription}>
                                    {item.description}
                                </ThemedText>
                            </View>
                        </Pressable>
                    </Link>
                )}
                contentContainerStyle={styles.listContent}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        marginBottom: 16,
    },
    emptyText: {
        textAlign: 'center',
        opacity: 0.7,
    },
    listContent: {
        gap: 16,
    },
    movieItem: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: 'rgba(0,0,0,0.03)',
        borderRadius: 12,
        overflow: 'hidden',
    },
    movieImage: {
        width: 100,
        height: 150,
    },
    movieInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    movieTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    movieDescription: {
        fontSize: 14,
        opacity: 0.7,
        lineHeight: 20,
    },
});