import { initDatabase } from './database/sqlite';
import { Movie } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites';

export const addFavoriteMovie = async (movie: Movie) => {
    try {
        const favorites = await getFavoriteMovies();
        favorites.push(movie);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
        console.error('Erro ao adicionar favorito:', error);
    }
};

export const removeFavoriteMovie = async (identifier: string) => {
    try {
        const favorites = await getFavoriteMovies();
        const newFavorites = favorites.filter(movie => movie.identifier !== identifier);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
        console.error('Erro ao remover favorito:', error);
    }
};

export const getFavoriteMovies = async (): Promise<Movie[]> => {
    try {
        const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('Erro ao obter favoritos:', error);
        return [];
    }
};

export const isFavoriteMovie = async (identifier: string): Promise<boolean> => {
    try {
        const favorites = await getFavoriteMovies();
        return favorites.some(movie => movie.identifier === identifier);
    } catch (error) {
        console.error('Erro ao verificar favorito:', error);
        return false;
    }
};

export { initDatabase };
