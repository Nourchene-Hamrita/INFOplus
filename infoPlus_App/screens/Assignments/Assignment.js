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
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, FONTS } from '../../constants';
import { AuthContext } from '../../context/AuthContext';


import * as Animatable from 'react-native-animatable';
import { Animations } from '../../constants/Animations';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';
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

const openFile = (attachmentUrl) => {
    // Open the PDF in a full-screen viewer using Linking
    Linking.openURL(attachmentUrl);
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
                    onPress={() => navigation.navigate('AssignmentDetail',
                        {
                            formationId: item.formation.id,
                            className: item.class.name,
                            assignmentId: item._id
                        })}>

                    <View style={[styles.image, { backgroundColor: bgColor(index) }]}>
                        <Text style={styles.subjectText}>{item.subject}</Text>
                    </View>

                </TouchableOpacity>
                <View style={styles.detailsContainer}>
                    <Text style={styles.fileText} numberOfLines={1}>{item.title}</Text>
                    <Icon name="more-vertical" size={20} color={COLORS.black} onPress={() => navigation.navigate('AssignmentDetail', {
                        formationId: item.formation.id,
                        className: item.class.name,
                        assignmentId: item._id
                    })} />

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
        <View style={[styles.container]}>
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop:16,
                    paddingLeft: 16,
                    marginBottom:5
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
                <View style={{ flex: 1, alignItems: 'center',marginRight:20 }}>
                    <Text style={{
                        color: COLORS.white,
                        fontSize: 20,
                        fontWeight: '600',
                        paddingRight: 30
                    }}>Mes Devoirs</Text>
                </View>
            </View>
            <Animatable.View style={{
                flex: 1,
                backgroundColor: '#fff',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingVertical: 60,
                paddingHorizontal: 3,
            }} animation="fadeInUpBig">

                <Animatable.View
                    ref={viewRef}
                    easing={'ease-in-out'}
                    duration={500}
                >
                    <FlatList
                        data={assignments}
                        keyExtractor={(_, i) => String(i)}
                        numColumns={2}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={ListEmptyComponent}
                    />
                </Animatable.View>
            </Animatable.View>
        </View>

    )
}
export default Assignment;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
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
        alignItems: 'center',
        justifyContent: 'center'
    },
    fileText: {
        color: COLORS.primary,
        fontSize: 16,
    },
    subjectText: {
        color: COLORS.white,
        fontSize: 18,

    },
    detailsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})
