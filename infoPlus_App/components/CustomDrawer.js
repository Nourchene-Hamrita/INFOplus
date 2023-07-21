import React, { useContext } from 'react';
import {
    View,
    Text,
    ImageBackground,
    Image,
    TouchableOpacity,
} from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../constants';

const CustomDrawer = props => {
    const { logout } = useContext(AuthContext);
    const { userInfo } = useContext(AuthContext);
    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ backgroundColor: '#345fb4' }}>
                <ImageBackground
                    source={require('../assets/images/background.jpg')}
                    style={{ padding: 20 }}>
                    <Image
                        source={require('../assets/images/user.jpg')}
                        style={{ height: 80, width: 80, borderRadius: 40, marginBottom: 10 }}
                    />
                    <Text
                        style={{
                            color: '#fff',
                            fontSize: 18,
                            fontFamily: 'Roboto-Medium',
                            marginBottom: 5,
                        }}>
                        {userInfo.details.firstName} {userInfo.details.lastName}
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                        {userInfo.role !== 'intern' ? (
                            <Text
                                style={{
                                    color: '#fff',
                                    fontFamily: 'Roboto-Regular',
                                    marginRight: 5,
                                }}>
                                Profil : {userInfo.details.profil}
                            </Text>
                        ) : (
                            <Text
                                style={{
                                    color: '#fff',
                                    fontFamily: 'Roboto-Regular',
                                    marginRight: 5,
                                }}>
                                Niveau : {userInfo.details.level}
                            </Text>
                        )}
                        <FontAwesome5 name="user-graduate" size={14} color="#fff" />
                    </View>
                </ImageBackground>
                <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 10 }}>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: '#ccc' }}>
                <TouchableOpacity onPress={() => { }} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="share-social-outline" size={22} color={COLORS.primary} />
                        <Text
                            style={{
                                fontSize: 15,
                                fontFamily: 'Roboto-Medium',
                                marginLeft: 5,
                                color: COLORS.primary
                            }}>
                            Partager
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { logout() }} style={{ paddingVertical: 15 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <Ionicons name="exit-outline" size={22} color={COLORS.red} />
                        <Text
                            style={{
                                fontSize: 15,
                                fontFamily: 'Roboto-Medium',
                                marginLeft: 5,
                                color: COLORS.red

                            }}>
                            Se Déconnecter
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CustomDrawer;