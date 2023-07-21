import React, { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, TouchableOpacity } from 'react-native';
import { StyledContainer, InnerContainer, PageLogo, PageTitle, SubTitle, StyledFormArea, LeftIcon, StyledInputLabel, StyledTextInput, StyledButton, ButtonText, MsgBox, Line, RightIcon, ExtraText, ExtraView, TextLinkContent, TextLink, Colors } from '../components/styles';
import { Formik } from 'formik';
//Colors
const { brand, darkLight, primary } = Colors;
import DateTimePicker from '@react-native-community/datetimepicker';
//icons
import { Ionicons, Octicons, Fontisto } from '@expo/vector-icons';
import KeyboardAvoiding from '../components/KeyboardAvoiding';
import { AuthContext } from '../context/AuthContext';



const SignUp = ({ navigation }) => {
    const { logout } = useContext(AuthContext);
    const [hidePassword, setHidePassword] = useState(true);
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date(2000, 0, 1));

    const [dob, setDob] = useState();

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(false);
        setDate(currentDate);
        setDob(currentDate);

    }
    const showDatePicker = () => {
        setShow(true);
    }
    return (
        <KeyboardAvoiding>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    {/* <PageLogo resizeMode="cover" source={require('./../assets/white-logo2.png')} /> */}
                    <PageTitle>INFOplus</PageTitle>
                    <SubTitle>Account Sign Up</SubTitle>
                    {show && (
                        <DateTimePicker
                            testID='dateTimePicker'
                            value={date}
                            mode='date'
                            is24Hour={true}
                            display="default"
                            onChange={onChange} />
                    )}

                    <Formik initialValues={{ fullName: '', email: '', dateOfBirth: '', password: '', confirmPassword: '' }}
                        onSubmit={(values) => {
                            console.log(values);
                            navigation.navigate('Login');
                        }}>{({ handleChange, handleBlur, handleSubmit, values }) =>
                        (<StyledFormArea>
                            <MyTextInput
                                label="Full Name"
                                icon="person"
                                placeholder="example"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('fullName')}
                                onBlur={handleBlur('fullName')}
                                value={values.email}
                            />
                            <MyTextInput
                                label="Email Address"
                                icon="mail"
                                placeholder="example@gmail.com"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                keyboardType="email-address"
                            />
                            <MyTextInput
                                label="Date of Birth"
                                icon="calendar"
                                placeholder="YYYY - MM - DD"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('dateOfBirth')}
                                onBlur={handleBlur('dateOfBirth')}
                                value={dob ? dob.toDateString() : ''}
                                isDate={true}
                                editable={false}
                                showDatePicker={showDatePicker}
                            />


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
                            <MyTextInput
                                label="Confirm Password"
                                icon="lock"
                                placeholder="* * * * * * * *"
                                placeholderTextColor={darkLight}
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                value={values.password}
                                secureTextEntry={hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword={setHidePassword} />
                            <MsgBox>...</MsgBox>
                            <StyledButton onPress={() => { logout() }}>
                                <ButtonText>
                                    Login
                                </ButtonText>
                            </StyledButton>
                            <Line />
                            <ExtraView>
                                <ExtraText>
                                    Already have an account?
                                </ExtraText>
                                <TextLink onPress={() => navigation.navigate('Login')}>
                                    <TextLinkContent>
                                        Login
                                    </TextLinkContent>
                                </TextLink>

                            </ExtraView>
                        </StyledFormArea>)}


                    </Formik>
                </InnerContainer>

            </StyledContainer>
        </KeyboardAvoiding>


    );
};
const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, isDate, showDatePicker, ...props }) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={25} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            {!isDate && <StyledTextInput {...props} />}
            {isDate && <TouchableOpacity onPress={showDatePicker}>
                <StyledTextInput {...props} /></TouchableOpacity>}
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'md-eye-off' : 'md-eye'} size={25} color={darkLight} />
                </RightIcon>)}
        </View>
    )

}



export default SignUp;
