import React, { useContext, useRef, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Dimensions, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Text,
    TouchableRipple,

} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS } from '../constants';
import { AuthContext } from '../context/AuthContext';
import { convertDate } from '../utils/date';
import user from "../assets/images/user.jpg"
import { ScrollView } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import { Animations } from '../constants/Animations';
import axios from 'axios';
import { BASE_URL } from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const colorAr = [
    '#637aff',
    '#60c5a8',
    '#CCCCCC',
    '#ff5454',
    '#039a83',
    '#dcb834',
    '#8f06e4',
    'skyblue',
    '#ff4c98',
]
const bgColor = (i) => colorAr[i % colorAr.length];
const openPdf = (pdfUrl) => {
    // Open the PDF in a full-screen viewer using Linking
    Linking.openURL(pdfUrl);
};
const ListItem = ({ item, index, animation, navigation }) => {
    return (
        <Animatable.View
            animation={animation}
            duration={1000}
            delay={index * 300}
        >
            <View style={styles.listItem}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => openPdf(item.pdfUrl)}>

                    <View style={[styles.image, { backgroundColor: bgColor(index) }]} />

                </TouchableOpacity>
                <View style={styles.detailsContainer}>
                    <Text style={styles.pdfText}>{item.title}</Text>
                </View>
            </View>
        </Animatable.View>
    )
};



const Assignment = ({ navigation }) => {
    const viewRef = useRef(null);
    const animation = Animations[Math.floor(Math.random() * Animations.length)]
    console.log('====================================');
    console.log(Math.floor(Math.random() * Animations.length), Math.random() * Animations.length, Animations.length);
    console.log('====================================');

    const renderItem = ({ item, index }) => (
        <ListItem item={item} index={index} animation={animation} navigation={navigation} />)


    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {

        // Fetch the assignments from the API with the bearer token
        const token = AsyncStorage.getItem('userToken');
        const axiosInstance = axios.create({
            baseURL: BASE_URL,
            headers: {
                'authorization': `Bearer ${token}`
            }
        });

        axiosInstance.get(`/formations/${userInfo.details._id}/level-content`)
            .then(response => {
                console.log("API Response:", response.data);
                setAssignments(response.data.assignments);
                console.log(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' color={COLORS.white} />
                <Text>Loading...</Text>
            </View>
        );
    }
    const ListEmptyComponent = () => {
        const anim = {
            0: { translateY: 0 },
            0.5: { translateY: 50 },
            1: { translateY: 0 },
        }
        if (assignments.length === 0) {
            return (
                <View style={[styles.listEmpty]}>
                    <Animatable.Text
                        animation={anim}
                        easing="ease-in-out"
                        duration={3000}
                        style={{ fontSize: 24 }}
                        iterationCount="infinite">
                        No assignments available !
                    </Animatable.Text>
                </View>
            )
        }
    }


    return (
        <View style={styles.container}>

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
                    }}>Mes Devoirs</Text>
                </View>
            </View>

            <View style={{
                flex: 1,
                backgroundColor: '#fff',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingVertical: 100,
                paddingHorizontal: 20,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Animatable.View
                    ref={viewRef}
                    easing={'ease-in-out'}
                    duration={500}
                >
                    <FlatList
                        data={assignments}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={ListEmptyComponent}
                    />
                </Animatable.View>



            </View>
        </View>
    );
};

export default Assignment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',

    },
    userInfoSection: {
        paddingHorizontal: 30,
        marginBottom: 25,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        fontWeight: '500',
        color: '#fff',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    infoBoxWrapper: {
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1,
        borderTopColor: '#dddddd',
        borderTopWidth: 1,
        flexDirection: 'row',
        height: 120,
    },
    infoBox: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuWrapper: {
        marginTop: 10,
    },
    menuItem: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    menuItemText: {
        color: '#777777',
        marginLeft: 20,
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 26,
    },

    timetableItem: {
        marginVertical: 10,
        alignItems: 'center',
    },
    pdfText: {
        color: COLORS.primary,
        fontSize: 16,
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'black',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: 'rgba(0, 0, 0, .08)',
    },
    listEmpty: {
        height: Dimensions.get('window').height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listItem: {
        height: 200,
        width: Dimensions.get('window').width / 2 - 16,
        backgroundColor: 'white',
        margin: 8,
        borderRadius: 10,
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5
    },
    image: {
        height: 150,
        margin: 5,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
    },
    detailsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },


});

