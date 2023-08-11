import React, { useEffect, useRef, useContext, useState } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, ActivityIndicator, ToastAndroid, TouchableOpacity, View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { Animations } from '../constants/Animations'
import Entypo from 'react-native-vector-icons/Entypo';
import { COLORS, FONTS } from '../constants';
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/config';
import { formatDate } from '../utils/date';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'react-test-renderer';
const AnnouncementItem = ({ item: { title, content, date, teacher, createdAt }, index, animation }) => {
    return (
        <Animatable.View animation={animation} duration={1000} delay={index * 300}>
            <TouchableOpacity style={styles.item}>
                <View style={styles.avatar}>
                    <Text style={styles.letter}>{teacher.firstName.slice(0, 1).toUpperCase()}</Text>
                </View>
                <View style={styles.details}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.name}>{teacher.firstName} {teacher.lastName}</Text>
                        <Text >{formatDate(createdAt)}</Text>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ ...FONTS.h4, color: COLORS.primary }} numberOfLines={1}>{title}</Text>
                        <Text numberOfLines={1}>{content}</Text>

                    </View>
                </View>
            </TouchableOpacity>
        </Animatable.View>
    );
}

export default function Announcement({ route, navigation }) {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useContext(AuthContext);

    const viewRef = useRef(null);
    const animation = Animations[Math.floor(Math.random() * Animations.length)]
    console.log(animation);
    const ItemSeparator = () => <View style={styles.separator} />

    useEffect(() => {
        // Fetch the assignments from the API with the bearer token
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const axiosInstance = axios.create({
                    baseURL: BASE_URL,
                    headers: {
                        'authorization': `Bearer ${token}`
                    }
                });

                const response = await axiosInstance.get(`/formations/${userInfo.details._id}/level-content`);
                console.log("API Response:", response.data);
                setAnnouncements(response.data.announcements);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchData();
    }, [userInfo.details._id]);

    const renderItem = ({ item, index }) => (
        <AnnouncementItem item={item} index={index} animation={animation} />)

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
                    Liste Vide!
                </Animatable.Text>
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
    return (
        <View style={[styles.container]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack('Home')}>
                    <Entypo
                        name="chevron-left"
                        style={{
                            fontSize: 25,
                            color: COLORS.white,
                            padding: 12,
                            backgroundColor: 'transparent',
                            borderRadius: 10,
                        }}
                    />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center', marginRight: 30 }}>
                    <Text style={{
                        color: COLORS.white, fontSize: 20,
                        fontWeight: '600', marginTop: 10
                    }}>Annonces</Text>
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
                <Animatable.View
                    ref={viewRef}
                    easing={'ease-in-out'}
                    duration={500}>
                    <FlatList
                        data={announcements}
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
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
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
        alignItems: 'flex-start', // Align header contents to the left (start)
        paddingHorizontal: 10,
        flexDirection: 'row',
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

});
