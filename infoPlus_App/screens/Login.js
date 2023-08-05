import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform, Text, TouchableOpacity, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { StyledContainer, InnerContainer, PageLogo, PageTitle, SubTitle, StyledFormArea, LeftIcon, StyledInputLabel, StyledTextInput, StyledButton, ButtonText, MsgBox, Line, RightIcon, ExtraText, ExtraView, TextLinkContent, TextLink, Colors } from '../components/styles';
import { Formik } from 'formik';
//Colors
const { brand, darkLight, primary } = Colors;
import KeyboardAvoiding from '../components/KeyboardAvoiding';
//icons
import { Ionicons, Octicons, Fontisto } from '@expo/vector-icons';
import { TextInput } from 'react-native-gesture-handler';
import { AuthContext } from '../context/AuthContext';


const Login = ({ navigation }) => {
    const { loggedIn } = useContext(AuthContext)


    const [data, setData] = React.useState({
        login: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });

    const textInputChange = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                login: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                login: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    };
    const handlePasswordChange = (val) => {
        if (val.trim().length >= 6) {
            setData({
                ...data,
                password: val,
                isValidPassword: true,
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false,
            });
        }
    };
    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if (val.trim().length >= 4) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }
    // const loginHandler=()=>{
    //     dispatch(auth(login,password));
    //     console.log("Login");
    //     //console.log(login,password);
    // }

    return (
        <KeyboardAvoiding>
            <View style={styles.container}>
                <StatusBar backgroundColor={brand} barStyle="light-content" />
                <View style={styles.header}>
                    <Animatable.Image
                        animation="bounceIn"
                        duration={1500}
                        style={styles.logo}
                        resizeMode="stretch" source={require('../assets/images/login-image.png')} />

                    <Text style={styles.text_header} >Bienvenue !</Text>
                    <Text style={styles.text}>Connectez-vous pour continuer</Text>

                </View>
                <Animatable.View animation="fadeInUpBig"
                    style={[styles.footer, {}]}>
                    <Text style={styles.text_footer}>Login</Text>
                    <View style={styles.action}>
                        <FontAwesome name='user-o' color='#05375a' size={20} />
                        <TextInput placeholder='Votre Login'
                            style={styles.textInput}
                            autoCapitalize='none'
                            onChangeText={(val) => textInputChange(val)}
                            onEndEditing={(e) => handleValidUser(e.nativeEvent.text)}
                            value={data.login} />

                        {data.check_textInputChange ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            : null}

                    </View>
                    {data.isValidUser ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Le login doit comporter 4 caractères.</Text>
                        </Animatable.View>
                    }
                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Mot de passe</Text>
                    <View style={styles.action}>
                        <Feather name='lock' color='#05375a' size={20} />
                        <TextInput placeholder='Votre mot de passe'
                            style={styles.textInput}
                            autoCapitalize='none'
                            secureTextEntry={data.secureTextEntry ? true : false}
                            onChangeText={(val) => handlePasswordChange(val)}
                            value={data.password}
                        />

                        <TouchableOpacity
                            onPress={updateSecureTextEntry}
                        >
                            {data.secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={20}
                                />
                                :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={20}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    {data.isValidPassword ? null :
                        <Animatable.View animation="fadeInLeft" duration={500}>
                            <Text style={styles.errorMsg}>Le mot de passe doit comporter 6 caractères.</Text>
                        </Animatable.View>
                    }
                    <TouchableOpacity>
                        {/* <Text style={{ color: '#345fb4', marginTop: 15 }}>Mot de passe oublié?</Text> */}
                    </TouchableOpacity>
                    <View style={styles.button}>
                        <TouchableOpacity onPress={() => loggedIn(data.login, data.password)} style={styles.signIn}>
                            <LinearGradient colors={['#345fb4', '#89cff0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.signIn}>
                                <Text style={[styles.textSign, { color: '#fff' }]}>Se connecter</Text>

                            </LinearGradient>
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                            onPress={() => navigation.navigate('SignUp')}
                            style={[styles.signIn, {
                                borderColor: brand,
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: brand,
                            }]}>Login en tant qu'enseignant </Text>
                        </TouchableOpacity> */}
                    </View>
                </Animatable.View>


            </View>
        </KeyboardAvoiding>



    );
};
const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={25} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={25} color={darkLight} />
                </RightIcon>)}
        </View>
    )

}
const { height } = Dimensions.get("screen");
const height_logo = height * 0.3;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#345fb4',

    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 30,

    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30,


    },
    logo: {
        width: '100%',
        height: height_logo,
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: '#fff',
        marginTop: 2,
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18,
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 35,
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default Login;


{/* <StyledContainer>
<StatusBar style="dark" />
<InnerContainer>
    <PageLogo resizeMode="cover" source={require('./../assets/white-logo2.png')} />
    <PageTitle>INFOplus</PageTitle>
    <SubTitle>Account Login</SubTitle>

    <Formik initialValues={{ email: '', password: '' }}
        onSubmit={(values) => {
            console.log(values);
            navigation.navigate("Welcome");
        }}>{({ handleChange, handleBlur, handleSubmit, values }) =>
        (<StyledFormArea>
            <MyTextInput
                label="Email Address"
                icon="mail"
                placeholder="example@gmail.com"
                placeholderTextColor={darkLight}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address" />

            <MyTextInput
                label="Password"
                icon="lock"
                placeholder="* * * * * * * *"
                placeholderTextColor={darkLight}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry={hidePassword}
                isPassword={true}
                hidePassword={hidePassword}
                setHidePassword={setHidePassword} />
            <MsgBox>...</MsgBox>
            <StyledButton onPress={handleSubmit}>
                <ButtonText>
                    Login
                </ButtonText>
            </StyledButton>
            <Line />
            <StyledButton google={true} onPress={handleSubmit}>
                <Fontisto name="google" color={primary} size={25} />
                <ButtonText google={true}>Sign in with Google </ButtonText>
            </StyledButton>
            <ExtraView>
                <ExtraText>
                    Don't have an account already?
                </ExtraText>
                <TextLink onPress={() => navigation.navigate("SignUp")}>
                    <TextLinkContent>
                        Sign Up
                    </TextLinkContent>
                </TextLink>

            </ExtraView>
        </StyledFormArea>)}


    </Formik>
</InnerContainer>

</StyledContainer> */}
