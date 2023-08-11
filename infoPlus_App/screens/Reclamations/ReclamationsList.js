import React, { useEffect, useRef, useContext } from 'react'
import { Dimensions, FlatList, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import * as Animatable from 'react-native-animatable'
import { Animations } from '../../constants/Animations'
import Entypo from 'react-native-vector-icons/Entypo';
import { COLORS } from '../../constants';
import { AuthContext } from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import { BASE_URL } from '../../utils/config';
import { formatDate } from '../../utils/date';

const ReclamationItem = ({ item: { subject, description, state, date }, index, animation }) => {
    let stateText = "";
    let stateColor = COLORS.gray; // Default color

    if (state === "Pending") {
        stateText = "En attente";
        stateColor = COLORS.red;
    } else if (state === "In Progress") {
        stateText = "En cours";
        stateColor = COLORS.blue;
    } else if (state === "Resolved") {
        stateText = "Résolu";
        stateColor = COLORS.green;
    }


    return (
        <Animatable.View animation={animation} duration={1000} delay={index * 300}>
            <TouchableOpacity style={styles.item}>
                <View style={styles.avatar}>
                    <Text style={styles.letter}>{subject.slice(0, 1).toUpperCase()}</Text>
                </View>
                <View style={styles.details}>
                    <View style={styles.rowContainer}>
                        <Text style={styles.name}>{subject}</Text>
                        <Text style={[styles.number, { color: stateColor }]}>{stateText}</Text>
                    </View>
                    <View style={{ flexDirection: 'column' }}>
                        <Text numberOfLines={1}>{description}</Text>
                        <Text >{formatDate(date)}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animatable.View>
    );
}

export default function ReclamationList({ route, navigation }) {
    const { userInfo } = useContext(AuthContext);
    const { data, loading, error } = useFetch(
        `${BASE_URL}/reclamations/getReclamationsByUserId/${userInfo.details._id}`
    );
    console.log(data)
    const viewRef = useRef(null);
    const animation = Animations[Math.floor(Math.random() * Animations.length)]
    console.log(animation);
    const ItemSeparator = () => <View style={styles.separator} />

    const renderItem = ({ item, index }) => (
        <ReclamationItem item={item} index={index} animation={animation} />)

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
                    Liste Vide!
                </Animatable.Text>
            </Animatable.View>
        )
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            viewRef.current.animate({ 0: { opacity: 0.5, }, 1: { opacity: 1 } });
        })
        // ToastAndroid.show(animation+ ' Animation', ToastAndroid.SHORT);
        return () => unsubscribe;
    }, [navigation])
    return (
        <View style={[styles.container]}>
            <View style={styles.header}>
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
                <View style={{ flex: 1, alignItems: 'center', marginRight: 20 }}>
                    <Text style={styles.headerText}>Mes Réclamations</Text>
                </View>

            </View>
            <Animatable.View style={{
                flex: 1,
                backgroundColor: '#fff',
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
                paddingVertical: 40,
                paddingHorizontal: 5,
            }} animation="fadeInUpBig">
                <Animatable.View
                    ref={viewRef}
                    easing={'ease-in-out'}
                    duration={500}>
                    <FlatList
                        data={data}
                        keyExtractor={(_, i) => String(i)}
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={ItemSeparator}
                        ListEmptyComponent={ListEmptyComponent}
                    />
                </Animatable.View>
            </Animatable.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primary
    },
    item: {
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    header: {
        height: 70,
        width: '100%',
        alignItems: 'center', // Align header contents to the center
        paddingHorizontal: 10,
        flexDirection: 'row', // Display the icon and text in a row
        paddingTop: 20,

    },
    headerText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 7, // Add some spacing between the icon and the text
    },
    avatar: {
        height: 36,
        width: 36,
        borderRadius: 18,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    letter: {
        color: 'white',
        fontWeight: 'bold',
    },
    details: {
        flex: 1,
        justifyContent: 'space-between',
        margin: 10
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'black',
    },
    number: {
        fontSize: 14,
        color: COLORS.darkgray,

    },
    description: {
        color: COLORS.lightGray,
    },
    date: {

        color: COLORS.lightGray,
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

});