import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator, BottomTabBar } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';
import { Home, SignUp, Welcome } from '../screens';
import { COLORS, icons } from "../constants";
import { createStackNavigator } from '@react-navigation/stack';
import DetailEvent from '../screens/Events/DetailEvent';
import Profile from '../screens/Profile';
import TimeTable from '../screens/TimeTable';
import Result from '../screens/Results/Result';
import Assignment from '../screens/Assignments/Assignment';
import Paiement from '../screens/Paiement';
import Rate from '../screens/Rate';
import Attendance from '../screens/Attendance/Attendance';
import Reclamation from '../screens/Reclamations/Reclamation';
import ReclamationList from '../screens/Reclamations/ReclamationsList';
import ViewAll from '../screens/Events/ViewAll';
import AssignmentDetail from '../screens/Assignments/AssignmentDetail';
import Announcement from '../screens/Announcements/Announcement';
import Search from '../screens/Search';
import AttendanceList from '../screens/Attendance/AttendanceList';
import AssignmentByClass from '../screens/Assignments/AssignmentByClass';
import AnnouncementByClass from '../screens/Announcements/AnnouncementByClass';
import AddAnnouncement from '../screens/Announcements/AddAnnouncement';
import InternsList from '../screens/InternsList';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const TabBarCustomButton = ({ accessibilityLabel, accessibilityState, children, onPress }) => {

    var isSelected = accessibilityState.selected

    if (isSelected) {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <View
                    style={{
                        flexDirection: 'row',
                        position: 'absolute',
                        top: 0
                    }}
                >
                    <View style={{ flex: 1, backgroundColor: COLORS.white }}></View>
                    <Svg
                        width={75}
                        height={61}
                        viewBox="0 0 75 61"
                    >
                        <Path
                            d="M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z"
                            fill={COLORS.white}
                        />
                    </Svg>
                    <View style={{ flex: 1, backgroundColor: COLORS.white }}></View>
                </View>

                <TouchableOpacity
                    style={{
                        top: -22.5,
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: COLORS.primary,
                        ...styles.shadow
                    }}
                    onPress={onPress}
                >
                    {children}
                </TouchableOpacity>
            </View>
        )
    } else {
        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 50,
                    height: 50,
                    backgroundColor: COLORS.white
                }}
                activeOpacity={1}
                onPress={onPress}
            >
                {children}
            </TouchableOpacity>
        )
    }
}
const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DetailEvent"
                component={DetailEvent}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ViewAll"
                component={ViewAll}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="TimeTable"
                component={TimeTable}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Attendance"
                component={Attendance}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AttendanceList"
                component={AttendanceList}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AssignmentByClass"
                component={AssignmentByClass}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Assignment"
                component={Assignment}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Announcement"
                component={Announcement}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AssignmentDetail"
                component={AssignmentDetail}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AnnouncementByClass"
                component={AnnouncementByClass}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="AddAnnouncement"
                component={AddAnnouncement}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Result"
                component={Result}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Paiement"
                component={Paiement}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Rate"
                component={Rate}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Reclamation"
                component={Reclamation}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ReclamationList"
                component={ReclamationList}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="InternsList"
                component={InternsList}
                options={{ headerShown: false }}
            />
           
        </Stack.Navigator>
    );
};
const Tabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: {
                    display: "none",
                },
                headerShown: false,
                style: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "transparent",
                    elevation: 0
                }
            }}>
            <Tab.Screen name='HomeTab' component={HomeStack} options={{
                tabBarIcon: ({ focused }) => (
                    <Image
                        source={icons.more}
                        resizeMode="contain"
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: focused ? COLORS.white : COLORS.secondary
                        }}
                    />
                ),
                tabBarButton: (props) => (
                    <TabBarCustomButton
                        {...props}
                    />
                )
            }} />
            <Tab.Screen name='Search' component={Search} options={{
                tabBarIcon: ({ focused }) => (
                    <Image
                        source={icons.search}
                        resizeMode="contain"
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: focused ? COLORS.white : COLORS.secondary
                        }}
                    />
                ),
                tabBarButton: (props) => (
                    <TabBarCustomButton
                        {...props}
                    />


                ),
            }} />
            <Tab.Screen name='Profil' component={Profile} options={{
                tabBarIcon: ({ focused }) => (
                    <Image
                        source={icons.user}
                        resizeMode="contain"
                        style={{
                            width: 25,
                            height: 25,
                            tintColor: focused ? COLORS.white : COLORS.secondary
                        }}
                    />
                ),
                tabBarButton: (props) => (
                    <TabBarCustomButton
                        {...props}
                    />


                ),

            }} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: COLORS.primary,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5
    }
})

export default Tabs;
