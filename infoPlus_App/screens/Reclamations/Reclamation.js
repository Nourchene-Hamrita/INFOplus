import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Dimensions, SafeAreaView, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import KeyboardAvoiding from '../../components/KeyboardAvoiding';
import { COLORS, SIZES, FONTS, icons, images } from "../../constants";
import * as Animatable from 'react-native-animatable';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { BASE_URL } from '../../utils/config';

const Reclamation = ({ navigation }) => {
    const [subject, setSubject] = useState(''); // New state for subject
    const [comment, setComment] = useState('');

    const screenWidth = Dimensions.get('window').width;
    const buttonWidth = screenWidth * 0.8;
    const { userInfo } = useContext(AuthContext);

    const handleReclamationSubmit = async () => {
        try {
            // Check if the subject or comment is empty
            if (subject.trim() === '' || comment.trim() === '') {
                Alert.alert('Error', 'Veuillez remplir tous les champs avant d\'envoyer.');
                return;
            }

            // Make the API call
            const response = await axios.post(

                `${BASE_URL}/reclamations/createReclamation`,
                {
                    description: comment, // Use the 'comment' as the 'description' for the reclamation
                    subject: subject, // Include the subject field with the provided value
                    intern: userInfo.details._id, // Add the intern field with the provided value

                }
            );

            // Handle the API response here, if needed
            console.log('Response:', response.data);

            // Show a success message to the user
            Alert.alert('Success', 'Votre réclamation a été envoyée avec succès.');

            // Optionally, you can navigate the user to a different screen or perform any other actions here
            navigation.goBack(); // Navigates back to the previous screen
        } catch (error) {
            console.log('Error submitting reclamation:', error);
            // Handle the error here, if needed
            Alert.alert('Error', 'Échec de l\'envoi de la réclamation. Veuillez réessayer.');
        }
    };

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
                    }}>Réclamations</Text>
                </View>
                {/* Properly display the image */}
                <View style={styles.imageContainer}>

                    <Animatable.Image
                        animation="bounceIn"
                        duration={1500}
                        source={images.reclamation}
                        resizeMode="cover"
                        style={styles.image}
                    />
                </View>

                <Animatable.View style={styles.content} animation="fadeInUpBig">
                    <View style={styles.subjectBox}>
                        <TextInput
                            placeholder="Sujet de la réclamation"
                            placeholderTextColor={COLORS.gray}
                            style={{ color: 'black' }}
                            value={subject}
                            onChangeText={setSubject}
                        />
                    </View>
                    <View style={styles.commentBox}>
                        <TextInput
                            placeholder="Écrire Votre Demande..."
                            placeholderTextColor={COLORS.gray}
                            style={{ color: 'black' }}
                            value={comment}
                            onChangeText={setComment}
                            multiline
                        />
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity style={[styles.submit, { width: buttonWidth }]} onPress={handleReclamationSubmit}>
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
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
    },
    textStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginVertical: 10,
    },
    subjectBox: {
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
        padding: 3,
        width: '80%',
        marginBottom: 10,
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
    imageContainer: {
        height: 180,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginBottom: 50,
        marginTop: 30,
    },
    image: {
        width: '100%',
        height: '150%',
        borderRadius: 20

    },
});

export default Reclamation;

