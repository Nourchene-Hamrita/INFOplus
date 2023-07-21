import React from 'react';
import {View, StyleSheet} from 'react-native';
import { Text } from 'react-native-animatable';
import { COLORS } from '../constants';

const Profile = () => {
    return (
        <View>
            <Text style={{color:COLORS.black,justifyContent:'center',alignItems:'center'}}>Profil</Text>
        </View>
    );
}

const styles = StyleSheet.create({})

export default Profile;
