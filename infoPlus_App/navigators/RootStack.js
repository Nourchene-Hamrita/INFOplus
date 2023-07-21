import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { Colors } from '../components/styles';
import { AuthContext } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AppStack from './AppStack';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        border: "transparent",
    },
};

const Stack = createStackNavigator();



const RootStack = () => {
    const { isLoading, userToken } = useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'canter' }}>
                <ActivityIndicator size={'large'} />
            </View>

        )

    }


    return (
        <NavigationContainer>
            {userToken !== null ?
                <AppStack /> : (
                    <AuthStack />
                )}

        </NavigationContainer>
    );
}

const styles = StyleSheet.create({})

export default RootStack;
