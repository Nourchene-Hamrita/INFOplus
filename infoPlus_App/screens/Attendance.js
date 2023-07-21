import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-animatable';
import { COLORS } from '../constants';

const Attendance = () => {
    return (
        <View>
            <Text style={{ color: COLORS.primary }}>Attendance</Text>
        </View>
    );
}

const styles = StyleSheet.create({})

export default Attendance;
