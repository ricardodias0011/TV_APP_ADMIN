import { MovieTypes } from "../types/movie";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Theme } from "../../theme";

interface MovieCardProps extends MovieTypes {
    onPress: (a: MovieTypes) => void
}

const MovieCard = (props: MovieCardProps) => {
    const {  id, poster_path, title, onPress } = props;
    const posterURL = `https://image.tmdb.org/t/p/w500${poster_path}`;
    return (
        <TouchableOpacity key={id} onPress={() => onPress(props)}>
            <View style={styles.containerCardItem}>
                <Image source={{ uri: posterURL }} style={{ width: 150, height: 200, borderRadius: 10 }} />
            </View>
            <Text numberOfLines={2} style={styles.textTitleCard}>{title}</Text>
        </TouchableOpacity>
    )
}

export default MovieCard;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.bgcolor,
        alignItems: 'center'
    },
    logo: {
        height: 80,
        width: 80,
        marginTop: 15
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
    }
})