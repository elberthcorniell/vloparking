import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, StatusBar, Modal, TouchableOpacityBase } from 'react-native';
import { styles } from '../style/styles'
import { AntDesign } from '@expo/vector-icons'
import * as Permissions from 'expo-permissions'
import * as  SecureStore from "expo-secure-store";
import MapView, { Marker } from 'react-native-maps';
import { API_HOST } from '../config';
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default class Maps extends React.Component {
    state = {
    }

    componentDidMount() {
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
                                    latitudeDelta: 0.0015,
                                    longitudeDelta: 0.0015
                                }}
                                region={this.state.region || {
                                    latitude: this.props.location.latitude || -19,
                                    longitude: this.props.location.longitude || 70,
                                    latitudeDelta: 0.0015,
                                    longitudeDelta: 0.0015
                                }}
                                onRegionChange={() => {
                                    this.setState({
                                        region: {
                                            latitude: this.props.location.latitude || -19,
                                            longitude: this.props.location.longitude || 70,
                                            latitudeDelta: 0.0015,
                                            longitudeDelta: 0.0015
                                        }
                                    })
                                }}
                                style={styles.mapContainer}>
                                <Marker
                                    key="car"
                                    coordinate={{
                                        latitude: this.props.carLocation.latitude || -19,
                                        longitude: this.props.carLocation.longitude || 70,
                                    }}
                                >
                                    <Text>🚗</Text>
                                </Marker>
                                <Marker
                                    key="key"
                                    coordinate={{
                                        latitude: this.props.keyLocation.latitude || -19,
                                        longitude: this.props.keyLocation.longitude || 70,
                                    }}
                                >
                                    <Text>🔑</Text>
                                </Marker>
                                <Marker
                                    key="velet"
                                    coordinate={{
                                        latitude: this.props.valetLocation.latitude || -19,
                                        longitude: this.props.valetLocation.longitude || 70,
                                    }}
                                >
                                    <Text>🤵</Text>
                                </Marker>
                            </MapView>

                            }
                        </View>
                        <TouchableOpacity
                            onPress={()=>{
                                this.props.askForCar()
                            }}
                        >
                            <View style={styles.buttonBlue}>
                                <Text>I Need My Car</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}

