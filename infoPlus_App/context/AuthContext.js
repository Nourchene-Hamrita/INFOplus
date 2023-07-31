import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/config';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);


    const loggedIn = async (login, password) => {
        setIsLoading(true);
        if (!login || !password) {
            Alert.alert('Mauvaise entrée !', "Le champ du nom d'utilisateur ou du mot de passe ne peut pas être vide.", [
                { text: 'Ok' }
            ]);

            console.log('Login or password is empty');
            // Display an error message or perform necessary handling for empty values
            setIsLoading(false);
            return;
        }
        try {
            const response = await axios.post(`${BASE_URL}/auth/login`, {
                login: login,
                password: password,
            });

            if (response.headers && response.headers['set-cookie']) {
                const tokenCookie = response.headers['set-cookie'][0];
                const token = extractTokenFromCookie(tokenCookie);
                if (token) {
                    const userInfo = response.data;
                    setUserInfo(userInfo);
                    setUserToken(token);
                    AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                    AsyncStorage.setItem('userToken', token);
                    console.log(userInfo);
                    console.log(token)
                } else {
                    console.log('Token not found in cookie:', tokenCookie);

                    // Handle the error condition where the token is not found in the cookie
                }
            } else {
                console.log('Invalid response headers:', response.headers);
                // Handle the error condition where the response headers are missing or don't contain the expected information
            }

        } catch (error) {

            console.log('Login error', error.message);
            // Handle the error condition where the request fails or an exception occurs
            if (error.response && error.response.data && error.response.data.message) {
                // Display the error message in an alert
                Alert.alert("Echec !", error.response.data.message);
            } else {
                // Display a generic error message
                Alert.alert('An error occurred during login.');
            }
        }
        setIsLoading(false);
    };

    // Function to extract the token from the cookie string
    const extractTokenFromCookie = (cookie) => {
        const tokenMatch = cookie.match(/access_token=([^;]+)/);
        return tokenMatch ? tokenMatch[1] : null;
    };
    const logout = () => {
        setIsLoading(true);
        setUserToken(null);
        AsyncStorage.removeItem('userInfo');
        AsyncStorage.removeItem('userToken');
        setIsLoading(false);

    };
    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userInfo = await AsyncStorage.getItem('userInfo');
            let userToken = await AsyncStorage.getItem('userToken');
            userInfo = JSON.parse(userInfo);
            if (userInfo) {

                setUserToken(userToken);
                setUserInfo(userInfo);
            }

            setIsLoading(false);
        } catch (error) {
            console.log(`isLogged in error ${error}`)

        }


    }
    useEffect(() => {
        isLoggedIn();
    }, []);

    return (

        <AuthContext.Provider value={{ loggedIn, logout, isLoading, userToken, userInfo }}>
            {children}
        </AuthContext.Provider>

    );
}