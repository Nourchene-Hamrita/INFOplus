import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StatusBar,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Image,
    Dimensions,
    Animated,
    ToastAndroid,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useFetch from '../../hooks/useFetch';
import { BASE_URL } from '../../utils/config';
import { useRoute } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { convertDate, formatDate } from '../../utils/date';

const DetailEvent = ({ navigation }) => {
    const width = Dimensions.get('window').width;
    const scrollX = new Animated.Value(0);
    let position = Animated.divide(scrollX, width);


    const route = useRoute();
    const { eventId } = route.params;
    const { data: eventDetails, loading, error } = useFetch(
        `${BASE_URL}/events/find/${eventId}`

    );
    console.log(eventDetails);
    if (loading) {
        // Display a loading indicator while fetching the event details
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (error || !eventDetails) {
        // Display an error message if there's an error or no eventDetails
        return (
            <View>
                <Text>Error fetching event details</Text>
            </View>
        );
    }
    const renderEvent = ({ item, index }) => {
        return (
            <View
                style={{
                    width: width,
                    height: 240,
                    alignItems: 'center',
                    justifyContent: 'center',

                }}>
                <Image
                    source={{ uri: item }} // Use the "uri" property to specify the image URL
                    style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                    }}
                />
            </View>
        );
    };

    return (
        <View>
            <ScrollView>
                <View
                    style={{
                        width: '100%',
                        backgroundColor: COLORS.primary,
                        borderBottomRightRadius: 20,
                        borderBottomLeftRadius: 20,
                        position: 'relative',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 4,
                    }}>
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingTop: 16,
                            paddingLeft: 16,
                            paddingBottom: 15,
                        }}>

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
                        <Text style={{
                            color: COLORS.white, fontSize: 18,
                            fontWeight: '600',
                        }}>Détail Evènement</Text>
                    </View>
                    <FlatList
                        data={eventDetails.eventPictures ? eventDetails.eventPictures : null}
                        horizontal
                        renderItem={renderEvent}
                        showsHorizontalScrollIndicator={false}
                        decelerationRate={0.8}
                        snapToInterval={width}
                        bounces={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false },
                        )}
                    />
                    <View
                        style={{
                            width: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 16,
                            marginTop: 32,
                        }}>
                        {eventDetails.eventPictures
                            ? eventDetails.eventPictures.map((data, index) => {
                                let opacity = position.interpolate({
                                    inputRange: [index - 1, index, index + 1],
                                    outputRange: [0.2, 1, 0.2],
                                    extrapolate: 'clamp',
                                });
                                return (
                                    <Animated.View
                                        key={index}
                                        style={{
                                            width: '16%',
                                            height: 2.4,
                                            backgroundColor: COLORS.red,
                                            opacity,
                                            marginHorizontal: 4,
                                            borderRadius: 100,
                                        }}></Animated.View>
                                );
                            })
                            : null}
                    </View>
                </View>
                <View
                    style={{
                        paddingHorizontal:16,
                        paddingVertical:20,
                        marginTop: 6,

                    }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: 14,
                        }}>
                        <FontAwesome5
                            name="calendar-check"
                            style={{
                                fontSize: 18,
                                color: COLORS.primary,
                                marginRight: 6,
                            }}
                        />
                        <Text
                            style={{
                                fontSize: 12,
                                color: COLORS.primary,
                            }}>
                            Evènement
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            marginVertical: 4,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                        <Text
                            style={{
                                fontSize: 24,
                                fontWeight: '600',
                                letterSpacing: 0.5,
                                marginVertical: 4,
                                color: COLORS.black,
                                maxWidth: '84%',
                            }}>
                            {eventDetails.title}
                        </Text>
                        <Ionicons
                            name="link-outline"
                            style={{
                                fontSize: 24,
                                color: COLORS.primary,
                                backgroundColor: COLORS.primary + 10,
                                padding: 8,
                                borderRadius: 100,
                            }}
                        />
                    </View>
                    <Text
                        style={{
                            fontSize: 12,
                            color: COLORS.black,
                            fontWeight: '400',
                            letterSpacing: 1,
                            opacity: 0.5,
                            lineHeight: 20,
                            maxWidth: '85%',
                            maxHeight: 44,
                            marginBottom: 18,
                        }}>
                        {eventDetails.description}
                    </Text>
                    <View
                        style={{
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            marginVertical: 14,
                            borderBottomColor: COLORS.gray,
                            borderBottomWidth: 1,
                            paddingBottom: 20,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '80%',
                                alignItems: 'center',
                                paddingBottom: 10,

                            }}>
                            <View
                                style={{
                                    color: COLORS.blue,
                                    backgroundColor: COLORS.lightBlue,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 12,
                                    borderRadius: 100,
                                    marginRight: 10,
                                }}>
                                <FontAwesome5
                                    name="map-marker-alt"
                                    style={{
                                        fontSize: 14,
                                        color: COLORS.primary,
                                    }}
                                />
                            </View>
                            <Text style={{ color: COLORS.darkgray }}>{eventDetails.location}</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '80%',
                                alignItems: 'center',
                                paddingBottom: 10,
                            }}>
                            <View
                                style={{
                                    color: COLORS.blue,
                                    backgroundColor: COLORS.lightBlue,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 12,
                                    borderRadius: 100,
                                    marginRight: 10,
                                }}>
                                <FontAwesome5
                                    name="calendar-alt"
                                    style={{
                                        fontSize: 14,
                                        color: COLORS.primary,
                                    }}
                                />
                            </View>
                            <Text style={{ color: COLORS.darkgray }}>{formatDate(eventDetails.start_date)}</Text>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '80%',
                                alignItems: 'center',
                                paddingBottom: 10,

                            }}>
                            <View
                                style={{
                                    color: COLORS.blue,
                                    backgroundColor: COLORS.lightBlue,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 12,
                                    borderRadius: 100,
                                    marginRight: 10,
                                }}>
                                <FontAwesome5
                                    name="calendar-times"
                                    style={{
                                        fontSize: 14,
                                        color: COLORS.primary,
                                    }}
                                />
                            </View>
                            <Text style={{ color: COLORS.darkgray }}>{formatDate(eventDetails.end_date)}</Text>
                        </View>
                        <Entypo
                            name="chevron-right"
                            style={{
                                fontSize: 22,
                                color: COLORS.lightRed,
                            }}
                        />
                    </View>
                    <View
                        style={{
                            paddingHorizontal: 16,
                        }}>
                        {eventDetails.price !== 0 ? <Text
                            style={{
                                fontSize: 18,
                                fontWeight: '500',
                                maxWidth: '85%',
                                color: COLORS.black,
                                marginBottom: 4,
                            }}>
                            Prix: {eventDetails.price}.00
                        </Text > : <Text style={{
                            fontSize: 18,
                            fontWeight: '500',
                            maxWidth: '85%',
                            color: COLORS.primary,
                            marginBottom: 4,
                        }}>
                            Gratuit
                        </Text>}


                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});

export default DetailEvent