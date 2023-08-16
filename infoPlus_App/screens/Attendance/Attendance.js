import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-animatable';
import CircularProgress from 'react-native-circular-progress-indicator';
import { COLORS, FONTS, SIZES } from '../../constants';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import { BASE_URL } from '../../utils/config';
import { AuthContext } from '../../context/AuthContext';
import { ActivityIndicator } from 'react-native-paper';
import { formatDate } from '../../utils/date';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';

const Attendance = ({ navigation }) => {
    const { userInfo } = useContext(AuthContext);
    const [value, setValue] = useState(0);
    const [attendanceSummary, setAttendanceSummary] = useState({
        success: false,
        totalDays: 0,
        daysPresent: 0,
        daysAbsent: 0,
        attendancePercentage: 0,
    });
    const [attendanceRecords, setAttendanceRecords] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const ListEmptyComponent = () => {
        const anim = {
            0: { translateY: 0 },
            0.5: { translateY: 50 },
            1: { translateY: 0 },
        }
        return (
            <Animatable.View style={[styles.listEmpty]}>
                <Animatable.Text
                    animation={anim}
                    easing="ease-in-out"
                    duration={3000}
                    style={{ fontSize: 24 }}
                    iterationCount="infinite">
                    Liste Vide !
                </Animatable.Text>
            </Animatable.View>
        )
    }

    useEffect(() => {
        const fetchAttendanceSummary = async () => {
            try {
                // Make the API call to fetch the overall attendance summary
                const response = await fetch(`${BASE_URL}/interns/${userInfo.details._id}/attendance/summary`);
                if (!response.ok) {
                    setError('Failed to fetch attendance summary');
                    setLoading(false);
                    return;
                }
                const data = await response.json();
                setAttendanceSummary(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching overall attendance summary:', error);
                setError('Failed to fetch attendance summary');
                setLoading(false);
            }
        };


        const fetchAttendanceRecords = async () => {
            try {
                const response = await fetch(`${BASE_URL}/interns/${userInfo.details._id}/attendance`);
                if (!response.ok) {
                    setError('Failed to fetch attendance records');
                    setLoading(false);
                    return;
                }
                const data = await response.json();
                setAttendanceRecords(data.attendance);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching attendance records:', error);
                setError('Failed to fetch attendance records');
                setLoading(false);
            }
        };

        fetchAttendanceSummary();
        fetchAttendanceRecords();
    }, []);
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
                        fontSize: 25,
                        fontWeight: '600',
                        paddingRight: 30
                    }}>Mes Absences</Text>
                </View>
            </View>
            <View style={[styles.userInfoSection]}>
                <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: 'space-between' }}>
                    <CircularProgress
                        radius={60}
                        value={attendanceSummary.attendancePercentage}
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
                        value={100 - (attendanceSummary.attendancePercentage)}
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
                        {/* Use the attendanceSummary state to display the data */}
                        {attendanceSummary.success ? (
                            <View>
                                <View style={styles.row}>
                                    <Feather
                                        name="calendar"
                                        color={COLORS.white}
                                        size={18}
                                    />
                                    <Text style={{ ...FONTS.h4, color: COLORS.white, marginLeft: 5 }}>Nombre total de jours : {attendanceSummary.totalDays}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Feather
                                        name="check-circle"
                                        color={COLORS.white}
                                        size={18}
                                    />
                                    <Text style={{ ...FONTS.h4, color: COLORS.white, marginLeft: 5 }}>Jours de présence: {attendanceSummary.daysPresent}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Feather
                                        name="x-circle"
                                        color={COLORS.white}
                                        size={18}
                                    />
                                    <Text style={{ ...FONTS.h4, color: COLORS.white, marginLeft: 5 }}>Jours d'absence: {attendanceSummary.daysAbsent}</Text>
                                </View>
                                <View style={styles.row}>
                                    <Feather
                                        name="pie-chart"
                                        color={COLORS.white}
                                        size={18}
                                    />
                                    <Text style={{ ...FONTS.h4, color: COLORS.white, marginLeft: 5 }}>Pourcentage d'assiduité: {attendanceSummary.attendancePercentage}%</Text>
                                </View>

                            </View>
                        ) : (
                            <Text>No attendance summary available !</Text>
                        )}
                    </View>
                )}
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
                <View animation="fadeInUpBig" style={styles.footer}>


                    {attendanceRecords.length > 0 ? (
                        <>
                            {attendanceRecords.map((record, index) => (
                                <View key={index} style={{
                                    marginTop: 20
                                }}>
                                    <View
                                        style={{
                                            height: 100,
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
                                                <Text style={{ ...FONTS.h5, color: COLORS.white }}>Date de la séance </Text>
                                                <Text style={{ ...FONTS.h4, color: COLORS.white }}>{formatDate(record.date)} </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                                                <Text style={{ ...FONTS.h5, color: COLORS.white }}>Matière </Text>
                                                <Text style={{ ...FONTS.h4, color: COLORS.white }}>{record.subject} </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                                                <Text style={{ ...FONTS.h5, color: COLORS.white }}>Assiduité </Text>
                                                {record.isPresent === true ?
                                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>Présent(e)</Text> :
                                                    <Text style={{ ...FONTS.h4, color: COLORS.white }}>Absent(e)</Text>
                                                }

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
                                            {record.isPresent === true ?
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
                                                </Animatable.View>}
                                        </View>
                                        <Text style={{ ...FONTS.body4, color: COLORS.black }} numberOfLines={2}>{record.formation.nom}</Text>


                                    </View>
                                </View>
                            ))}
                        </>
                    ) :
                        (<>
                            {ListEmptyComponent()}
                        </>


                        )
                    }


                </View>
            )}



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
        height: Dimensions.get('window').height,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical:20,
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
    listEmpty: {
        height: Dimensions.get('window').height/2,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default Attendance;
