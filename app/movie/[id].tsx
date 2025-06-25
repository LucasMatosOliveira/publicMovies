import { Movie, MovieAPI } from "@/api";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { addFavoriteMovie, isFavoriteMovie, removeFavoriteMovie } from "@/services/favorites";
import { getMovieProgress, getMovieTime, saveMovieTime } from "@/services/movieTime";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Animated, AppState, AppStateStatus, Dimensions, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

export const screenOptions = ({ route }: { route: { params: { id: string } } }) => {
    return {
        title: route.params?.id || 'Filme',
    }
};

export default function MovieScreen() {
    const { id } = useLocalSearchParams();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [favorite, setFavorite] = useState(false);
    const [showMovie, setShowMovie] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [movieProgress, setMovieProgress] = useState<{ time: number; lastWatched: string; totalWatched: number } | null>(null);
    const [currentUrl, setCurrentUrl] = useState('');
    const [webViewLoaded, setWebViewLoaded] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const navigation = useNavigation();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const fadeAnim = useState(new Animated.Value(1))[0];
    const webViewRef = useRef<WebView>(null);
    const appState = useRef(AppState.currentState);
    const lastSaveTime = useRef(0);


    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };


    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const saveCurrentTime = async (time: number) => {
        if (!movie || time <= 0) return;

        const now = Date.now();
        if (now - lastSaveTime.current < 5000) return;

        try {
            await saveMovieTime(movie.identifier, time);
            lastSaveTime.current = now;
            console.log(`Tempo salvo para ${movie.title}: ${Math.floor(time / 60)}:${Math.floor(time % 60).toString().padStart(2, '0')}`);
        } catch (error) {
            console.error('Erro ao salvar tempo:', error);
        }
    };

    const loadSavedTime = async () => {
        if (!movie) return;
        try {
            const progress = await getMovieProgress(movie.identifier);
            if (progress && progress.time > 0) {
                setCurrentTime(progress.time);
                setMovieProgress(progress);
                setShowMovie(true);
                console.log(`Tempo carregado para ${movie.title}: ${formatTime(progress.time)}`);
            }
        } catch (error) {
            console.error('Erro ao carregar tempo:', error);
        }
    };


    const getSimplifiedJavaScript = () => `
        (function() {
            console.log('Iniciando captura simplificada...');

            let lastTime = 0;
            let checkCount = 0;
            const maxChecks = 20;

            function findAndSetupVideo() {
                checkCount++;
                console.log('Tentativa', checkCount, 'de encontrar vídeo...');


                let video = null;


                video = document.querySelector('video');

                if (!video) {
                    const iframes = document.querySelectorAll('iframe');
                    for (let iframe of iframes) {
                        try {
                            if (iframe.contentDocument) {
                                video = iframe.contentDocument.querySelector('video');
                                if (video) break;
                            }
                        } catch (e) {
                            console.log('Erro ao acessar iframe:', e);
                        }
                    }
                }


                if (!video) {
                    video = document.querySelector('.jw-video video') ||
                           document.querySelector('#jwplayer video') ||
                           document.querySelector('[data-video] video');
                }

                if (video) {
                    console.log('Vídeo encontrado! Configurando...');
                    setupVideo(video);
                } else if (checkCount < maxChecks) {
                    console.log('Vídeo não encontrado, tentando novamente em 1s...');
                    setTimeout(findAndSetupVideo, 1000);
                } else {
                    console.log('Vídeo não encontrado após', maxChecks, 'tentativas');
                }
            }

            function setupVideo(video) {

                if (${currentTime} > 0) {
                    video.currentTime = ${currentTime};
                    console.log('Tempo inicial definido:', ${currentTime});
                }


                setInterval(() => {
                    if (video.currentTime !== lastTime) {
                        lastTime = video.currentTime;
                        console.log('Tempo atualizado:', video.currentTime);

                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'timeUpdate',
                            time: video.currentTime,
                            isPlaying: !video.paused
                        }));
                    }
                }, 2000);


                video.addEventListener('pause', () => {
                    console.log('Vídeo pausado em:', video.currentTime);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'videoPaused',
                        time: video.currentTime
                    }));
                });

                video.addEventListener('ended', () => {
                    console.log('Vídeo terminado em:', video.currentTime);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'videoEnded',
                        time: video.currentTime
                    }));
                });
            }


            findAndSetupVideo();
        })();
    `;

    const handleWebViewMessage = (event: any) => {
        try {
            console.log('Mensagem recebida do WebView:', event.nativeEvent.data);
            const data = JSON.parse(event.nativeEvent.data);

            switch (data.type) {
                case 'timeUpdate':
                    console.log('Atualização de tempo:', data.time, 'Tocando:', data.isPlaying);
                    setCurrentTime(data.time);
                    setIsVideoPlaying(data.isPlaying);
                    if (data.isPlaying) {
                        saveCurrentTime(data.time);
                    }
                    break;

                case 'videoPaused':
                    console.log('Vídeo pausado em:', data.time);
                    setIsVideoPlaying(false);
                    saveCurrentTime(data.time);
                    break;

                case 'videoPlay':
                    console.log('Vídeo iniciado em:', data.time);
                    setIsVideoPlaying(true);
                    setCurrentTime(data.time);
                    break;

                case 'videoEnded':
                    console.log('Vídeo terminado em:', data.time);
                    setIsVideoPlaying(false);
                    saveCurrentTime(data.time);
                    break;

                case 'videoSeeking':
                    console.log('Vídeo pulando para:', data.time);
                    saveCurrentTime(data.time);
                    break;

                default:
                    console.log('Tipo de mensagem desconhecido:', data.type);
            }
        } catch (error) {
            console.error('Erro ao processar mensagem:', error);
        }
    };

    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                console.log('App voltou ao foco');
            } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
                if (currentTime > 0 && movie) {
                    saveCurrentTime(currentTime);
                }
            }
            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription?.remove();
    }, [currentTime, movie]);

    useEffect(() => {
        return () => {
            if (currentTime > 0 && movie) {
                saveCurrentTime(currentTime);
            }
        };
    }, [currentTime, movie]);

    useEffect(() => {
        if (movie) {
            loadSavedTime();
        }
    }, [movie]);

    const handleFavorite = async () => {
        if (!movie) return;
        if (favorite) {
            removeFavoriteMovie(movie.identifier);
            setFavorite(false);
        } else {
            addFavoriteMovie(movie);
            setFavorite(true);
        }
    }

    const handlePlayPress = () => {
        if (!webViewLoaded) {
            setShowMovie(true);
            return;
        }

        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            if (movie) {
                saveMovieTime(movie.identifier, currentTime);
            }
            fadeAnim.setValue(1);
        });
    };

    const handleCloseVideo = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setShowMovie(false);
            fadeAnim.setValue(1);
        });
    };

    const handleResetProgress = async () => {
        if (!movie) return;
        try {
            await AsyncStorage.removeItem(`movie_time_${movie.identifier}`);
            setCurrentTime(0);
            setMovieProgress(null);
            setShowMovie(false);
            console.log('Progresso resetado para:', movie.title);
        } catch (error) {
            console.error('Erro ao resetar progresso:', error);
        }
    };

    const testDifferentUrls = () => {
        if (!movie) return;

        const urls = [
            `https://archive.org/embed/${movie.identifier}`,
            `https://archive.org/details/${movie.identifier}`,
            `https://archive.org/stream/${movie.identifier}`,
        ];

        const currentIndex = urls.indexOf(currentUrl);
        const nextIndex = (currentIndex + 1) % urls.length;
        const newUrl = urls[nextIndex];

        setCurrentUrl(newUrl);
        console.log('Testando nova URL:', newUrl);


        setShowMovie(false);
        setTimeout(() => {
            setShowMovie(true);
        }, 100);
    };

    useEffect(() => {
        const api = new MovieAPI();
        api.findMoviesPerTitle2(id as string).then((movies) => {
            if (movies.length > 0) {
                const selectedMovie = movies[0];
                setMovie(selectedMovie);
                isFavoriteMovie(selectedMovie.identifier).then(setFavorite);
                getMovieTime(selectedMovie.identifier).then((time) => {
                    setCurrentTime(time);
                    if (time > 0) {
                        setShowMovie(true);
                    }
                });
            } else {
                setMovie(null);
            }
        }).catch(error => {
            console.error('Erro ao buscar filme:', error);
            setMovie(null);
        });
    }, [id]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: movie?.title || 'Filme',
        });
    }, [movie]);

    if (!movie) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText>Carregando...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ScrollView style={styles.scrollView}>
            <ThemedView style={styles.container}>
                <Animated.View style={[styles.mediaContainer, { opacity: fadeAnim }]}>
                    {showMovie ? (
                        <View style={styles.videoContainer}>
                            <WebView
                                ref={webViewRef}
                                source={{ uri: currentUrl || `https://archive.org/embed/${movie.identifier}` }}
                                style={styles.video}
                                allowsFullscreenVideo
                                allowsInlineMediaPlayback
                                mediaPlaybackRequiresUserAction={false}
                                domStorageEnabled={true}
                                javaScriptEnabled={true}
                                injectedJavaScript={getSimplifiedJavaScript()}
                                onMessage={handleWebViewMessage}
                                onLoadStart={() => console.log('WebView carregando...')}
                                onLoadEnd={() => console.log('WebView carregado')}
                                onError={(syntheticEvent) => {
                                    const { nativeEvent } = syntheticEvent;
                                    console.error('Erro no WebView:', nativeEvent);
                                }}
                                onHttpError={(syntheticEvent) => {
                                    const { nativeEvent } = syntheticEvent;
                                    console.error('Erro HTTP no WebView:', nativeEvent);
                                }}
                                onLoad={() => {
                                    console.log('WebView carregado completamente');

                                    setTimeout(() => {
                                        webViewRef.current?.injectJavaScript(`
                                            console.log('JavaScript adicional injetado');

                                            const video = document.querySelector('video');
                                            if (video) {
                                                console.log('Vídeo encontrado após carregamento:', video.currentTime);
                                                video.currentTime = ${currentTime};
                                            }
                                        `);
                                    }, 2000);
                                }}
                            />
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={handleCloseVideo}
                            >
                                <IconSymbol
                                    name="xmark"
                                    size={24}
                                    color="#FFFFFF"
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.posterContainer}>
                            <ExpoImage
                                source={{ uri: `https://archive.org/services/img/${movie.identifier}` }}
                                style={styles.poster}
                                contentFit="cover"
                                transition={1000}
                            />
                            <TouchableOpacity
                                style={styles.playButton}
                                onPress={handlePlayPress}>

                                <ThemedText style={styles.playButtonText}>Assistir</ThemedText>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>

                <ThemedView style={styles.content}>
                    <View style={styles.titleContainer}>
                        <ThemedText type="title" style={styles.title}>{movie.title}</ThemedText>
                        <Pressable onPress={handleFavorite} style={styles.favoriteButton}>
                            <IconSymbol
                                name={favorite ? "heart.fill" : "heart"}
                                size={28}
                                color={favorite ? "#ff3b30" : Colors[colorScheme ?? 'light'].text}
                            />
                        </Pressable>
                    </View>

                    <ThemedView style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Informações Básicas</ThemedText>
                        <View style={styles.infoRow}>
                            <ThemedText style={styles.label}>Título:</ThemedText>
                            <ThemedText style={styles.value}>{movie.title}</ThemedText>
                        </View>
                    </ThemedView>

                    {currentTime > 0 && (
                        <ThemedView style={styles.section}>
                            <ThemedText style={styles.sectionTitle}>Progresso do Vídeo</ThemedText>
                            <View style={styles.infoRow}>
                                <ThemedText style={styles.label}>Tempo atual:</ThemedText>
                                <ThemedText style={styles.value}>{formatTime(currentTime)}</ThemedText>
                            </View>
                            {movieProgress && (
                                <View style={styles.infoRow}>
                                    <ThemedText style={styles.label}>Última visualização:</ThemedText>
                                    <ThemedText style={styles.value}>{formatDate(movieProgress.lastWatched)}</ThemedText>
                                </View>
                            )}
                            <ThemedText style={styles.progressNote}>
                                Você parou de assistir neste ponto. O vídeo continuará de onde parou quando você clicar em "Assistir".
                            </ThemedText>
                            <TouchableOpacity
                                style={styles.resetButton}
                                onPress={handleResetProgress}
                            >
                                <ThemedText style={styles.resetButtonText}>Resetar Progresso</ThemedText>
                            </TouchableOpacity>

                        </ThemedView>
                    )}

                    <ThemedView style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Descrição</ThemedText>
                        <ThemedText style={styles.description}>{movie.description}</ThemedText>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    mediaContainer: {
        width: width,
        height: width * 1.5,
    },
    posterContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    poster: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: 20,
        gap: 24,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 16,
    },
    favoriteButton: {
        padding: 8,
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        paddingVertical: 4,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        opacity: 0.7,
    },
    value: {
        fontSize: 16,
        flex: 1,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
    },
    link: {
        fontSize: 14,
        color: '#0a7ea4',
        flex: 1,
    },
    videoContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    playButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingVertical: 12,
        paddingHorizontal: 24,
        gap: 8,
        borderRadius: 8,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 8,
        borderRadius: 20,
    },
    playButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    progressNote: {
        fontSize: 14,
        opacity: 0.7,
        fontStyle: 'italic',
    },
    resetButton: {
        backgroundColor: '#ff3b30',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginTop: 8,
    },
    resetButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    debugButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 8,
        borderRadius: 20,
    },
    debugButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});