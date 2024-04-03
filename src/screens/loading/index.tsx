import { Dimensions, Image, StyleSheet, View } from "react-native"
import { Theme } from "../../../theme";

const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <Image
                style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').height }}
                resizeMode="stretch"
                source={require('../../assets/images/splash.png')}
            />
        </View>
    )
}

export default LoadingScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.bgcolor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        height: 80,
        width: 80
    }
})