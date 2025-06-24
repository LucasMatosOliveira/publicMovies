import AsyncStorage from '@react-native-async-storage/async-storage';

interface MovieProgress {
    time: number;
    lastWatched: string;
    totalWatched: number;
}

export const saveMovieTime = async (movieId: string, time: number) => {
    try {
        const progress: MovieProgress = {
            time,
            lastWatched: new Date().toISOString(),
            totalWatched: time
        };

        await AsyncStorage.setItem(`movie_time_${movieId}`, JSON.stringify(progress));
    } catch (error) {
        console.error('Erro ao salvar tempo:', error);
    }
};

export const getMovieTime = async (movieId: string): Promise<number> => {
    try {
        const savedData = await AsyncStorage.getItem(`movie_time_${movieId}`);
        if (savedData) {
            const progress: MovieProgress = JSON.parse(savedData);
            return progress.time;
        }
        return 0;
    } catch (error) {
        console.error('Erro ao carregar tempo:', error);
        return 0;
    }
};

export const getMovieProgress = async (movieId: string): Promise<MovieProgress | null> => {
    try {
        const savedData = await AsyncStorage.getItem(`movie_time_${movieId}`);
        if (savedData) {
            return JSON.parse(savedData);
        }
        return null;
    } catch (error) {
        console.error('Erro ao carregar progresso:', error);
        return null;
    }
};