import axios from "axios"

export const API_KEY = '8a4b9681bd3b80e72152660190d14a36'

const apiTmdb = axios.create({
    baseURL: 'https://api.themoviedb.org/3/'
})

export default apiTmdb;