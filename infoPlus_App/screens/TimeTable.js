import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Dimensions, View, Text, ActivityIndicator } from 'react-native';
import Pdf from 'react-native-pdf';
import axios from 'axios';
import { BASE_URL } from '../utils/config';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../constants';

const TimeTable = () => {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useContext(AuthContext);

    useEffect(() => {
        // Fetch the PDF URL from the API
        axios.get(`${BASE_URL}/interns/${userInfo.details._id}/timetables`)
            .then(response => {
                // Get the first timetable from the response
                const firstTimetable = response.data.timetables[0];
                setPdfUrl(firstTimetable.pdfUrl);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <View style={styles.container}>
            <ActivityIndicator size='large' color={COLORS.primary} />
            <Text>Loading...</Text></View>;
    }

    if (!pdfUrl) {
        return <View style={styles.container}><Text>Error loading PDF</Text></View>;
    }

    const source = { uri: pdfUrl, cache: true };

    return (
        <View style={styles.container}>
            <Pdf
                trustAllCerts={false}
                source={source}
                onLoadComplete={(numberOfPages, filePath) => {
                    console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                    console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                    console.log(error);
                }}
                onPressLink={(uri) => {
                    console.log(`Link pressed: ${uri}`);
                }}
                style={styles.pdf}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    }
});

export default TimeTable;
