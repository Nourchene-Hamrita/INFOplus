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
    StyleSheet, Linking
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useFetch from '../../hooks/useFetch';
import { BASE_URL } from '../../utils/config';
import { useRoute } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { convertDate, formatDate } from '../../utils/date';
import * as Animatable from 'react-native-animatable';

const openFile = (attachmentUrl) => {
    // Open the PDF in a full-screen viewer using Linking
    Linking.openURL(attachmentUrl);
};
const AssignmentDetail = ({ navigation }) => {
    const width = Dimensions.get('window').width;
    const scrollX = new Animated.Value(0);
    let position = Animated.divide(scrollX, width);


    const route = useRoute();
    const { formationId, className, assignmentId } = route.params;
    const { data: assignmentDetails, loading, error } = useFetch(
        `${BASE_URL}/formations/${formationId}/classes/${className}/${assignmentId}`

    );
    console.log(assignmentDetails);
    if (loading) {
        // Display a loading indicator while fetching the event details
        return (
            <View style={[styles.container, styles.horizontal]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (error || !assignmentDetails) {
        // Display an error message if there's an error or no eventDetails
        return (
            <View>
                <Text>Error fetching assignment details</Text>
            </View>
        );
    }
    const renderAssignment = ({ item, index }) => {
        return (
            <View
                style={{
                    width: width,
                    height: 240,
                    alignItems: 'center',
                    justifyContent: 'center',

                }}>
                <Text>{item.attachmentOriginalName}</Text>
            </View>
        );
    };

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
                    }}>Détail Devoir</Text>
                </View>
            </View>
            <Animatable.View style={{
                flex: 1,
                backgroundColor: '#fff',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingVertical: 60,
                paddingHorizontal: 20,
            }} animation="fadeInUpBig">

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
                        {assignmentDetails.subject}
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
                        {assignmentDetails.title}
                    </Text>
                    <Ionicons
                        onPress={() => openFile(assignmentDetails.attachmentUrl)}
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
                        color: COLORS.red,
                        fontWeight: '400',
                        letterSpacing: 1,
                        opacity: 0.5,
                        lineHeight: 20,
                        maxWidth: '85%',
                        maxHeight: 44,
                        marginBottom: 18,
                    }}>
                    {assignmentDetails.attachmentOriginalName}
                </Text>
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
                    {assignmentDetails.description}
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
                        <Text style={{ color: COLORS.darkgray }}>{assignmentDetails.dueDate}</Text>
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
                        <Text style={{ color: COLORS.darkgray }}>{formatDate(assignmentDetails.dueDate)}</Text>
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
                        <Text style={{ color: COLORS.darkgray }}>{formatDate(assignmentDetails.dueDate)}</Text>
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
                    {Date.now() > assignmentDetails.dueDate ? (
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: '500',
                                maxWidth: '85%',
                                color: COLORS.black,
                                marginBottom: 4,
                            }}>
                            Prix: {assignmentDetails.title}.00
                        </Text>
                    ) : (
                        <Text>
                            test.....
                        </Text>
                    )}


                </View>
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
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});

export default AssignmentDetail