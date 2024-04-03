import { Dimensions, FlatList, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Theme } from "../../../theme"
import Button from "../../components/button"
import { useEffect, useState } from "react"
import { useNavigation, useRoute } from "@react-navigation/native"
import { MovieTypes } from "../../types/movie"
import { LinkIMGSTDBM } from "../../utils"
import { LinearGradient } from "expo-linear-gradient"
import LottieView from "lottie-react-native"
import Genre from "../../services/tmdb/genre.json"
import MovieCard from "../../components/moviecard"
import { collection, getDocs, query, where } from "firebase/firestore"
import { dbFirestor } from "../../services/firebase"
import UpdateMovie from "./update"

const ContentDetailScreen = ({ navigation }: any) => {
    const { params } = useRoute();
    const { navigate } = useNavigation();

    const [Content, setContent] = useState<MovieTypes | null>(null);
    const [SimilarTitles, setSimilarTitles] = useState<MovieTypes[] | null>(null);

    const [IsUpdateMovie, setIsUpdateMovie] = useState<MovieTypes | null>(null);


    useEffect(() => {
        if (params) {
            setContent(params as MovieTypes)
        }
    }, [params])


    const getPopularityFilmesFantasy = async () => {
        if (Content) {
            try {
                const collectionRef = query(
                    collection(dbFirestor, "catalog"),
                    where("genre_ids", "array-contains", Content.genre_ids[0]),
                    where("title", "!=", Content.title),
                )
                const data = await getDocs(collectionRef)
                let moviesAdd: any = []
                data.forEach((doc) => {
                    moviesAdd.push(doc.data())
                })
                setSimilarTitles(moviesAdd)
            }
            catch (err) {
                console.log(err);
            }
        }
    }

    useEffect(() => {
        if (Content) {
            getPopularityFilmesFantasy();
        }
    }, [Content])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Theme.bgcolor }}>
            <ScrollView style={{ flex: 1 }}>
                <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate("play-content", Content)}>
                    <ImageBackground
                        style={styles.imgPoster}
                        resizeMode="cover"
                        source={{
                            uri: LinkIMGSTDBM[780] + Content?.backdrop_path
                        }}>
                        <LottieView
                            autoPlay
                            loop
                            style={styles.playAnimation}
                            source={require('../../assets/animations/play.json')}
                        />
                        <LinearGradient
                            colors={['transparent', Theme.bgcolor]}
                            style={styles.background}
                        />
                    </ImageBackground>
                </TouchableOpacity>
                <View style={styles.infoContent}>
                    <Text style={styles.title}>{Content?.title}</Text>
                    <View style={styles.relevantInformation}>
                        {Content?.genre_ids?.map((id) => {
                            return (
                                <Text key={id} style={[styles.relevantInformationText, { color: Theme.success }]}>
                                    {Genre.genres.find(a => a.id === id)?.name}
                                </Text>
                            )
                        })}
                        <Text style={[styles.relevantInformationText, { color: Theme.gray[100] }]}>
                            {new Date(Content?.release_date as string).toLocaleDateString()}
                        </Text>
                    </View>
                    {Content?.distributed && <Text style={[styles.relevantInformationText, { color: Theme.gray[100] }]}>
                        {Content?.distributed}
                    </Text>}
                    <Text style={[styles.relevantInformationText, { color: Theme.gray[100] }]}>
                        {Content?.overview}
                    </Text>
                    <TouchableOpacity style={styles.btnFilm} onPress={() => setIsUpdateMovie(Content)}>
                        <Text style={{ textAlign: 'center', color: Theme.text }}> EDITAR LINK</Text>
                    </TouchableOpacity>
                    <Text style={styles.similarText}>
                        {(SimilarTitles && SimilarTitles?.length > 0) ? "Títulos Semelhantes" : ""}
                    </Text>
                    <View style={styles.listContentConteiner}>
                        <FlatList
                            horizontal
                            data={SimilarTitles}
                            renderItem={({ item }) => (
                                <MovieCard key={item.id} {...item} onPress={() => navigation.navigate('detail-content', item)} />
                            )}
                        />
                    </View>
                </View>
            </ScrollView>
            <UpdateMovie
                content={IsUpdateMovie}
                handleClose={() => setIsUpdateMovie(null)}
                open={!!IsUpdateMovie}
            />
        </SafeAreaView>
    )
}

export default ContentDetailScreen;

const styles = StyleSheet.create({
    containerPlay: {
        height: Dimensions.get('screen').height * .4,
        width: "100%"
    },
    imgPoster: {
        width: "100%",
        height: Dimensions.get('screen').height * .4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    playAnimation: {
        width: 300,
        height: 300,
        zIndex: 10
    },
    title: {
        color: Theme.text,
        fontSize: 32,
        fontWeight: 'bold'
    },
    infoContent: {
        padding: 10,
        gap: 10
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: Dimensions.get('screen').height * .3,
    },
    relevantInformation: {
        flexDirection: 'row',
        gap: 10
    },
    relevantInformationText: {
        fontSize: 14,
        fontWeight: "600"
    },
    similarText: {
        fontSize: 20,
        color: Theme.text,
        marginTop: 10,
        fontWeight: '500'
    },
    listContentConteiner: {
        flex: 1,
        zIndex: 10,
        padding: 10,
        marginTop: 10
    },
    btnFilm: {
        padding: 15,
        minWidth: 300,
        marginTop: 15,
        width: "100%",
        borderRadius: 5,
        backgroundColor: Theme.primary,
        color: 'white'
    }
})