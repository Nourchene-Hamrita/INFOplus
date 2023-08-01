import React, { useContext } from 'react';
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
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


const Profile = ({ navigation }) => {
    const { userInfo } = useContext(AuthContext);

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
                    }}>Mon Profil</Text>
                </View>
            </View>



            <View style={styles.userInfoSection}>
                <View style={{ flexDirection: 'row', marginTop: 15 }}>
                    <Avatar.Image
                        source={user}
                        size={80}
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
            <View style={{
                flex: 1,
                backgroundColor: '#fff',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingVertical: 60,
                paddingHorizontal: 20,
            }}>
                <View style={styles.infoBoxWrapper}>
                    <View style={[styles.infoBox, {
                        borderRightColor: '#dddddd',
                        borderRightWidth: 1
                    }]}>
                        {userInfo.role !== 'intern' ? (<>
                            <Title style={{ ...FONTS.body1, color: COLORS.primary }}>Spécialité</Title>
                            <Caption>{userInfo.details.specialty}</Caption></>) :
                            (<> <Title style={{ ...FONTS.body1, color: COLORS.primary }}>Classe</Title>
                                <Caption>{userInfo.details.level}</Caption></>
                            )}

                    </View>
                    <View style={styles.infoBox}>
                        <Title style={{ ...FONTS.body1, color: COLORS.primary }}>Date d'inscription</Title>
                        <Caption>{convertDate(userInfo.details.createdAt)}</Caption>
                    </View>
                </View>

                <View style={styles.menuWrapper}>
                    <TouchableRipple onPress={() => { }}>
                        <View style={styles.menuItem}>
                            <Icon name="school-outline" color={COLORS.primary} size={25} />
                            <Text style={styles.menuItemText}>Résultat</Text>
                        </View>
                    </TouchableRipple>
                    {userInfo.role !== 'intern' ? (<>
                        <TouchableRipple onPress={() => { navigation.navigate('TimeTable') }}>
                            <View style={styles.menuItem}>

                                <Icon name="calendar-multiselect" color={COLORS.primary} size={25} />
                                <Text style={styles.menuItemText}>Emploi du temps</Text>
                            </View>
                        </TouchableRipple>
                    </>)
                        : (<><TouchableRipple onPress={() => { }}>
                            <View style={styles.menuItem}>
                                <Icon name="calendar-multiselect" color={COLORS.primary} size={25} />
                                <Text style={styles.menuItemText}>Absences</Text>
                            </View>
                        </TouchableRipple>
                        </>)}


                    {userInfo.role !== 'intern' ? (<>

                        <TouchableRipple onPress={() => { navigation.navigate('Rate') }}>
                            <View style={styles.menuItem}>
                                <Icon name="account-star-outline" color={COLORS.primary} size={25} />
                                <Text style={styles.menuItemText}>Avis</Text>
                            </View>
                        </TouchableRipple>
                    </>)
                        : (<TouchableRipple onPress={() => { }}>
                            <View style={styles.menuItem}><> <Icon name="credit-card" color={COLORS.primary} size={25} />
                                <Text style={styles.menuItemText}>Paiement</Text></>

                            </View>
                        </TouchableRipple>
                        )}

                    <TouchableRipple onPress={() => navigation.navigate('ReclamationList')}>
                        <View style={styles.menuItem}>
                            <Icon name="account-check-outline" color={COLORS.primary} size={25} />
                            <Text style={styles.menuItemText}>Réclamations</Text>
                        </View>
                    </TouchableRipple>
                    {/* <TouchableRipple onPress={() => { }}>
                        <View style={styles.menuItem}>
                            <Icon name="cog" color={COLORS.primary} size={25} />
                            <Text style={styles.menuItemText}>Paramètres</Text>
                        </View>
                    </TouchableRipple> */}
                </View>
            </View>
        </ScrollView>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary,
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
});
