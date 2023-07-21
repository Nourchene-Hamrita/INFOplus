import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Login, SignUp, Welcome } from '../screens';
const { primary } = Colors;
import { Colors } from '../components/styles';
const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      headerStyle: { backgroundColor: 'transparent' },
      headerTintColor: primary,
      headerTransparent: true,
      headerTitle: '',
      headerLeftContainerStyle: {
        paddingLeft: 20,
      }
    }} initialRouteName='Welcome' >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      {/* <Stack.Screen name="signup" component={SignUp} /> */}
    </Stack.Navigator>
  );
};

export default AuthStack;