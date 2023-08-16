import React, { useEffect, useRef, useContext, useState } from 'react'
import { Dimensions, TextInput, StyleSheet, Text, Alert, ToastAndroid, ActivityIndicator, Image, TouchableOpacity, View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { Animations } from '../../constants/Animations'
import Entypo from 'react-native-vector-icons/Entypo';
import { COLORS, SIZES, FONTS, icons, images } from "../../constants";
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';



export default function AddAnnouncement({ route, navigation }) {
    const { userInfo } = useContext(AuthContext);
    const [title, setTitle] = useState(''); // New state for title
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null); // State variable to store selected formation




    const pickerRef = useRef();
    const viewRef = useRef(null);
    const animation = Animations[Math.floor(Math.random() * Animations.length)]
    console.log(animation);



    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            viewRef.current.animate({ 0: { opacity: 0.5, }, 1: { opacity: 1 } });
        })
        // ToastAndroid.show(animation+ ' Animation', ToastAndroid.SHORT);
        return () => unsubscribe;
    }, [navigation]);

    const handleAnnouncementSubmit = async (formationId, className) => {
        const token = await AsyncStorage.getItem('userToken');
        try {
            // Check if the title or content is empty
            if (title.trim() === '' || content.trim() === '') {
                Alert.alert('Error', 'Please fill in all fields before submitting.');
                return;
            }

            // Make the API call
            const response = await axios.post(
                `${BASE_URL}/formations/${formationId}/classes/${className}/announcements`,
                {
                    title: title,
                    content: content,
                    teacher:userInfo.details._id
                },
                {
                    headers: {
                        authorization: `Bearer ${token}`,
                    },
                }
            );

            // Handle the API response here, if needed
            console.log('Response:', response.data);

            // Show a success message to the user
            Alert.alert('Succès', 'Votre annonce a été créée avec succès.');

            // Optionally, you can navigate the user to a different screen or perform any other actions here
            navigation.goBack(); // Navigates back to the previous screen
        } catch (error) {
            console.log('Error creating announcement:', error);
            // Handle the error here, if needed
            Alert.alert('Error', "La création de l'annonce a échoué. Veuillez réessayer.");
        }
    };



    const screenWidth = Dimensions.get('window').width;
    const buttonWidth = screenWidth * 0.8;
    const comboBoxWidth = screenWidth * 0.8;
    return (
        <View style={[styles.container]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack('Home')}>
                    <Entypo
                        name="chevron-left"
                        style={{
                            fontSize: 18,
                            color: COLORS.white,
                            padding: 12,
                            backgroundColor: 'transparent',
                            borderRadius: 10,
                        }}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center', marginRight: 20 }}>
                    <Text style={styles.headerText}>Ajouter Annonce</Text>
                </View>

            </View>
            <Animatable.View style={{
                flex: 1,
                backgroundColor: '#fff',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingVertical: 40,
                paddingHorizontal: 5,
            }} animation="fadeInUpBig">


                <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                    {/* ComboBox to display formations */}

                    <View style={[styles.comboBoxContainer, { width: comboBoxWidth }]}>
                        <Picker
                            key={selectedClass ? selectedClass.classId : 'default'}
                            ref={pickerRef}
                            selectedValue={selectedClass ? selectedClass.classId : null}
                            onValueChange={(itemValue, itemIndex) => {
                                console.log('Selected Class:', itemValue);
                                const selectedClassInfo = userInfo.details.assignedClasses.find(classe => classe.classId === itemValue);
                                setSelectedClass(selectedClassInfo);
                            }}
                            style={[styles.pickerStyle, { height: 50 }]}
                        >
                            <Picker.Item label="Choisissez une Classe" value={null} />
                            {userInfo.details.assignedClasses.map((classe) => (
                                <Picker.Item key={classe.classId} label={classe.className} value={classe.classId} />
                            ))}
                        </Picker>
                    </View>

                </View>

                <Animatable.View
                    ref={viewRef}
                    easing={'ease-in-out'}
                    duration={500}>
                    <View style={styles.content}>

                        <View style={styles.subjectBox}>
                            <TextInput
                                placeholder="Titre"
                                placeholderTextColor={COLORS.primary}
                                style={{ color: 'black' }}
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>
                        <View style={styles.commentBox}>
                            <TextInput
                                placeholder="Écrire Votre Annonce..."
                                placeholderTextColor={COLORS.primary}
                                style={{ color: 'black' }}
                                value={content}
                                onChangeText={setContent}
                                multiline
                            />
                        </View>
                        <View style={styles.button}>
                            <TouchableOpacity style={[styles.submit, { width: buttonWidth }]} onPress={() => handleAnnouncementSubmit(selectedClass.formationId, selectedClass.className)}>

                                <LinearGradient colors={['#345fb4', '#89cff0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.signIn}>
                                    <Text style={[styles.textSubmit, { color: '#fff' }]}>Ajouter</Text>
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

                    </View>
                </Animatable.View>
            </Animatable.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary
    },
    item: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    header: {
        height: 70,
        width: '100%',
        alignItems: 'center', // Align header contents to the center
        paddingHorizontal: 10,
        flexDirection: 'row', // Display the icon and text in a row
        paddingTop: 20,

    },
    headerText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 7, // Add some spacing between the icon and the text
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
    content: {

        justifyContent: 'center',
        alignItems: 'center',
        margin: 40
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
        borderColor: COLORS.primary,
    },
    commentBox: {
        borderColor: 'grey',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        width: '80%',
        minHeight: 100,
        marginBottom: 10,
        borderColor: COLORS.primary,
    },
    imageContainer: {
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        marginBottom: 40,
        marginTop: 30,
    },
    image: {
        width: '90%',
        height: '100%',
        borderRadius: 20

    },


});
