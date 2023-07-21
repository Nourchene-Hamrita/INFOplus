import React from 'react';
import { View, Text, StyleSheet,
    StatusBar, Image, TouchableOpacity, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

const Welcome = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
            <StatusBar backgroundColor='#345fb4' barStyle="light-content"/>
                <Animatable.Image
                    animation="bounceIn"
                    duration={1500}
                    style={styles.logo}
                    resizeMode="stretch" source={require('../assets/images/logo.png')} />


            </View>
            <Animatable.View animation="fadeInUpBig" style={styles.footer}>
                <Text style={styles.title}>
                    INFO
                    <Text style={[styles.redText, { marginRight: 0 }]}>plus</Text>
                </Text>
                <Text style={styles.text}>La formation faite pour vous</Text>
                <View style={styles.button}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <LinearGradient style={styles.signIn} colors={['#345fb4', '#89cff0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                            <Text style={styles.textSign}>Commencer</Text>
                            <MaterialIcons name='navigate-next' color='#fff' size={20} />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>

        </View>
    );
}
const { height } = Dimensions.get("screen");
const height_logo = height * 0.5;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#345fb4',
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30,
    },
    logo: {
        width: height_logo,
        height: height_logo,
    },
    title: {
        color: '#05375a',
        fontSize: 40,
        fontWeight: 'bold',
    },
    text: {
        color: 'grey',
        marginTop: 5,
    },
    redText: {
        color: '#E32845',

    },
    button: {
        alignItems: 'flex-end',
        marginTop: 30,
    },
    signIn: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row',
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default Welcome;



