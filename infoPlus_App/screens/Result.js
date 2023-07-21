import React from 'react';
import {View, StyleSheet} from 'react-native';
import { Text } from 'react-native-animatable';
import { COLORS } from '../constants';

const Result = () => {
    return (
        <View>
            <Text style={{color:COLORS.black}}>Result</Text>
        </View>
    );
}

const styles = StyleSheet.create({})

export default Result;
