import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackRouter from './stack.routes';
import LoginScreen from '../screens/auth/login';
import { createStackNavigator } from '@react-navigation/stack';
import useAuth from '../contexts/auth';
import LoadingScreen from '../screens/loading';


export default function Routes() {
    const { isAuthenticated, loading } = useAuth();
    const Stack = createStackNavigator();

    if (loading) {
        return (
            <NavigationContainer>
                <Stack.Navigator screenOptions={{
                    headerShown: false
                }}>
                    <Stack.Screen name="loadingScreen" component={LoadingScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }

    if (isAuthenticated) {
        return (
            <NavigationContainer>
                <StackRouter />
            </NavigationContainer>
        );
    }



    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name="login" component={LoginScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );

}