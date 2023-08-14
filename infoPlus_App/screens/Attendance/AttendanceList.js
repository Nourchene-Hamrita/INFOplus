import React, { useEffect, useRef, useContext, useState } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, ToastAndroid,ActivityIndicator, TouchableOpacity, View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { Animations } from '../../constants/Animations'
import Entypo from 'react-native-vector-icons/Entypo';
import { COLORS, FONTS } from '../../constants';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const InternItem = ({ item: { firstName, lastName, className, subject, daysPresent, daysAbsent, attendancePercentage }, index, animation }) => {



    return (
        <Animatable.View animation={animation} duration={1000} delay={index * 300}>
            <TouchableOpacity style={styles.item}>
                <View style={styles.avatar}>
                    <Text style={styles.letter}>{firstName.slice(0, 1).toUpperCase()}</Text>
                </View>
                <View style={styles.details}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.name}>{firstName} {lastName}</Text>
                        <Text style={[styles.number]}>{attendancePercentage}%</Text>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <Text>{className}</Text>
                        <Text >{subject}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animatable.View>
    );
}

export default function AttendanceList({ route, navigation }) {
    const { userInfo } = useContext(AuthContext);
    const [attendanceList, setAttendanceList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState(null); // State variable to store selected formation

    useEffect(() => {
        // Fetch the assignments from the API with the bearer token
        const fetchData = async () => {
            try {
                if (selectedClass) {
                    const token = await AsyncStorage.getItem('userToken');
                    const axiosInstance = axios.create({
                        baseURL: BASE_URL,
                        headers: {
                            'authorization': `Bearer ${token}`
                        }
                    });

                    const formationId = selectedClass.formationId;
                    const classId = selectedClass.classId;
                    console.log(formationId)
                    console.log(classId)
                    const response = await axiosInstance.get(`/formations/${formationId}/${classId}/attendance-summary`);
                    console.log("API Response:", response.data);
                    setAttendanceList(response.data.internSummaries);
                    setLoading(false);
                } else {
                    setAttendanceList([]); // If no class is selected, reset the attendance list
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [userInfo.details._id, selectedClass]);


    const pickerRef = useRef();
    const viewRef = useRef(null);
    const animation = Animations[Math.floor(Math.random() * Animations.length)]
    console.log(animation);
    const ItemSeparator = () => <View style={styles.separator} />

    const renderItem = ({ item, index }) => (
        <InternItem item={item} index={index} animation={animation} />)

    const ListEmptyComponent = () => {
        const anim = {
            0: { translateY: 0 },
            0.5: { translateY: 50 },
            1: { translateY: 0 },
        }
        return (
            <Animatable.View style={[styles.listEmpty]}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                ):(
                    <Animatable.Text
                    animation={anim}
                    easing="ease-in-out"
                    duration={3000}
                    style={{ fontSize: 24 }}
                    iterationCount="infinite">
                    Liste Vide!
                </Animatable.Text>
                )}
                
            </Animatable.View>
        )
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            viewRef.current.animate({ 0: { opacity: 0.5, }, 1: { opacity: 1 } });
        })
        // ToastAndroid.show(animation+ ' Animation', ToastAndroid.SHORT);
        return () => unsubscribe;
    }, [navigation])

    const screenWidth = Dimensions.get('window').width;
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
                    <Text style={styles.headerText}>Liste des Absences</Text>
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
                        
                    <FlatList
                        data={attendanceList}
                        keyExtractor={(_, i) => String(i)}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={ItemSeparator}
                        ListEmptyComponent={ListEmptyComponent}
                    />
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
    avatar: {
        height: 36,
        width: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    letter: {
        color: 'white',
        fontWeight: 'bold',
    },
    details: {
        flex: 1,
        justifyContent: 'space-between',
        margin: 10
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'black',
    },
    number: {
        fontSize: 14,
        color: COLORS.darkgray,

    },
    description: {
        color: COLORS.lightGray,
    },
    date: {

        color: COLORS.lightGray,
    },

    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: COLORS.gray,
    },
    listEmpty: {
        height: Dimensions.get('window').height,
        alignItems: 'center',
        justifyContent: 'center',
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


});