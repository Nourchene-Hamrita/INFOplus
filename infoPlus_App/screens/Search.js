import React, { useContext, useRef, useEffect, useState } from 'react';
import { View, TextInput, FlatList, StyleSheet, Dimensions, TouchableOpacity, Linking, ActivityIndicator, Alert, ToastAndroid } from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Text,
    TouchableRipple,


} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/Feather';
import { COLORS, FONTS, SIZES } from '../constants';
import { AuthContext } from '../context/AuthContext';


import * as Animatable from 'react-native-animatable';
import { Animations } from '../constants/Animations';
import axios from 'axios';
import { BASE_URL } from '../utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';
import { convertDate } from '../utils/date';


const ListItem = ({ item, index, animation, navigation }) => {
    return (
        <Animatable.View
            animation={animation}
            duration={1000}
            delay={index * 300}
        >
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
                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>{convertDate(item.createdAt)} </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                            <Text style={{ ...FONTS.h5, color: COLORS.white }}>Matière </Text>
                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>{item.scores[0].subject}</Text>
                        </View>



                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>

                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>Note CC</Text>
                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>{item.scores[0].note_cc} </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>

                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>Note TP</Text>
                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>{item.scores[0].note_tp} </Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>

                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>Note Examen</Text>
                            <Text style={{ ...FONTS.h4, color: COLORS.white }}>{item.scores[0].note_examen} </Text>
                        </View>
                        <View style={{ height: 1, backgroundColor: COLORS.white, margin: 3 }}></View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                            <Text style={{ ...FONTS.h5, color: COLORS.white }}>Moyenne Finale </Text>

                            <Text style={{ ...FONTS.h5, color: COLORS.white }}> Total </Text>

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
                    <Text style={{ ...FONTS.body4, color: COLORS.black }} numberOfLines={2}>{item.formation.nom}</Text>


                </View>
            </View>
        </Animatable.View>
    )
};



const Search = ({ navigation }) => {
    const renderItem = ({ item, index }) => (
        <ListItem item={item} index={index} animation={animation} />)

    const ItemSeparator = () => <View style={styles.separator} />
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
                    Liste vide !
                </Animatable.Text>
            </Animatable.View>
        )
    }
    const viewRef = useRef(null);
    const animation = Animations[Math.floor(Math.random() * Animations.length)]
    console.log('====================================');
    console.log(Math.floor(Math.random() * Animations.length), Math.random() * Animations.length, Animations.length);
    console.log('====================================');


    const [loading, setLoading] = useState(false);
    const { userInfo } = useContext(AuthContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = async () => {
        try {
            setLoading(true); // Start loading

            if (!searchQuery.trim()) { // Check if searchQuery is empty or contains only whitespace
                setSearchResults([]); // Set searchResults to an empty array
            } else {
                const response = await axios.get(`${BASE_URL}/results/formationORsubject/search?internId=${userInfo.details._id}&keywords=${searchQuery}`);

                if (response.data.message === "No results found") { // Update response.data.message
                    setSearchResults([]);
                } else {
                    setSearchResults(response.data);
                }
            }

            setLoading(false); // Stop loading
        } catch (error) {
            console.log('Error searching:', error);
            setSearchResults([]);
            setLoading(false); // Stop loading
        }
    };


    return (
        <View style={[styles.container]}>
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: 16,
                    paddingLeft: 16,
                    marginBottom: 5
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
                <View style={{ flex: 1, alignItems: 'center', }}>
                    <TextInput
                        style={{
                            height: 40,
                            borderColor: COLORS.white,
                            borderWidth: 1,
                            borderRadius: 10,
                            paddingLeft: 10,
                            paddingRight: 40,
                            color: COLORS.white,
                            marginRight: 30,
                            backgroundColor: 'transparent',
                        }}
                        placeholderTextColor={COLORS.white}
                        placeholder="Tapez une Matière ou Formation..."
                        value={searchQuery}
                        onChangeText={text => {
                            setSearchQuery(text); // Update searchQuery state on input change
                            handleSearch(); // Fetch data on input change
                        }}
                    />
                    <View style={{ position: 'absolute', top: 10, right: 10 }}>

                        <Feather name="search" size={20} color={COLORS.white} onPress={handleSearch} />
                    </View>
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
                    style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                >
                    <View style={styles.button}>
                        <TouchableOpacity style={{
                            width: '100%',
                            height: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                        }} onPress={handleSearch} >
                            <LinearGradient colors={['#345fb4', '#89cff0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.search}>
                                <View style={styles.buttonContent}>
                                    <Text style={[styles.textSubmit, { color: '#fff' }]}>Rechercher</Text>
                                    <Feather
                                        name="search"
                                        size={18}
                                        color={COLORS.white}
                                        style={{
                                            marginLeft: 10
                                        }}
                                    />

                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    ) : (
                        <FlatList
                            data={searchResults}
                            renderItem={renderItem}
                            keyExtractor={(item) => item._id}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={ItemSeparator}
                            ListEmptyComponent={ListEmptyComponent}
                        />
                    )}
                </Animatable.View>
            </Animatable.View>
        </View>

    )
}
export default Search;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
    },

    detailsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        alignItems: 'center',
        marginTop: 35,
        width: '100%',
        paddingHorizontal: 40,
    },
    submit: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40,
    },
    textSubmit: {
        fontSize: 18,
        fontWeight: 'bold'

    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Align text and icon vertically
    },
    search: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
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

})

