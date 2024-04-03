import { ActivityIndicator, Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native"
import { Theme } from "../../../theme"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import apiTmdb, { API_KEY } from "../../services/tmdb/api"
import { useState } from "react"
import Details from "./Detail"

const UploadFilmScreen = () => {

    const [movie, setMovie] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState<any[]>([]);

    const [search, setSearch] = useState("");

    const HandleSeachFilm = async () => {
        setLoading(true)
        try {
            const response = await apiTmdb.get(`search/movie?api_key=${API_KEY}&query=${search}&language=pt-BR&page=1&sort_by=popularity.desc`)
            if (response?.data) {
                setMovies(response?.data?.results)
            }
        } catch (err) {
            console.log(JSON.stringify(err))
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            
            <TextInput
                value={search}
                onChangeText={val => setSearch(val)}
                placeholderTextColor={Theme.gray[400]}
                style={styles.inputText}
                selectionColor={Theme.primary}
                placeholder='NOME DO FILME'
            />
            <TouchableOpacity
                disabled={loading}
                onPress={HandleSeachFilm} style={[styles.btnFilm, { backgroundColor: loading ? Theme.gray[600] : Theme.primary }]}>
                {loading ? <ActivityIndicator /> : <Text style={styles.btnFilmText}>Procurar filme</Text>}
            </TouchableOpacity>
            <View style={styles.posterListView}>
                <Text style={styles.textTitle}>{movies?.length > 0 ? "Resultados" : ""}</Text>
                <FlatList
                    numColumns={2}                  // set number of columns 
                    columnWrapperStyle={styles.row}  // space them out evenly
                    data={movies ?? []}
                    keyExtractor={item => item?.id}
                    renderItem={({ item }) => {
                        const { url, id, poster_path, title, overview, backdrop_path } = item;
                        const backdropURL = `https://image.tmdb.org/t/p/w780${backdrop_path}`;
                        const posterURL = `https://image.tmdb.org/t/p/w500${poster_path}`;
                        return (
                            <TouchableOpacity key={id} onPress={() => setMovie(item)} style={{ marginVertical: 5 }}>
                                <View style={styles.containerCardItem}>
                                    <Image source={{ uri: posterURL }} style={{ width: 150, height: 200, borderRadius: 10 }} />
                                </View>
                                <Text numberOfLines={2} style={styles.textTitleCard}>{title}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
            <Details
                open={!!movie}
                content={movie}
                handleClose={() => setMovie(null)}
            />
        </SafeAreaView>

    )
}

export default UploadFilmScreen


const styles = StyleSheet.create({
    row: {
        flex: 1,
        justifyContent: "space-around"
    },
    container: {
        flex: 1,
        height: Dimensions.get('screen').height,
        backgroundColor: Theme.bgcolor,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
    },
    inputText: {
        padding: 15,
        minWidth: 300,
        marginTop: 45,
        width: "100%",
        borderRadius: 5,
        backgroundColor: Theme.gray[600],
        color: 'white'
    },
    btnFilmText: {
        color: 'white',
        textAlign: 'center'
    },
    btnFilm: {
        padding: 15,
        minWidth: 300,
        marginTop: 15,
        width: "100%",
        borderRadius: 5,
        backgroundColor: Theme.primary,
        color: 'white'
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
        marginVertical: 25,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    posterListView: {
        width: '100%',
        flex: 1,
        padding: 10
    },
    textTitleCard: {
        fontSize: 15,
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
        maxWidth: 150,
        marginTop: 5
    }
})