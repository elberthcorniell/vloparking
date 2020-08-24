import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, StatusBar, Modal } from 'react-native';
import { styles } from '../style/styles'
import { AntDesign } from '@expo/vector-icons'
import * as Permissions from 'expo-permissions'
import * as  SecureStore from "expo-secure-store";
import MapView from 'react-native-maps';
import { API_HOST } from '../config';
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default class Maps extends React.Component {
    state = {
    }

    componentDidMount() {
        this.verifyAuth()
        this.getPermision()
    }
    async getPermision() {
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.modalState || false}
                onRequestClose={() => {
                    this.props.closeModal(); /*this.setInitialState()*/
                }}
            >
                <StatusBar barStyle="dark-content" backgroundColor="rgba(0,0,0,0.4)" />
                <View style={{
                    ...styles.container,
                    backgroundColor: 'rgba(0,0,0,0.4)'
                }}>
                    <View style={{ ...styles.modalView }}>
                        <TouchableOpacity
                            onPress={() => { this.props.closeModal(); /*this.setInitialState();*/ }}
                            style={{
                                margin: 10,
                                position: 'absolute',
                                top: 10,
                                right: 20,
                                zIndex: 2
                            }}
                        >
                            <Text><AntDesign name='close' size={20} color='#a1a1a1' /></Text>
                        </TouchableOpacity>
                        <View style={{ ...styles.qrContainer, marginTop: 20, borderRadius: 5, alignItems: 'center', height: screenHeight * 0.7 }}>
                            <Text style={styles.blueTitle}>Live Trip</Text>
                            {this.props.modalState && <MapView
                                showsUserLocation
                                loadingEnabled
                                initialRegion={{
                                    latitude: this.props.location.latitude || -19,
                                    longitude: this.props.location.longitude || 70,
                                    latitudeDelta: 0.0134,
                                    longitudeDelta: 0.0134
                                }}
                                region={this.state.region || {
                                    latitude: this.props.location.latitude || -19,
                                    longitude: this.props.location.longitude || 70,
                                    latitudeDelta: 0.0134,
                                    longitudeDelta: 0.0134
                                }}
                                onRegionChange={() => {
                                    this.setState({
                                        region: {
                                            latitude: this.props.location.latitude || -19,
                                            longitude: this.props.location.longitude || 70,
                                            latitudeDelta: 0.0134,
                                            longitudeDelta: 0.0134
                                        }
                                    })
                                }}
                                style={styles.mapContainer} />}
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

