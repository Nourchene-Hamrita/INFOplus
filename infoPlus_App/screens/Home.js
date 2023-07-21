import React, { useState, useContext } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity
} from "react-native";
import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import { AuthContext } from '../context/AuthContext';
import useFetch from '../hooks/useFetch';
import { BASE_URL } from '../utils/config';

const Home = ({ navigation }) => {
    const { userInfo } = useContext(AuthContext);
    const { data, loading, error } = useFetch(
        `${BASE_URL}/events`
    );
    console.log(data)
    const featuresData = [
        {
            id: 1,
            icon: icons.reload,
            color: COLORS.red,
            backgroundColor: COLORS.lightRed,
            description: "Top Up"
        },
        {
            id: 2,
            icon: icons.timeTable,
            color: COLORS.white,
            backgroundColor: COLORS.blue,
            description: "Emploi du temps"
        },

        {
            id: 4,
            icon: icons.assignment,
            color: COLORS.red,
            backgroundColor: COLORS.lightRed,
            description: "Devoirs"
        },
        {
            id: 5,
            icon: icons.result,
            color: COLORS.white,
            backgroundColor: COLORS.blue,
            description: "Résultat"
        },

        {
            id: 6,
            icon: icons.bill,
            color: COLORS.white,
            backgroundColor: COLORS.blue,
            description: "Paiement"
        },
        {
            id: 7,
            icon: icons.rating,
            color: COLORS.red,
            backgroundColor: COLORS.lightRed,
            description: "Avis"
        },

        {
            id: 8,
            icon: icons.send,
            color: COLORS.white,
            backgroundColor: COLORS.blue,
            description: "Demande"
        },
        {
            id: 9,
            icon: icons.more,
            color: COLORS.red,
            backgroundColor: COLORS.lightRed,
            description: "Plus"
        },
    ];
    // const specialPromoData = [
    //     {
    //         id: 1,
    //         img: images.promoBanner,
    //         title: "Event Test1",
    //         description: "Don't miss it. Grab it now!"
    //     },
    //     {
    //         id: 2,
    //         img: images.promoBanner,
    //         title: "Event Test2",
    //         description: "Don't miss it. Grab it now!"
    //     },
    //     {
    //         id: 3,
    //         img: images.promoBanner,
    //         title: "Event Test3",
    //         description: "Don't miss it. Grab it now!"
    //     },
    //     {
    //         id: 4,
    //         img: images.promoBanner,
    //         title: "Event Test4",
    //         description: "Don't miss it. Grab it now!"
    //     },
    // ];


    const [features, setFeatures] = useState(featuresData);
    //const [specialPromos, setSpecialPromos] = useState(specialPromoData);

    function renderHeader() {
        return (
            <View style={{ flexDirection: 'row', marginVertical: SIZES.padding * 2 }}>
                <View style={{ flex: 1, marginTop: 10 }}>
                    <Text style={{ ...FONTS.h1, color: COLORS.primary }}>Bonjour!</Text>
                    <Text style={{ ...FONTS.body2, color: COLORS.gray }}>{userInfo.details.firstName} {userInfo.details.lastName} </Text>
                    <View>

                        {userInfo.role !== 'intern' ? (
                            <>
                                <Text style={{ ...FONTS.body2, color: COLORS.blue }}>Specialté: {userInfo.details.specialty}</Text>
                                <View
                                    style={{
                                        height: 30,
                                        width: 90,
                                        marginBottom: 5,
                                        borderRadius: 20,
                                        backgroundColor: COLORS.lightRed,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Text style={{ ...FONTS.body2, color: COLORS.red }}>Profil: {userInfo.details.profil}</Text>
                                </View>
                            </>
                        ) : (
                            <>
                                <Text style={{ ...FONTS.body2, color: COLORS.blue }}>Classe : {userInfo.details.level}</Text>
                                <View
                                    style={{
                                        height: 30,
                                        width: 90,
                                        marginBottom: 5,
                                        borderRadius: 20,
                                        backgroundColor: COLORS.lightRed,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Text style={{ ...FONTS.body2, color: COLORS.red }}>{userInfo.details.promotion}</Text>
                                </View>
                            </>
                        )}
                    </View>
                </View>


                <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}
                        style={{
                            height: 40,
                            width: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: COLORS.lightGray
                        }}
                    >
                        <Image
                            source={icons.bell}
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: COLORS.secondary
                            }}
                        />
                        <View
                            style={{
                                position: 'absolute',
                                top: -5,
                                right: -5,
                                height: 10,
                                width: 10,
                                backgroundColor: COLORS.red,
                                borderRadius: 5
                            }}
                        >
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
    function renderBanner() {
        return (

            <View
                style={{
                    height: 150,
                    borderRadius: 20,
                }}
            >

                <Image
                    source={images.focus}
                    resizeMode="cover"
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 20
                    }}
                />
            </View>
        )
    };
    function renderFeatures() {

        const Header = () => (
            <View style={{ marginBottom: SIZES.padding * 2 }}>
                <Text style={{ ...FONTS.h3, color: COLORS.blue }}>Explorer</Text>
            </View>
        )

        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{ marginBottom: SIZES.padding * 2, width: 60, alignItems: 'center' }}
                onPress={() => console.log(item.description)}
            >
                <View
                    style={{
                        height: 60,
                        width: 60,
                        marginBottom: 5,
                        borderRadius: 20,
                        backgroundColor: item.backgroundColor,
                        alignItems: 'center',
                        justifyContent: 'center',
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
                    <Image
                        source={item.icon}
                        resizeMode="contain"
                        style={{
                            height: 30,
                            width: 30,
                            tintColor: item.color
                        }}
                    />
                </View>
                <Text style={{ textAlign: 'center', flexWrap: 'wrap', ...FONTS.body5, color: COLORS.gray }}>{item.description}</Text>
            </TouchableOpacity>
        )

        return (
            <FlatList
                ListHeaderComponent={Header}
                data={features}
                numColumns={4}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                keyExtractor={item => `${item.id}`}
                renderItem={renderItem}
                style={{ marginTop: SIZES.padding * 2 }}
            />
        )
    }


    function renderPromos() {

        const HeaderComponent = () => (
            <View>
                {renderHeader()}
                {renderBanner()}
                {renderFeatures()}
                {renderPromoHeader()}

            </View>
        )
        const renderPromoHeader = () => (
            <View
                style={{
                    flexDirection: 'row',
                    marginBottom: SIZES.padding
                }}
            >
                <View style={{ flex: 1 }}>
                    <Text style={{ ...FONTS.h3, color: COLORS.blue }}>Evènements</Text>
                </View>
                <TouchableOpacity
                    onPress={() => console.log("View All")}
                >
                    <Text style={{ color: COLORS.gray, ...FONTS.body4 }}>Tout voir </Text>
                </TouchableOpacity>
            </View>

        )
        const renderItem = ({ item }) => {
            // Check if eventPictures array exists and is not empty
            const eventPicture = item.eventPictures && item.eventPictures.length > 0 ? item.eventPictures[0] : null;

            return (
                <TouchableOpacity
                    style={{
                        marginVertical: SIZES.base,
                        width: SIZES.width / 2.5
                    }}
                    onPress={() => navigation.navigate('DetailEvent', { eventId: item._id })}
                >
                    <View
                        style={{
                            height: 80,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            backgroundColor: COLORS.primary
                        }}
                    >
                        {eventPicture ? ( // Render the image if eventPicture exists
                            <Image
                                source={{ uri: eventPicture }} // Use the "uri" property for the image URL
                                resizeMode="cover"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20
                                }}
                            />
                        ) : (
                            <View
                                style={{ // Render a placeholder view if eventPicture is null
                                    width: "100%",
                                    height: "100%",
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    backgroundColor: COLORS.lightGray
                                }}
                            />
                        )}
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
                        <Text style={{ ...FONTS.h4, color: COLORS.black }} numberOfLines={1}>{item.title}</Text>
                        <Text style={{ ...FONTS.body4, color: COLORS.black }} numberOfLines={2}>{item.description}</Text>
                    </View>
                </TouchableOpacity>
            );
        };

        return (
            <FlatList
                ListHeaderComponent={HeaderComponent}
                contentContainerStyle={{ paddingHorizontal: SIZES.padding * 3 }}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                data={data}
                keyExtractor={item => `${item._id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={{ marginBottom: 80 }}>
                    </View>
                } />
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
            {renderPromos()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({})

export default Home;
