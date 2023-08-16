import React, { useContext, useEffect, useState } from 'react';
import { View, Dimensions, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
    Avatar,
    Title,
    Caption,
    Text,
    TouchableRipple,

} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS, SIZES } from '../constants';
import { AuthContext } from '../context/AuthContext';
import { convertDate } from '../utils/date';
import paiement from "../assets/icons/bill.png"
import { ScrollView } from 'react-native-gesture-handler';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/config';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import { ActivityIndicator } from 'react-native-paper';


const Paiement = ({ navigation }) => {
    const { userInfo } = useContext(AuthContext);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    // Function to fetch payments data
    const fetchPayments = async () => {
        try {
            const response = await fetch(`${BASE_URL}/payments/getPaymentsByIntern/${userInfo.details._id}`);
            if (!response.ok) {
                setError('Failed to fetch attendance summary');
                setLoading(false);
                return;
            }
            const data = await response.json();
            console.log(data);
            setPayments(data);
            setLoading(false);
        } catch (error) {
            console.log('Error fetching payments data:', error);
            setLoading(false);

        }
    };

    // Fetch payments data on component mount
    useEffect(() => {
        fetchPayments();
    }, []);

    return (
        <ScrollView style={styles.container}>
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
                        fontSize: 20,
                        fontWeight: '600',
                        paddingRight: 30
                    }}>Historique des Paiements</Text>
                </View>
            </View>



            <View style={styles.userInfoSection}>
                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                    <Image
                        source={paiement}
                        style={{
                            height: 70,
                            width: 70,
                            tintColor: COLORS.white
                        }}
                    />
                    <View style={{ marginLeft: 20 }}>
                        <Title style={[styles.title, {
                            marginTop: 15,
                            marginBottom: 5,
                        }]}>{userInfo.details.firstName} {userInfo.details.lastName}</Title>
                        <Caption style={styles.caption}>{userInfo.details.login}</Caption>
                    </View>
                </View>
            </View>

            <View style={styles.userInfoSection}>
                <View style={styles.row}>
                    <Icon name="map-marker-radius" color="#fff" size={20} />
                    <Text style={{ color: "#fff", marginLeft: 20, fontSize: 16 }}>{userInfo.details.address}</Text>
                </View>
                <View style={styles.row}>
                    <Icon name="phone" color="#fff" size={20} />
                    <Text style={{ color: "#fff", marginLeft: 20, fontSize: 16 }}>+216 {userInfo.details.mobile}</Text>
                </View>
                <View style={styles.row}>
                    <Icon name="calendar-month-outline" color="#fff" size={20} />
                    <Text style={{ color: "#fff", marginLeft: 20, fontSize: 16 }}>{convertDate(userInfo.details.dob)}</Text>
                </View>
                <View style={styles.row}>
                    <Icon name="email" color="#fff" size={20} />
                    <Text style={{ color: "#fff", marginLeft: 20, fontSize: 16 }}>{userInfo.details.email}</Text>
                </View>
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
                <Animatable.View animation="fadeInUpBig" style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    paddingHorizontal: 30,
                }}>
                    <View style={styles.infoBoxWrapper}>
                        <View style={[styles.infoBox, {
                            borderRightColor: '#dddddd',
                            borderRightWidth: 1
                        }]}>


                            <Title style={{ ...FONTS.body1, color: COLORS.primary }}>Classe</Title>
                            <Caption>{userInfo.details.level}</Caption>



                        </View>
                        <View style={styles.infoBox}>
                            <Title style={{ ...FONTS.body1, color: COLORS.primary }}>Date d'inscription</Title>
                            <Caption>{convertDate(userInfo.details.createdAt)}</Caption>
                        </View>
                    </View>
                    <View>
                        {Array.isArray(payments) && payments.length > 0 ? (
                            payments.map((payment) => (
                                <TouchableOpacity
                                    key={payment._id}
                                    style={{
                                        marginVertical: SIZES.base,
                                        width: SIZES.width / 1.2,

                                    }}

                                >
                                    <View
                                        style={{
                                            height: 130,
                                            borderTopLeftRadius: 20,
                                            borderTopRightRadius: 20,
                                            backgroundColor: COLORS.primary
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
                                                <Text style={{ ...FONTS.h5, color: COLORS.white }}>Montant Payé </Text>
                                                <Text style={{ ...FONTS.h4, color: COLORS.white }}>{payment.montant} </Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                                                <Text style={{ ...FONTS.h5, color: COLORS.white }}>Montant Restant </Text>
                                                <Text style={{ ...FONTS.h4, color: COLORS.white }}>{payment.formation.prix - payment.montant} </Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                                                <Text style={{ ...FONTS.h5, color: COLORS.white }}>Date de Paiement</Text>
                                                <Text style={{ ...FONTS.h4, color: COLORS.white }}>{convertDate(payment.updatedAt)} </Text>
                                            </View>
                                            <View style={{ height: 1, backgroundColor: COLORS.white }}></View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 5 }}>
                                                <Text style={{ ...FONTS.h5, color: COLORS.white }}>Montant Total </Text>
                                                <Text style={{ ...FONTS.h4, color: COLORS.white }}>{payment.formation.prix} </Text>
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
                                            {payment.formation.prix === payment.montant ?
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
                                        <Text style={{ ...FONTS.body4, color: COLORS.black }} numberOfLines={2}>{payment.formation.nom}</Text>


                                    </View>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={{ ...FONTS.body3, color: COLORS.black }}>No payment data available.</Text>
                        )}

                    </View>




                </Animatable.View>
            )}

        </ScrollView>
    );
};

export default Paiement;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
    },
    userInfoSection: {
        paddingHorizontal: 30,
        paddingVertical:10,
        
        marginBottom: 25,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
});
