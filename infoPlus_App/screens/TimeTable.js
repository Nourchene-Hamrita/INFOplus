import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Dimensions, View, Text, ActivityIndicator, FlatList, TouchableOpacity, Linking } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../utils/config';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../constants';
import * as Animatable from 'react-native-animatable';
import { Animations } from '../constants/Animations';
import Entypo from 'react-native-vector-icons/Entypo';
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
                    <Text style={styles.pdfText}>{item.timetableFileName}</Text>
                </View>
            </View>
        </Animatable.View>
    )
};
const TimeTable = ({ navigation }) => {

    const viewRef = useRef(null);
    const animation = Animations[Math.floor(Math.random() * Animations.length)]
    console.log('====================================');
    console.log(Math.floor(Math.random() * Animations.length), Math.random() * Animations.length, Animations.length);
    console.log('====================================');

    const renderItem = ({ item, index }) => (
        <ListItem item={item} index={index} animation={animation} navigation={navigation} />)

    const [timetables, setTimetables] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        // Fetch the timetables from the API
        axios.get(`${BASE_URL}/users/${userInfo.details._id}/timetables`)
            .then(response => {
                console.log("API Response:", response.data); // Log the entire response
                setTimetables(response.data.timetables);
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
        if (timetables.length === 0) {
            return (
                <View style={[styles.listEmpty]}>
                    <Animatable.Text
                        animation={anim}
                        easing="ease-in-out"
                        duration={3000}
                        style={{ fontSize: 24 }}
                        iterationCount="infinite">
                        No timetables available !
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
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{
                        color: COLORS.white,
                        fontSize: 20,
                        fontWeight: '600',
                        paddingRight: 30
                    }}>Emploi du temps</Text>
                </View>
            </View>
            <Animatable.View animation="fadeInUpBig" style={{
                flex: 1,
                backgroundColor: '#fff',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingVertical: 60,
                paddingHorizontal: 20,
            }}>
                <Animatable.View
                    ref={viewRef}
                    easing={'ease-in-out'}
                    duration={500}
                >
                    <FlatList
                        data={timetables}
                        keyExtractor={(item) => item._id}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 100 }}
                        ListEmptyComponent={ListEmptyComponent}
                    />
                </Animatable.View>

            </Animatable.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: COLORS.primary
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
        shadowOpacity: 0.3,
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

export default TimeTable;
