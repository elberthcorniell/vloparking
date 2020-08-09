import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { styles } from '../style/styles'
import { AntDesign } from '@expo/vector-icons'
import * as Permissions from 'expo-permissions'
import * as  SecureStore from "expo-secure-store";
import MapView from 'react-native-maps';
import { API_HOST } from '../config';

export default class Maps extends React.Component {
    state = {
    }

    componentDidMount() {
        this.verifyAuth()
        this.getPersion()
    }
    async getPersion() {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                locationResult: 'Permission to access location was denied',
            });
        } else {
            this.setState({ hasLocationPermissions: true });
        }
    }
    verifyAuth() {
        SecureStore.getItemAsync('authtoken').then((token) => {
            fetch(`${API_HOST}/api/validate/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': token
                }
            })
                .then(res => res.json())
                .then((data) => {
                    if (!data.success) {
                        this.props.navigation.replace('Login')
                    }
                })
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <MapView
                    showsUserLocation
                    initialRegion={{
                        latitude: 19.2,
                        longitude: -70.5,
                        latitudeDelta: 0.0134,
                        longitudeDelta: 0.0134
                    }}
                    style={styles.mapContainer} />
            </View>
        );
    }
}

