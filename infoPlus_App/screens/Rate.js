import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { COLORS, FONTS } from '../constants';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';

const Rate = ({navigation}) => {
    const maxRating = [1, 2, 3, 4, 5];
    const [defaultRating, setDefaultRating] = useState(1);
    const [comment, setComment] = useState('');

    const onRateButtonPress = (rating) => {
        setDefaultRating(rating);
    };
    const screenWidth = Dimensions.get('window').width;
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack('Home')}>
                    <Entypo
                        name="chevron-left"
                        style={{
                            fontSize: 18,
                            color: COLORS.primary,
                            padding: 12,
                            backgroundColor:'transparent',
                            borderRadius: 10,
                        }}
                    />
                </TouchableOpacity>
                <Text style={{
                    color: COLORS.primary, fontSize: 18,
                    fontWeight: '600',marginTop:7
                }}>FeedBack</Text>
            </View>
            <View style={styles.content}>
                <Text style={{ ...FONTS.h1, color: COLORS.primary, marginBottom: 30 }}>Évaluez Votre Expérience</Text>
                <Text style={{ ...FONTS.h2, color: COLORS.gray }}>Êtes-vous satisfait(e) ? </Text>
                <View style={styles.ratingContainer}>
                    {maxRating.map((item, index) => (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            key={index}
                            onPress={() => onRateButtonPress(item)}
                        >
                            <Text style={styles.star}>
                                {item <= defaultRating ? '★' : '☆'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.textStyle}>
                    {/*To show the rating selected*/}
                    {defaultRating} / {Math.max.apply(null, maxRating)}
                </Text>

                <View style={styles.commentBox}>
                    <TextInput
                        placeholder="Dites-nous ce qui peut être amélioré ..."
                        placeholderTextColor={COLORS.gray}
                        style={{ color: 'black' }}
                        value={comment}
                        onChangeText={setComment}
                        multiline
                    />
                </View>
                <View style={styles.button}>
                    <TouchableOpacity style={[styles.submit, { width: screenWidth * 0.8 }]}>
                        <LinearGradient colors={['#345fb4', '#89cff0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.signIn}>
                            <Text style={[styles.textSubmit, { color: '#fff' }]}>Envoyer</Text>

                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        height: 50,
        width: '100%',
        alignItems: 'flex-start', // Align header contents to the left (start)
        paddingHorizontal: 10,
        flexDirection: 'row',
        paddingTop: 10,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
    },
    star: {
        fontSize: 35,
        color: '#FF8C00',
        paddingHorizontal: 5,
    },
    submit: {
        width: '80%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
        alignSelf: 'center',
    },
    button: {
        alignItems: 'center',
        marginTop: 35,
        borderRadius: 40,
    },
    textSubmit: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    textStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginVertical: 10,
    },
    commentBox: {
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        width: '80%',
        minHeight: 100,
        marginBottom: 10,

    },
});

export default Rate;
