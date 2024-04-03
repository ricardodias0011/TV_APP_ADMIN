import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/home';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from '../../theme';
import PostScreen from '../screens/post';

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
    return (
            <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveBackgroundColor: Theme.bgcolor }}>
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
                        title: 'Inicio',
                        tabBarActiveTintColor: Theme.text,
                        headerTintColor: Theme.gray[400],
                        tabBarInactiveBackgroundColor: Theme.bgcolor
                    }}
                />
                <Tab.Screen
                    name="Upload"
                    component={PostScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="movie-open-cog-outline" color={color} size={size} />,
                        title: 'Upload',
                        tabBarActiveTintColor: Theme.text,
                        headerTintColor: Theme.gray[400],
                        tabBarInactiveBackgroundColor: Theme.bgcolor
                    }}
                />
            </Tab.Navigator>
    );
}
