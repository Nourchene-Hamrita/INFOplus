import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Dimensions, SafeAreaView, Alert } from 'react-native';
import { COLORS, FONTS, icons } from '../constants';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import { AuthContext } from '../context/AuthContext';
import { Picker } from '@react-native-picker/picker';
import KeyboardAvoiding from '../components/KeyboardAvoiding';
import axios from 'axios';
import { BASE_URL } from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';

const Rate = ({ navigation }) => {
    const maxRating = [1, 2, 3, 4, 5];
    const [defaultRating, setDefaultRating] = useState(1);
    const [comment, setComment] = useState('');

    const { userInfo } = useContext(AuthContext);


    const [formations, setFormations] = useState([]); // State variable to store formations
    const [selectedFormation, setSelectedFormation] = useState(null); // State variable to store selected formation
    const pickerRef = useRef();



    const onRateButtonPress = (rating) => {
        setDefaultRating(rating);
    };
    function open() {
        pickerRef.current.focus();
    }

    function close() {
        pickerRef.current.blur();
    }


    useEffect(() => {
        // Check if userInfo.details and userInfo.details.formations exist
        if (userInfo && userInfo.details && userInfo.details.formations) {
            // Make sure userInfo.details.formations is an array
            if (Array.isArray(userInfo.details.formations)) {
                setFormations(userInfo.details.formations);
                console.log(userInfo.details.formations); // Check the fetched formations in the console
                setSelectedFormation(userInfo.details.formations[0]?._id); // Set the default selected formation
            } else {
                console.log('Formations data is not an array:', userInfo.details.formations);
            }
        } else {
            console.log('Formations data is missing in userInfo:', userInfo);
        }
    }, [userInfo]);






    const handleReviewSubmit = async () => {
        try {
            const reviewData = {
                rating: defaultRating,
                comment: comment,
            };

            // Retrieve the token using AsyncStorage
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.post(
                `${BASE_URL}/formations/${selectedFormation}/reviews`,
                reviewData,
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                // Review added successfully
                // You can show a success message to the user or navigate back to the previous screen
                Alert.alert('Success', 'Votre avis est envoyé avec succès.');
                navigation.goBack();
            } else {
                // Handle other response status codes if needed
                Alert.alert('Error', "L'ajout d'un commentaire a échoué. Veuillez réessayer.");
            }
        } catch (error) {
            // Check if the error response contains a message
            if (error.response && error.response.data && error.response.data.message) {
                // Display the error message from the server response
                Alert.alert('Error', 'Cette formation a déjà été évaluée.');
            } else {
                console.log('Error adding review:', error);
                Alert.alert('Error', "L'ajout d'un commentaire a échoué. Veuillez réessayer.");
            }
        }
    };




    const screenWidth = Dimensions.get('window').width;
    const buttonWidth = screenWidth * 0.8;
    const comboBoxWidth = buttonWidth * 0.8;
    return (
        <KeyboardAvoiding>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack('Home')}>
                        <Entypo
                            name="chevron-left"
                            style={{
                                fontSize: 18,
                                color: COLORS.primary,
                                padding: 12,
                                backgroundColor: 'transparent',
                                borderRadius: 10,
                            }}
                        />
                    </TouchableOpacity>
                    <Text style={{
                        color: COLORS.primary, fontSize: 18,
                        fontWeight: '600', marginTop: 7
                    }}>FeedBack</Text>
                </View>
                <Animatable.View style={styles.centeredTextContainer} animation="flipInX">
                    <Text style={{ ...FONTS.h1, color: COLORS.primary }}>
                        Évaluez Votre Expérience
                    </Text>

                </Animatable.View>
                <Animatable.View style={styles.content} animation="slideInUp">
                    <Text style={{ ...FONTS.h4, color: COLORS.gray }}>
                        Êtes-vous satisfait(e) ?{" "}
                    </Text>
                    <Text style={{ ...FONTS.h2, color: COLORS.gray, marginTop: 20 }}>
                        Choisissez une formation
                    </Text>
                    <View>
                        {/* ComboBox to display formations */}
                        <View style={[styles.comboBoxContainer, { width: comboBoxWidth }]}>
                            <Picker
                                ref={pickerRef}
                                selectedValue={selectedFormation}
                                onValueChange={(itemValue, itemIndex) => setSelectedFormation(itemValue)}
                                style={[styles.pickerStyle, { height: 50 }]}
                            >
                                {formations.map((formation) => (
                                    <Picker.Item key={formation._id} label={formation.nom} value={formation._id} />
                                ))}
                            </Picker>
                        </View>

                    </View>


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
                        <TouchableOpacity style={[styles.submit, { width: buttonWidth }]} onPress={handleReviewSubmit}>
                            <LinearGradient colors={['#345fb4', '#89cff0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.signIn}>
                                <Text style={[styles.textSubmit, { color: '#fff' }]}>Envoyer</Text>
                                <Image
                                    source={icons.send}
                                    style={{
                                        width: 20,
                                        height: 20,
                                        tintColor: COLORS.white,
                                        marginLeft: 7
                                    }}
                                />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </SafeAreaView>
        </KeyboardAvoiding>
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
    centeredTextContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20, // Adjust this value to set the vertical spacing from the header
        marginBottom: 20, // Adjust this value to set the vertical spacing from the ComboBox
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40
    },
    ratingContainer: {
        flexDirection: 'row',
    },
    star: {
        fontSize: 35,
        color: '#FF8C00',
        paddingHorizontal: 5,
    },

    comboBoxContainer: {
        height: 50, // Set a height that fits the ComboBox
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
    },

    pickerStyle: {
        width: '100%', // Set the same width as the ComboBox container
        color: COLORS.primary,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: -12
    },

    button: {
        alignItems: 'center',
        marginTop: 35,
        borderRadius: 40,
        width: '100%', // Set the button container to the full width
        paddingHorizontal: 40, // Adjust the horizontal padding to center the button
    },

    submit: {
        width: '100%', // Set the button width to 100% to match the button container
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
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
        flexDirection: 'row',
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
