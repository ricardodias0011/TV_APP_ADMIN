import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from "react-native"
import { Theme } from "../../../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import apiTmdb, { API_KEY } from "../../services/tmdb/api";

import { MaterialIcons } from '@expo/vector-icons';
import { StorageService } from "../../services/storage/auth";
import { dbFirestor } from "../../services/firebase";
import { collection, getDocs } from "firebase/firestore";

const PostScreen = ({ navigation }: any) => {

    const [sizeCatalogo, setSizeCatalogo] = useState(0);
    const [loadingRefresh, setLoadingRefresh] = useState(false);


    const getSizeCalog = async () => {
        setLoadingRefresh(true)
        try {
            const collectionRef = collection(dbFirestor, "catalog")
            const data = await getDocs(collectionRef)
            setSizeCatalogo(data.size)
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoadingRefresh(false)
        }
    }

    useEffect(() => {
        getSizeCalog();
    },[])

    return (
        <ScrollView
        refreshControl={<RefreshControl
            refreshing={loadingRefresh}
            onRefresh={getSizeCalog}
        />}
        style={{ flex: 1, backgroundColor: Theme.bgcolor }}>
        <SafeAreaView style={styles.container}>
                <Text style={styles.TotalText}>{sizeCatalogo > 0 ? `Total de conteúdo: ${sizeCatalogo}` : ""}</Text>
                <TouchableOpacity style={styles.viewBTN} onPress={() => navigation.navigate('upload-film')}>
                    <View style={styles.viewBTNItem}>
                        <MaterialIcons name="local-movies" size={45} color="white" />
                        <Text style={styles.textTitle}>Upload de filme</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewBTN}>
                    <View style={styles.viewBTNItem}>
                        <MaterialIcons name="local-movies" size={45} color="white" />
                        <Text style={styles.textTitle}>Upload de série</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.viewBTN}>
                    <View style={styles.viewBTNItem}>
                        <MaterialIcons name="local-movies" size={45} color="white" />
                        <Text style={styles.textTitle}>Upload de novela</Text>
                    </View>
                </TouchableOpacity>
        </SafeAreaView >
        </ScrollView>
    )
}

export default PostScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.bgcolor,
        alignItems: 'center',
        padding: 10
    },
    textTitle: {
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'left'
    },
    viewBTN: {
        backgroundColor: Theme.primary,
        padding: 10,
        width: '100%',
        marginTop: 25,
        borderRadius: 15,
        maxHeight: 100,
        flex: 1
    },
    viewBTNItem: {
        padding: 8,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 25
    },
    TotalText: {
        fontSize: 28,
        color: Theme.text,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: Dimensions.get('screen').height * .05
    },
})