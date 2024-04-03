import { ActivityIndicator, Dimensions, FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native"
import { Theme } from "../../../theme"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import apiTmdb, { API_KEY } from "../../services/tmdb/api"
import { useEffect, useState } from "react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { dbFirestor } from "../../services/firebase"
import GenresJSON from "../../services/tmdb/genre.json"
import SelectDropdown from "react-native-select-dropdown"
import LottieView from "lottie-react-native"
const GenryScreen = ({ navigation }: any) => {

    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState<any[]>([]);

    const [genrySearch, setGenrySearch] = useState<{
        id: number,
        name: string
    } | null>({
        id: 28,
        name: "Ação"
    });


    const HandleSeachFilm = async () => {
        setLoading(true)
        try {
            const collectionRef = query(collection(dbFirestor, "catalog"), where("genre_ids", "array-contains", genrySearch?.id))
            const data = await getDocs(collectionRef)
            let moviesAdd: any = []
            data.forEach((doc) => {
                moviesAdd.push(doc.data())
            })
            setMovies(moviesAdd)
        } catch (err) {
            console.log(JSON.stringify(err))
        }
        finally {
            setLoading(false)
        }
    }
    

    useEffect(() => {
        HandleSeachFilm();
    }, [genrySearch])
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ marginTop: 25 }}></View>
            <SelectDropdown
            disableAutoScroll
                data={GenresJSON.genres}
                onSelect={(selectedItem, index) => {
                    setGenrySearch(selectedItem);
                }}
                renderButton={(selectedItem, isOpened) => {
                    return (
                        <View style={styles.dropdownButtonStyle}>
                            <Text style={styles.dropdownButtonTxtStyle}>
                                {(selectedItem && selectedItem.name) ? selectedItem.name : 'Selecionar genero'}
                            </Text>
                        </View>
                    );
                }}
                renderItem={(item, index, isSelected) => {
                    return (
                        <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                            <Text style={styles.dropdownItemTxtStyle}>{item.name}</Text>
                        </View>
                    );
                }}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropdownMenuStyle}
            >

            </SelectDropdown>
            {
             loading &&   <View style={styles.overlay}>
             <View style={styles.loadingContainer}>
               <LottieView
                 loop={true}
                 autoPlay
                 style={styles.playAnimation}
                 source={require('../../assets/animations/loading.json')}
               />
             </View>
           </View>
            }
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
                            <TouchableOpacity key={id} onPress={() => navigation.navigate('detail-content', item)} style={{ marginVertical: 5 }}>
                                <View style={styles.containerCardItem}>
                                    <Image source={{ uri: posterURL }} style={{ width: 150, height: 200, borderRadius: 10 }} />
                                </View>
                                <Text numberOfLines={2} style={styles.textTitleCard}>{title}</Text>
                            </TouchableOpacity>
                        )
                    }}
                />
            </View>
        </SafeAreaView>

    )
}

export default GenryScreen


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
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 8,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: Theme.text,
    },
    dropdownButtonStyle: {
        width: 300,
        height: 50,
        backgroundColor: Theme.gray[600],
        borderRadius: 2,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    overlay: {
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        gap: 40,
        zIndex: 100,
        height: Dimensions.get('screen').height,
        width: Dimensions.get('screen').width,
        backgroundColor: '#00000090',
      },
      playAnimation: {
        width: 200,
        height: 200,
        zIndex: 10
      },
      loadingContainer: {
        padding: 8,
        borderRadius: 75,
        backgroundColor: '#00000050',
        zIndex: 60
      },
})