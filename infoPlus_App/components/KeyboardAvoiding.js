import { KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React from 'react';


const KeyboardAvoiding = ({ children }) => {
    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff', }}>
            <ScrollView>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {children}
                </TouchableWithoutFeedback>

            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default KeyboardAvoiding;