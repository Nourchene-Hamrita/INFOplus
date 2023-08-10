import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-animatable';
import CircularProgress from 'react-native-circular-progress-indicator';
import { COLORS, FONTS, SIZES } from '../constants';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { BASE_URL } from '../utils/config';
import { AuthContext } from '../context/AuthContext';
import { ActivityIndicator } from 'react-native-paper';
import { convertDate, formatDate } from '../utils/date';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';

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
            setResultSummary({ ...data, successRate });
        } catch (error) {
            console.error('Error fetching result summary:', error);
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
            console.error('Error fetching result records:', error);
            // setError('Failed to fetch result records');
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
    }, [selectedFormation]);

    const screenWidth = Dimensions.get('window').width;
    const buttonWidth = screenWidth * 0.8;
    const comboBoxWidth = buttonWidth * 0.8;
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
                            fontSize: 18,
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
                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' }}>
                    <CircularProgress
                        radius={60}
                        value={resultSummary.successRate ? resultSummary.successRate : 0}
                        textColor='#222'
                        fontSize={20}
                        valueSuffix={'%'}
                        inActiveStrokeColor={'#2ecc71'}
                        activeStrokeColor={COLORS.white}
                        inActiveStrokeOpacity={0.2}
                        inActiveStrokeWidth={6}
                        duration={3000}
                        onAnimationComplete={() => setValue(50)}
                    />

                    <CircularProgress
                        radius={60}
                        value={resultSummary.successRate ? 100 - resultSummary.successRate : 0}
                        textColor='#222'
                        fontSize={20}
                        valueSuffix={'%'}
                        activeStrokeColor={COLORS.red}
                        inActiveStrokeOpacity={0.2}
                        inActiveStrokeWidth={6}
                        duration={4000}
                    />
                </View>
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
                                        name="calendar"
                                        color={COLORS.white}
                                        size={18}
                                    />
                                    <Text style={{ ...FONTS.h4, color: COLORS.white, marginLeft: 5 }}>Nombre total de jours : {resultRecords.createdAt}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Feather
                                        name="check-circle"
                                        color={COLORS.white}
                                        size={18}
                                    />
                                    <Text style={{ ...FONTS.h4, color: COLORS.white, marginLeft: 5 }}>Jours de présence: {resultRecords.createdAt}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Feather
                                        name="x-circle"
                                        color={COLORS.white}
                                        size={18}
                                    />
                                    <Text style={{ ...FONTS.h4, color: COLORS.white, marginLeft: 5 }}>Jours d'absence: {resultRecords.createdAt}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Feather
                                        name="pie-chart"
                                        color={COLORS.white}
                                        size={18}
                                    />
                                    <Text style={{ ...FONTS.h4, color: COLORS.white, marginLeft: 5 }}>Pourcentage d'assiduité: {resultRecords.createdAt}%</Text>
                                </View>

                            </View>
                        ) : (
                            <Text style={{ color: COLORS.white }}>No result summary available !</Text>
                        )}
                    </View>
                )}
            </View>

            <View animation="fadeInUpBig" style={styles.footer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : (
                    /* Display result records */
                    resultRecords && resultRecords.length > 0 ? (
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

                                                <Text style={{ ...FONTS.h5, color: COLORS.white }}> Total </Text>

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
                    ) : (
                        <Text>No result records found</Text>
                    )
                )}

            </View>


        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,

    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 5,
        paddingHorizontal: 20,

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

