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
    StyleSheet, Linking, Alert
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import useFetch from '../../hooks/useFetch';
import { BASE_URL } from '../../utils/config';
import { useRoute } from '@react-navigation/native';
import { COLORS } from '../../constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { formatDate } from '../../utils/date';
import * as Animatable from 'react-native-animatable';

const openFile = (attachmentUrl, attachmentOriginalName) => {
    // Show an alert to confirm downloading the file
    Alert.alert(
        'Télécharger le Fichier',
        `Voulez-vous télécharger "${attachmentOriginalName}"?`,
        [
            {
                text: 'Annuler',
                style: 'cancel',
            },
            {
                text: 'Télécharger',
                onPress: () => {
                    // Open the URL to download the file
                    Linking.openURL(attachmentUrl);
                },
            },
        ]
    );
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
                <ActivityIndicator size="large" color={COLORS.white} />
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
                    marginBottom: 5
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
                <View style={{ flex: 1, alignItems: 'center', marginRight: 20 }}>
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
                            fontSize: 18,
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
                    <TouchableOpacity onPress={() => openFile(assignmentDetails.attachmentUrl, assignmentDetails.attachmentOriginalName)}>
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
                    </TouchableOpacity>

                </View>

                <Text
                    style={{
                        fontSize: 14,
                        color: COLORS.black,
                        fontWeight: '400',
                        letterSpacing: 1,
                        opacity: 0.5,
                        lineHeight: 20,
                        maxWidth: '85%',
                        maxHeight: 44,
                        marginBottom: 18,
                    }}>
                    {assignmentDetails.teacher.firstName} {assignmentDetails.teacher.lastName}
                </Text>
                <Text
                    style={{
                        fontSize: 14,
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
                <TouchableOpacity onPress={() => openFile(assignmentDetails.attachmentUrl, assignmentDetails.attachmentOriginalName)}>
                    <Text
                        style={{
                            fontSize: 12,
                            color: COLORS.red,
                            fontWeight: '400',
                            letterSpacing: 1,
                            lineHeight: 20,
                            maxWidth: '85%',
                            maxHeight: 44,
                            marginBottom: 18,
                        }}>
                        {assignmentDetails.attachmentOriginalName}
                    </Text>
                </TouchableOpacity>

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
                                backgroundColor: COLORS.primary + 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 12,
                                borderRadius: 100,
                                marginRight: 10,
                            }}>
                            <FontAwesome5
                                name="calendar-check"
                                style={{
                                    fontSize: 16,
                                    color: COLORS.primary,
                                }}
                            />
                        </View>
                        <Text style={{ color: COLORS.primary }}>Crée le : </Text>
                        <Text style={{ color: COLORS.darkgray }}>{formatDate(assignmentDetails.createdAt)}</Text>
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
                                backgroundColor: COLORS.primary + 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 12,
                                borderRadius: 100,
                                marginRight: 10,
                            }}>
                            <FontAwesome5
                                name="calendar-alt"
                                style={{
                                    fontSize: 16,
                                    color: COLORS.primary,
                                }}
                            />
                        </View>
                        <Text style={{ color: COLORS.primary }}>Modifié le : </Text>
                        <Text style={{ color: COLORS.darkgray }}>{formatDate(assignmentDetails.updatedAt)}</Text>
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
                                backgroundColor: COLORS.lightRed,
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 12,
                                borderRadius: 100,
                                marginRight: 10,
                            }}>
                            <FontAwesome5
                                name="calendar-times"
                                style={{
                                    fontSize: 16,
                                    color: COLORS.red,
                                }}
                            />
                        </View>
                        <Text style={{ color: COLORS.red }}>Date limite : </Text>
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
                    {Date.now() > new Date(assignmentDetails.dueDate).getTime() ? (
                        <Text
                            style={{
                                fontSize: 18,
                                fontWeight: '500',
                                maxWidth: '85%',
                                color: COLORS.red,
                                marginBottom: 4,
                            }}>
                            Le devoir a expiré
                        </Text>
                    ) : (
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '500',
                            maxWidth: '85%',
                            color: COLORS.green,
                            marginBottom: 4,
                        }}>
                            Le devoir est encore valide
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