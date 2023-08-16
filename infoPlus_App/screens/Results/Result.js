import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-animatable';
import CircularProgress from 'react-native-circular-progress-indicator';
import { COLORS, FONTS, SIZES } from '../../constants';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { BASE_URL } from '../../utils/config';
import { AuthContext } from '../../context/AuthContext';
import { ActivityIndicator } from 'react-native-paper';
import { convertDate } from '../../utils/date';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';



const Result = ({ navigation }) => {
    const { userInfo } = useContext(AuthContext);
    const [value, setValue] = useState(0);
    const [resultSummary, setResultSummary] = useState({});
    const [formations, setFormations] = useState([]);
    const [selectedFormation, setSelectedFormation] = useState(null); // State variable to store selected formation
    const pickerRef = useRef();
    const [resultRecords, setResultRecords] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Function to fetch intern's formations
    const fetchInternFormations = async () => {
        try {
            if (userInfo && userInfo.details && userInfo.details.formations) {
                if (Array.isArray(userInfo.details.formations)) {
                    setFormations(userInfo.details.formations);
                    setSelectedFormation(userInfo.details.formations[0]?._id);
                } else {
                    console.log('Formations data is not an array:', userInfo.details.formations);
                }
            } else {
                console.log('Formations data is missing in userInfo:', userInfo);
            }
        } catch (error) {
            console.log('Error fetching intern formations:', error);
        }
    };

    useEffect(() => {
        fetchInternFormations();
    }, []);

    const fetchResultSummary = async () => {
        try {
            const response = await fetch(`${BASE_URL}/results/getResultReport/${userInfo.details._id}/${selectedFormation}`);
            if (!response.ok) {
                throw new Error('Failed to fetch result summary');
            }
            const data = await response.json();
            const successRate = parseFloat(data.successRate);
            setValue(successRate);
            setResultSummary({ ...data, successRate });

        } catch (error) {
            console.log('Error fetching result summary:', error);
            // setError('Failed to fetch result summary');
        }
    };

    const fetchResultRecords = async () => {
        try {
            const response = await fetch(`${BASE_URL}/results/getResultIntern/${userInfo.details._id}/${selectedFormation}`);
            if (!response.ok) {
                throw new Error('Failed to fetch Result records');
            }
            const data = await response.json();
            setResultRecords(data);
        } catch (error) {
            console.log('Error fetching result records:', error);
            // setError('Failed to fetch result records');
        }
    };
    // Function to fetch teacher's results
    const fetchTeacherResults = async () => {
        try {
            const response = await fetch(`${BASE_URL}/results/teacher/${userInfo.details._id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch teacher results');
            }

            const data = await response.json();
            setResultRecords(data);
            console.log("****Teacher Result**** ", data)
        } catch (error) {
            console.log('Error fetching teacher results:', error);
            // Handle the error
        }
    };

    useEffect(() => {
        if (selectedFormation) {
            setLoading(true); // Reset loading state
            setError(''); // Reset error state

            Promise.all([
                fetchResultSummary(),
                fetchResultRecords()
            ]).finally(() => setLoading(false));
        }
        // Reset value if resultSummary is not available
        if (!resultSummary.successRate) {
            setValue(0);
        }
        // Fetch data based on user role
        if (userInfo.role === 'teacher') {
            fetchTeacherResults();
        }
    }, [selectedFormation, setValue, userInfo.role]);


    const screenWidth = Dimensions.get('window').width;
    const buttonWidth = screenWidth * 0.8;
    const comboBoxWidth = buttonWidth * 0.8;


    const deleteResult = async (resultId) => {

        Alert.alert(
            'Confirmation',
            'Voulez-vous vraiment supprimer ce résultat ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel',
                },
                {
                    text: 'Supprimer',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('userToken');

                            const axiosInstance = axios.create({
                                baseURL: BASE_URL,
                                headers: {
                                    'authorization': `Bearer ${token}`
                                }
                            });

                            const response = await axiosInstance.delete(`/results/delete/${resultId}`);

                            if (response.status === 200) {
                                fetchTeacherResults();
                            }

                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            ]
        );

    };
    return (
        <ScrollView style={styles.container}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 16,
                    paddingLeft: 16,
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack('Home')}>
                    <Entypo
                        name="chevron-left"
                        style={{
                            fontSize: 25,
                            color: COLORS.white,
                            padding: 12,
                            backgroundColor: COLORS.primary,
                            borderRadius: 10,
                        }}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{
                        color: COLORS.white,
                        fontSize: 20,
                        fontWeight: '600',
                        paddingRight: 30
                    }}>Mes Résultats</Text>
                </View>
            </View>
            {userInfo.role === "teacher" ? (<View animation="fadeInUpBig" style={styles.footer}>

                {resultRecords && resultRecords.length > 0 ? (
                    <>
                        {resultRecords.map((record, index) => (
                            <View key={index} style={{
                                marginTop: 20
                            }}>
                                <View
                                    style={{
                                        height: 210,
                                        borderTopLeftRadius: 20,
                                        borderTopRightRadius: 20,
                                        backgroundColor: COLORS.primary,

                                    }}
                                >

                                    <LinearGradient colors={['#345fb4', '#89cff0']}
                                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            borderTopLeftRadius: 20,
                                            borderTopRightRadius: 20,
                                            padding: SIZES.padding,


                                        }}>
                                        <View style={{ paddingBottom: 5 }}>
                                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>{record.intern.firstName} {record.intern.lastName} </Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                                            <Text style={{ ...FONTS.h5, color: COLORS.white }}>Date de délibération </Text>
                                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>{convertDate(record.createdAt)} </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                                            <Text style={{ ...FONTS.h5, color: COLORS.white }}>Matière </Text>
                                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>{record.scores[0].subject}</Text>
                                        </View>



                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>

                                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>Note CC</Text>
                                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>{record.scores[0].note_cc} </Text>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>

                                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>Note TP</Text>
                                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>{record.scores[0].note_tp} </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>

                                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>Note Examen</Text>
                                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>{record.scores[0].note_examen} </Text>
                                        </View>
                                        <View style={{ height: 1, backgroundColor: COLORS.white, margin: 3 }}></View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                                            <Text style={{ ...FONTS.h5, color: COLORS.white }}>Moyenne Finale </Text>

                                            <Text style={{ ...FONTS.h5, color: COLORS.white }}>  {(((parseFloat(record.scores[0].note_examen) * 2) + parseFloat(record.scores[0].note_tp) + parseFloat(record.scores[0].note_cc)) / 4).toFixed(2)} </Text>

                                            {/* {record.isPresent === true ?
                                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>Présent(e)</Text> :
                                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>Absent(e)</Text>
                                                } */}

                                        </View>

                                    </LinearGradient>

                                    <View
                                        style={{ // Render a placeholder view if eventPicture is null
                                            width: "100%",
                                            height: "100%",
                                            borderTopLeftRadius: 20,
                                            borderTopRightRadius: 20,
                                            backgroundColor: COLORS.lightGray
                                        }}
                                    />

                                </View>

                                <View
                                    style={{
                                        padding: SIZES.padding,
                                        backgroundColor: COLORS.lightGray,
                                        borderBottomLeftRadius: 20,
                                        borderBottomRightRadius: 20,
                                        shadowColor: COLORS.primary,
                                        shadowOffset: {
                                            width: 0,
                                            height: 10,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,
                                        elevation: 5
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ ...FONTS.h4, color: COLORS.black }} numberOfLines={1}>Formation</Text>

                                        <Animatable.View
                                            animation="bounceIn"
                                        >
                                            <TouchableOpacity onPress={() => deleteResult(record._id)}>
                                                <Feather
                                                    name="trash"
                                                    color="red"
                                                    size={23}
                                                />
                                            </TouchableOpacity>

                                        </Animatable.View>


                                    </View>
                                    <Text style={{ ...FONTS.body4, color: COLORS.black }} numberOfLines={2}>{record.formation.nom}</Text>


                                </View>
                            </View>
                        ))}
                    </>
                ) : (<View style={{ alignItems: 'center', paddingVertical: 20 }}>
                    <Animatable.Image
                        animation="bounceIn"
                        duration={1500}
                        style={styles.logo}
                        resizeMode="stretch" source={require('../../assets/images/logo.png')} />
                    <Text>Aucun Résultat Disponible</Text></View>

                )}
            </View>) : (<>
                <View style={[styles.userInfoSection]}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', margin: 20 }}>
                        <Text style={{ ...FONTS.h4, color: COLORS.white, marginTop: 20 }}>
                            Choisissez une formation
                        </Text>

                        {/* ComboBox to display formations */}

                        <View style={[styles.comboBoxContainer, { width: comboBoxWidth }]}>
                            <Picker
                                ref={pickerRef}
                                selectedValue={selectedFormation}
                                onValueChange={(itemValue, itemIndex) => {
                                    console.log('Selected formation:', itemValue);
                                    if (itemValue !== selectedFormation) {
                                        setSelectedFormation(itemValue);
                                    }
                                }}
                                style={[styles.pickerStyle, { height: 50 }]}
                            >
                                {formations.map((formation) => (
                                    <Picker.Item key={formation._id} label={formation.nom} value={formation._id} />
                                ))}
                            </Picker>
                        </View>

                    </View>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.white} />
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : (
                        <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' }}>

                            <CircularProgress
                                radius={60}
                                value={resultSummary.successRate ? value : 0}
                                textColor='#222'
                                fontSize={20}
                                valueSuffix={'%'}
                                inActiveStrokeColor={'#2ecc71'}
                                activeStrokeColor={COLORS.white}
                                inActiveStrokeOpacity={0.2}
                                inActiveStrokeWidth={6}
                                duration={3000}
                                setValue={setValue}
                            // onAnimationComplete={() => setValue(50)}
                            />

                            <CircularProgress
                                radius={60}
                                value={resultSummary.successRate ? 100 - value : 0}
                                textColor='#222'
                                fontSize={20}
                                valueSuffix={'%'}
                                activeStrokeColor={COLORS.red}
                                inActiveStrokeOpacity={0.2}
                                inActiveStrokeWidth={6}
                                setValue={setValue}
                                duration={4000}
                            />
                        </View>
                    )}

                </View>
                <View style={styles.userInfoSection}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : (
                        <View>
                            {/* Use the resultSummary state to display the data */}
                            {resultRecords && resultRecords.length > 0 ? (
                                <View>
                                    <View style={styles.row}>
                                        <Feather
                                            name="check-circle"
                                            color={COLORS.white}
                                            size={18}
                                        />
                                        <Text style={{ ...FONTS.h4, color: COLORS.white, marginLeft: 5 }}>Taux de réussite:  {resultSummary.successRate}%</Text>
                                    </View>
                                    <View style={styles.row}>
                                        <Feather
                                            name="x-circle"
                                            color={COLORS.white}
                                            size={18}
                                        />
                                        <Text style={{ ...FONTS.h4, color: COLORS.white, marginLeft: 5 }}>Taux de d'échec:  {100 - resultSummary.successRate}%</Text>
                                    </View>
                                    {/* <View style={styles.row}>
                                        <Feather
                                            name="pie-chart"
                                            color={COLORS.white}
                                            size={18}
                                        />
                                        <Text style={{ ...FONTS.h4, color: COLORS.white, marginLeft: 5 }}>Taux de réussite:  {resultSummary.successRate}%</Text>
                                    </View> */}

                                </View>
                            ) : (
                                <Text style={{ color: COLORS.white }}>Aucun Rapport de Résultats Disponible !</Text>
                            )}
                        </View>
                    )}
                </View>


                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : (
                    <View animation="fadeInUpBig" style={styles.footer}>

                        {resultRecords && resultRecords.length > 0 ? (
                            <>
                                {resultRecords.map((record, index) => (
                                    <View key={index} style={{
                                        marginTop: 20
                                    }}>
                                        <View
                                            style={{
                                                height: 200,
                                                borderTopLeftRadius: 20,
                                                borderTopRightRadius: 20,
                                                backgroundColor: COLORS.primary,

                                            }}
                                        >

                                            <LinearGradient colors={['#345fb4', '#89cff0']}
                                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    borderTopLeftRadius: 20,
                                                    borderTopRightRadius: 20,
                                                    padding: SIZES.padding,


                                                }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                                                    <Text style={{ ...FONTS.h5, color: COLORS.white }}>Date de délibération </Text>
                                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>{convertDate(record.createdAt)} </Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                                                    <Text style={{ ...FONTS.h5, color: COLORS.white }}>Matière </Text>
                                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>{record.scores[0].subject}</Text>
                                                </View>



                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>

                                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>Note CC</Text>
                                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>{record.scores[0].note_cc} </Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>

                                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>Note TP</Text>
                                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>{record.scores[0].note_tp} </Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>

                                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>Note Examen</Text>
                                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>{record.scores[0].note_examen} </Text>
                                                </View>
                                                <View style={{ height: 1, backgroundColor: COLORS.white, margin: 3 }}></View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                                                    <Text style={{ ...FONTS.h5, color: COLORS.white }}>Moyenne Finale </Text>

                                                    <Text style={{ ...FONTS.h5, color: COLORS.white }}>
                                                        {(((parseFloat(record.scores[0].note_examen) * 2) + parseFloat(record.scores[0].note_tp) + parseFloat(record.scores[0].note_cc)) / 4).toFixed(2)}
                                                    </Text>

                                                    {/* {record.isPresent === true ?
                                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>Présent(e)</Text> :
                                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>Absent(e)</Text>
                                                } */}

                                                </View>

                                            </LinearGradient>

                                            <View
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    borderTopLeftRadius: 20,
                                                    borderTopRightRadius: 20,
                                                    backgroundColor: COLORS.lightGray
                                                }}
                                            />

                                        </View>

                                        <View
                                            style={{
                                                padding: SIZES.padding,
                                                backgroundColor: COLORS.lightGray,
                                                borderBottomLeftRadius: 20,
                                                borderBottomRightRadius: 20,
                                                shadowColor: COLORS.primary,
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 10,
                                                },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 3.84,
                                                elevation: 5
                                            }}
                                        >
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={{ ...FONTS.h4, color: COLORS.black }} numberOfLines={1}>Formation</Text>
                                                {/* {record.isPresent === true ?
                                                <Animatable.View
                                                    animation="bounceIn"
                                                >
                                                    <Feather
                                                        name="check-circle"
                                                        color="green"
                                                        size={23}
                                                    />
                                                </Animatable.View>
                                                : <Animatable.View
                                                    animation="bounceIn"
                                                >
                                                    <Feather
                                                        name="x-circle"
                                                        color="red"
                                                        size={23}
                                                    />
                                                </Animatable.View>} */}
                                            </View>
                                            <Text style={{ ...FONTS.body4, color: COLORS.black }} numberOfLines={2}>{record.formation.nom}</Text>


                                        </View>
                                    </View>
                                ))}
                            </>
                        ) : (<View style={{ alignItems: 'center', paddingVertical: 20 }}>
                            <Animatable.Image
                                animation="bounceIn"
                                duration={1500}
                                style={styles.logo}
                                resizeMode="stretch" source={require('../../assets/images/logo.png')} />
                            <Text>Aucun Résultat Disponible</Text></View>

                        )}
                    </View>
                )}
            </>



            )}



        </ScrollView>
    );
}
const { height } = Dimensions.get("screen");
const height_logo = height * 0.4;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,

    },
    footer: {
        flex: 3,
        height: Dimensions.get('window').height,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 20,

    },
    logo: {
        width: '100%',
        height: height_logo,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    userInfoSection: {
        paddingHorizontal: 30,
        marginBottom: 25,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 5,
    },
    text: {
        color: '#fff',
        marginTop: 2,
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18,
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    comboBoxContainer: {
        height: 50, // Set a height that fits the ComboBox
        borderColor: COLORS.white,
        borderWidth: 1,
        borderRadius: 5,
        margin: 20,
        padding: 10,
    },
    pickerStyle: {
        width: '100%', // Set the same width as the ComboBox container
        color: COLORS.white,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginTop: -12
    },
});
export default Result;

