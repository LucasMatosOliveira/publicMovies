import { Movie } from '@/api';
import { addFavoriteMovie as addFavoriteToDB, removeFavoriteMovie as removeFavoriteFromDB, isFavoriteMovie as isFavoriteInDB, getFavoriteMovies as getFavoritesFromDB } from './database';

export async function addFavoriteMovie(movie: Movie) {
    try {
        await addFavoriteToDB(movie);
    } catch (error) {
        console.error('Erro ao adicionar favorito:', error);
    }
}

export async function removeFavoriteMovie(identifier: string) {
    try {
        await removeFavoriteFromDB(identifier);
    } catch (error) {
        console.error('Erro ao remover favorito:', error);
    }
}

export async function isFavoriteMovie(identifier: string): Promise<boolean> {
    try {
        return await isFavoriteInDB(identifier);
    } catch (error) {
        console.error('Erro ao verificar favorito:', error);
        return false;
    }
}

export async function getFavoriteMovies(): Promise<Movie[]> {
    try {
        return await getFavoritesFromDB();
    } catch (error) {
        console.error('Erro ao obter favoritos:', error);
        return [];
    }
}