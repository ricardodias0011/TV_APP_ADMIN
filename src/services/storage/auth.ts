import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Updates from 'expo-updates';

const storageAuth = "@ZPADM_TOKEN"

export class StorageService {
    static async getToken(){
        const user = await AsyncStorage.getItem(storageAuth);
        const userParse = user ? JSON.parse(user) : null 
        console.log(userParse)
        if(userParse){
            return userParse
        }
        return null
    }

    static async saveToken(data: any){
        if(!data){
            return
        }
        await AsyncStorage.setItem(storageAuth, JSON.stringify(data));
    }

    static async getUser(){
        const user = await AsyncStorage.getItem(storageAuth);
        const token = user ? JSON.parse(user) : null
        if(token){
            return token
        }
        return null
    } 

    static async logout(){
        await AsyncStorage.removeItem(storageAuth);
        Updates.reloadAsync()
    }
} 