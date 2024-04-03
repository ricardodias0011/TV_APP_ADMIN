import { Dimensions, Image, ScrollView, StyleSheet, Text, ImageBackground, View, TouchableOpacity, RefreshControl } from "react-native"
import { Theme } from "../../../theme";
import { useEffect, useState } from "react";
import apiTmdb, { API_KEY } from "../../services/tmdb/api";
import { MovieTypes } from "../../types/movie";
import MovieCard from "../../components/moviecard";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { auth, dbFirestor } from "../../services/firebase";
import { where, collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { getIdToken, getAuth } from "firebase/auth";
import Genre from "../../services/tmdb/genre.json"
import { StatusBar } from 'expo-status-bar';
import useAuth from "../../contexts/auth";
import { FontAwesome } from '@expo/vector-icons';
const HomeScreen = ({ navigation }: any) => {

    const { user } = useAuth();

    const [MainMovie, setMainMovie] = useState<MovieTypes | null>(null);
    const [moviesActions, setMoviesActions] = useState<MovieTypes[]>([]);
    const [moviesRecents, setMoviesRecents] = useState<MovieTypes[]>([]);
    const [moviesFantasy, setMoviesFantasy] = useState<MovieTypes[]>([]);
    const [moviesHorror, setHorror] = useState<MovieTypes[]>([]);
    const [moviesComedia, setMoviesComedia] = useState<MovieTypes[]>([]);

    const [moviesPopularity, setMoviesPopularity] = useState<MovieTypes[]>([]);

    const [loadingRefresh, setLoadingRefresh] = useState<boolean>(false);


    const getPopularityMovies = async () => {

        try {
            const collectionRef = query(collection(dbFirestor, "catalog"), orderBy("popularity", "desc"), limit(15))
            const data = await getDocs(collectionRef)
            let moviesAdd: any = []
            data.forEach((doc) => {
                moviesAdd.push(doc.data())
            })
            setMoviesPopularity(moviesAdd)
        }
        catch (err) {
            console.log(err);
        }
    }

    const getPopularityFilmes = async () => {
        try {
            const collectionRef = query(collection(dbFirestor, "catalog"), where("genre_ids", "array-contains", 28), limit(10))
            const data = await getDocs(collectionRef)
            let moviesAdd: any = []
            data.forEach((doc) => {
                moviesAdd.push(doc.data())
            })
            setMainMovie(moviesAdd[0])
            setMoviesActions(moviesAdd)
        }
        catch (err) {
            console.log(err);
        }
    }

    const getComedyFilmes = async () => {
        try {
            const collectionRef = query(collection(dbFirestor, "catalog"), where("genre_ids", "array-contains", 35), limit(10))
            const data = await getDocs(collectionRef)
            let moviesAdd: any = []
            data.forEach((doc) => {
                moviesAdd.push(doc.data())
            })
            setMoviesComedia(moviesAdd)
        }
        catch (err) {
            console.log(err);
        }
    }

    const getPopularityFilmesFantasy = async () => {

        try {
            const collectionRef = query(collection(dbFirestor, "catalog"), where("genre_ids", "array-contains", 14), limit(10))
            const data = await getDocs(collectionRef)
            let moviesAdd: any = []
            data.forEach((doc) => {
                moviesAdd.push(doc.data())
            })
            setMoviesFantasy(moviesAdd)
        }
        catch (err) {
            console.log(err);
        }
    }

    const getPopularityFilmesHorror = async () => {

        try {
            const collectionRef = query(collection(dbFirestor, "catalog"), where("genre_ids", "array-contains", 27), limit(10))
            const data = await getDocs(collectionRef)
            let moviesAdd: any = []
            data.forEach((doc) => {
                moviesAdd.push(doc.data())
            })
            setHorror(moviesAdd)
        }
        catch (err) {
            console.log(err);
        }
    }
    const ConsultDocMoviesRecents = async () => {
        try {

            const collectionRef = query(collection(dbFirestor, "catalog"),
                orderBy('createdAt', 'desc')
                , limit(15))
            const data = await getDocs(collectionRef)
            let moviesAdd: any = []
            data.forEach((doc) => {
                moviesAdd.push(doc.data())
            })
            setMoviesRecents(moviesAdd)
        }
        catch (err) {
            console.log(err);
        }

    }

    const GetGroupMovies = async () => {
        setLoadingRefresh(true)
        await ConsultDocMoviesRecents();
        await getPopularityFilmes();
        await getPopularityMovies();
        await getComedyFilmes();
        await getPopularityFilmesFantasy();
        await getPopularityFilmesHorror();
        // await getComedyFilmes();
        setLoadingRefresh(false)
    }

    useEffect(() => {
        GetGroupMovies();
    }, [])

    return (
        <ScrollView
            refreshControl={<RefreshControl
                refreshing={loadingRefresh}
                onRefresh={GetGroupMovies}
            />}
            style={{ flex: 1, backgroundColor: Theme.bgcolor }}>
            <View style={styles.container}>
                <ImageBackground
                    style={styles.movieMainContainer}
                    source={{
                        uri: `https://image.tmdb.org/t/p/w500${MainMovie?.poster_path}`
                    }}>
                    <LinearGradient
                        colors={['transparent', Theme.bgcolor]}
                        style={styles.background}
                    />
                    <View style={styles.topBarMenu}>
                        <View>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate('genry')}>
                           <Text style={styles.menuText}>Gêneros</Text>
                        </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ padding: 10 }} onPress={() => navigation.navigate('search')}>
                            <FontAwesome name="search" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.MainMovieTitle}>{MainMovie?.title}</Text>
                    <View style={styles.relevantInformation}>
                        {MainMovie?.genre_ids?.map((id) => {
                            return (
                                <Text key={id} style={[styles.relevantInformationText, { color: Theme.success }]}>
                                    {Genre.genres.find(a => a.id === id)?.name}
                                </Text>
                            )
                        })}
                        <Text style={[styles.relevantInformationText, { color: Theme.gray[100] }]}>
                            {MainMovie?.release_date.slice(0, 4)}
                        </Text>
                    </View>
                    <View style={styles.actionMain}>
                        <TouchableOpacity style={styles.btnMainPlay} onPress={() => navigation.navigate("play-content", MainMovie)}>
                            <Text>
                                <FontAwesome5 name="play" size={18} color="black" />
                            </Text>
                            <Text style={styles.btnMainPlayText}>
                                Assistir
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnMainInfos} onPress={() => navigation.navigate('detail-content', MainMovie)}>
                            <Text><Feather name="info" size={18} color="white" /> </Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
                <View style={styles.posterListView}>
                    <Text style={styles.textTitle}>{moviesRecents.length ? "Adicionados recentemente" : ""}</Text>
                    <View style={styles.listContentConteiner}>
                        <ScrollView horizontal>
                            {
                                moviesRecents?.map((data) => {
                                    return (
                                        <MovieCard key={data.id} {...data} onPress={() => navigation.navigate('detail-content', data)} />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>
                <View style={styles.posterListView}>
                    <Text style={styles.textTitle}>{moviesPopularity.length ? "Populares" : ""}</Text>
                    <View style={styles.listContentConteiner}>
                        <ScrollView horizontal>
                            {
                                moviesPopularity?.map((data) => {
                                    return (
                                        <MovieCard key={data.id} {...data} onPress={() => navigation.navigate('detail-content', data)} />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>
                <View style={[styles.posterListView, { marginTop: -25 }]}>
                    <Text style={styles.textTitle}>{moviesActions.length ? "Ação" : ""}</Text>
                    <View style={styles.listContentConteiner}>
                        <ScrollView horizontal>
                            {
                                moviesActions?.map((data) => {
                                    return (
                                        <MovieCard key={data.id} {...data} onPress={() => navigation.navigate('detail-content', data)} />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>
                <View style={[styles.posterListView, { marginTop: -25 }]}>
                    <Text style={styles.textTitle}>{moviesFantasy.length > 0 ? "Fantasia" : ""}</Text>
                    <View style={styles.listContentConteiner}>
                        <ScrollView horizontal>
                            {
                                moviesFantasy?.map((data) => {
                                    return (
                                        <MovieCard key={data.id} {...data} onPress={() => navigation.navigate('detail-content', data)} />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>
                <View style={[styles.posterListView, { marginTop: -25 }]}>
                    <Text style={styles.textTitle}>{moviesHorror.length > 0 ? "Terror" : ""}</Text>
                    <View style={styles.listContentConteiner}>
                        <ScrollView horizontal>
                            {
                                moviesHorror?.map((data) => {
                                    return (
                                        <MovieCard key={data.id} {...data} onPress={() => navigation.navigate('detail-content', data)} />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>
                <View style={[styles.posterListView, { marginTop: -25 }]}>
                    <Text style={styles.textTitle}>{moviesComedia.length > 0 ? "Comédia" : ""}</Text>
                    <View style={styles.listContentConteiner}>
                        <ScrollView horizontal>
                            {
                                moviesComedia?.map((data) => {
                                    return (
                                        <MovieCard key={data.id} {...data} onPress={() => navigation.navigate('detail-content', data)} />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default HomeScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.bgcolor,
        alignItems: 'center'
    },
    topBarMenu: {
        position: 'absolute',
        top: 5,
        width: Dimensions.get('screen').width,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 30,
        zIndex: 25
    },
    menuText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700'
    },
    movieMainContainer: {
        position: 'relative',
        height: Dimensions.get('screen').height * .5,
        width: Dimensions.get('screen').width,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 10
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: Dimensions.get('screen').height * .5,
    },
    actionMain: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        gap: 10
    },
    btnMainPlay: {
        width: 200,
        backgroundColor: Theme.text,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10
    },
    btnMainInfos: {
        padding: 10,
        borderWidth: 1,
        borderColor: Theme.text,
        borderRadius: 5
    },
    btnMainPlayText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center'
    },
    MainMovieTitle: {
        fontSize: 28,
        color: Theme.text,
        fontWeight: '700',
        maxWidth: Dimensions.get('screen').width * .75
    },
    MainMovieoverview: {
        fontSize: 13,
        color: Theme.gray[100],
        fontWeight: '700',
        maxWidth: Dimensions.get('screen').width * .75
    },
    logo: {
        height: 80,
        width: 80,
        top: 15,
        left: 15,
        position: 'absolute'
    },
    textTitleCard: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
        maxWidth: 150,
        marginTop: 5
    },
    containerCardItem: {
        marginHorizontal: 5,
        width: 150,
        height: 200,
        overflow: 'hidden'
    },
    textTitle: {
        fontSize: 18,
        color: '#fff',
        marginTop: 25,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    posterListView: {
        width: '100%',
        flex: 1,
        padding: 10
    },
    listContentConteiner: {
        flex: 1,
        zIndex: 10,
        padding: 10,
        marginTop: 10
    },
    relevantInformation: {
        flexDirection: 'row',
        gap: 10,
        marginVertical: 15
    },
    relevantInformationText: {
        fontSize: 14,
        fontWeight: "600"
    },
})