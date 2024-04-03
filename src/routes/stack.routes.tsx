import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home';
import TabRoutes from './tab.routes';
import UploadFilmScreen from '../screens/post/upload.film';
import ContentDetailScreen from '../screens/detail';
import ContentPlay from '../screens/play';
import SearchScreen from '../screens/search';
import GenryScreen from '../screens/genry';

const Stack = createStackNavigator();

export default function StackRouter() {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            gestureEnabled: true,
            gestureResponseDistance: 200,
            gestureDirection: 'horizontal'

        }}>
            <Stack.Screen name="router-tabs" component={TabRoutes} />
            <Stack.Screen
                name="upload-film"
                component={UploadFilmScreen}
                options={{
                    presentation: 'modal'
                }}
            />
            <Stack.Screen
                name="detail-content"
                component={ContentDetailScreen}
                options={{
                    gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="play-content"
                component={ContentPlay}
                options={{
                    gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="search"
                component={SearchScreen}
                options={{
                    gestureEnabled: false
                }}
            />
            <Stack.Screen
                name="genry"
                component={GenryScreen}
                options={{
                    gestureEnabled: false
                }}
            />
        </Stack.Navigator>
    );
}