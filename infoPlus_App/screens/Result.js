import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-animatable';
import { COLORS } from '../constants';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';

const Result = () => {
    const { userInfo } = useContext(AuthContext);
    const [formations, setFormations] = useState([]); // State variable to store formations
    const [selectedFormation, setSelectedFormation] = useState(null); // State variable to store selected formation
    const pickerRef = useRef();

    function open() {
        pickerRef.current.focus();
    }

    function close() {
        pickerRef.current.blur();
    }

    useEffect(() => {
        // Check if userInfo.details and userInfo.details.formations exist
        if (userInfo && userInfo.details && userInfo.details.formations) {
            // Make sure userInfo.details.formations is an array
            if (Array.isArray(userInfo.details.formations)) {
                setFormations(userInfo.details.formations);
                console.log(userInfo.details.formations); // Check the fetched formations in the console
                setSelectedFormation(userInfo.details.formations[0]?._id); // Set the default selected formation
            } else {
                console.log('Formations data is not an array:', userInfo.details.formations);
            }
        } else {
            console.log('Formations data is missing in userInfo:', userInfo);
        }
    }, [userInfo]);

    return (
        <View>
            {/* ComboBox to display formations */}
            <View style={styles.comboBoxContainer}>
                <Picker
                    selectedValue={selectedFormation}
                    onValueChange={(itemValue, itemIndex) => setSelectedFormation(itemValue)}
                >
                    {formations.map((formation) => (
                        <Picker.Item key={formation._id} label={formation.nom} value={formation._id} />
                    ))}
                </Picker>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    comboBoxContainer: {
        borderColor: COLORS.gray,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default Result;
