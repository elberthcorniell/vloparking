import * as React from 'react';
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Image,
    StatusBar,
    ScrollView,
    Animated,
    Alert
} from 'react-native';
import { styles } from '../style/styles'
import { AntDesign } from '@expo/vector-icons'
import * as  SecureStore from "expo-secure-store";
import { API_HOST } from '../config'
import SettingButton from '../components/settingButton'
import QRScreen from './QRScreen'
import Maps from './Maps'
import io from 'socket.io-client'
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager'
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
let socket
export default class Home extends React.Component {
    state = {
        userMap: [
            { text: 'LINK', description: 'Chainlink', icon: <Image source={{ uri: 'https://inverte.io/assets/images/LINK.png' }} style={{ height: 35, width: 35 }} />, margin: 40 },
        ],
        scrollPosition: { x: 0, y: 0 },
        scrollY: new Animated.Value(0),
        modalState: false,
        location: {
            longitude: -19,
            latitude: 70
        },
        carLocation: {
            longitude: -19,
            latitude: 70
        },
        valetLocation: {
            longitude: -19,
            latitude: 70
        },
        keyLocation: {
            longitude: -19,
            latitude: 70
        },
        businessLocation: {
            longitude: -19,
            latitude: 70
        }
    }

    componentDidMount() {
        this.verifyAuth()
        socket = io(`${API_HOST}/`)
        socket.on('valetLocation', valetLocation => {
            this.setState({
                valetLocation
            })
        })
    }
    askForCar() {
        socket.emit('askForCar', {
            tripId: this.state.tripId
        })
    }
    askForLocationPermissions = async (callback) => {
        let { status } = await Location.requestPermissionsAsync();
        callback(status == 'granted')
        this.setState({
            location: status == 'granted'
        })
    }
    startTrip(data) {
        data = JSON.parse(data)
        data.userId = this.state.userId
        socket.emit('startTrip', data, response => {
            if (response == "OK") {
                this.setState({
                    locationModal: true,
                    tripId: data.tripId
                })
                Location.startLocationUpdatesAsync('valetTrip', {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 1000,
                    distanceInterval: 2
                }).then(() => {
                    TaskManager.defineTask('valetTrip', ({ data: { locations }, e }) => {
                        if (e) {
                            console.log(e.message)
                            return;
                        }
                        let { latitude, longitude, speed } = locations[0].coords
                        socket.emit('userLocation', {
                            latitude,
                            longitude,
                            userId: this.state.userId,
                            speed
                        }, console.log)
                        this.setState({
                            location: locations[0].coords
                        })
                    })
                })
            } else {
                let { success, msg } = response
                if (!success) {
                    Alert.alert(
                        'Error!',
                        msg,
                        [
                            {
                                text: 'Ok',
                                onPress: () => { },
                                style: 'cancel',
                            }
                        ],
                        { cancelable: false }
                    );
                }
            }
        })
    }
    updateState(index) {
        var card = this.state.card
        card[index].status = !card[index].status
        this.setState({ card })
    }
    verifyAuth() {
        SecureStore.getItemAsync('authtoken').then((token) => {
            fetch(`${API_HOST}/api/validate/`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': token
                }
            })
                .then(res => res.json())
                .then((data) => {
                    this.setState({
                        ...data
                    })
                    if (!data.success) {
                        this.props.navigation.replace('Login')
                    }
                })
        })
    }
    render() {
        return (
            <View style={{ ...styles.container, minHeight: screenHeight, height: undefined }}>
                <StatusBar barStyle="dark-content" backgroundColor={this.state.scrollPosition.y > 90 ? '#ff4040' : "white"} />
                <ScrollView onScroll={data => {
                    this.setState({
                        scrollPosition: data.nativeEvent.contentOffset
                    })
                }}
                    stickyHeaderIndices={[0, 2]}
                >
                    <View>
                        <View
                            style={{
                                width: screenWidth,
                                alignItems: 'center',
                                marginTop: -this.state.scrollPosition.y < -95 ? -95 : -this.state.scrollPosition.y,
                                opacity: 1 - this.state.scrollPosition.y / 95
                            }}
                        >
                            <Text style={styles.blueTitle}>History</Text>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#f3f5f7',
                                    width: 40,
                                    height: 40,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 20,
                                    position: 'absolute',
                                    right: 120,
                                    top: 30
                                }}
                                onPress={() => { this.props.navigation.navigate('Account') }}>
                                <AntDesign name={'bells'} size={14} color='back' size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#f3f5f7',
                                    width: 40,
                                    height: 40,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 20,
                                    position: 'absolute',
                                    right: 70,
                                    top: 30
                                }}
                                onPress={() => { this.setState({ modalState: true }) }}>
                                <AntDesign name={'scan1'} size={14} color='back' size={20} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    backgroundColor: '#f3f5f7',
                                    width: 40,
                                    height: 40,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderRadius: 20,
                                    position: 'absolute',
                                    right: 20,
                                    top: 30
                                }}
                                onPress={() => { this.props.navigation.navigate('Account') }}>
                                <AntDesign name={'user'} size={14} color='back' size={20} />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                width: screenWidth,
                                borderRadius: 5,
                                alignItems: 'center',
                            }}
                        >
                            <View
                                style={{
                                    width: screenWidth - (((this.state.scrollPosition.y / 80) > 1 ? 0 : 1 - (this.state.scrollPosition.y / 80)) * 20),
                                    height: 130 + (((this.state.scrollPosition.y / 80) > 1 ? 1 : (this.state.scrollPosition.y / 80)) * 10),
                                    backgroundColor: '#ff4040',
                                    marginBottom: -80,
                                    borderTopLeftRadius: 5,
                                    borderTopRightRadius: 5
                                }}
                            >
                            </View>
                            <View
                                style={{
                                    width: screenWidth - 40,
                                    height: 120,
                                    elevation: 10,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 5, height: 5 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 5,
                                    backgroundColor: 'white',
                                    borderRadius: 5,
                                    padding: 10
                                }}
                            >
                                <Text style={{ margin: 10, fontWeight: 'bold', width: '100%' }}>Your Trips</Text>
                                <Text style={{
                                    fontSize: 36,
                                    textAlign: 'right',
                                    marginRight: 20,
                                    marginBottom: 10,
                                    fontWeight: '400'
                                }}>125</Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        width: screenWidth,
                                        display: 'none'
                                    }}
                                >
                                    <View
                                        style={{
                                            ...styles.buttonBlueLight,
                                            width: (screenWidth - 80) / 3,
                                            height: 40,
                                            marginRight: 10
                                        }}
                                    ><Text style={styles.buttonBlueText}>Send</Text></View>
                                    <View
                                        style={{
                                            ...styles.buttonBlueLight,
                                            width: (screenWidth - 80) / 3,
                                            height: 40,
                                            marginRight: 10
                                        }}
                                    ><Text style={styles.buttonBlueText}>Receive</Text></View>
                                    <View
                                        style={{
                                            ...styles.buttonBlue,
                                            width: (screenWidth - 80) / 3,
                                            height: 40,
                                        }}
                                    ><Text style={styles.buttonBlueText}>Swap</Text></View>
                                </View>
                            </View>


                        </View>
                    </View>
                    <ScrollView nestedScrollEnabled={true} bounces={true}
                        style={{
                            height: 300,
                            marginTop: this.state.scrollPosition.y > 95 ? 95 : this.state.scrollPosition.y
                        }}>
                        <View style={{ marginTop: 20, width: screenWidth, alignItems: 'center' }}>
                            {this.state.userMap.map(info => {
                                return (<SettingButton {...info} />)
                            })}
                        </View>
                    </ScrollView>
                    <View style={{ height: screenHeight }}>
                        <Text style={{ margin: 10, fontWeight: 'bold', width: '100%' }}></Text>
                    </View>
                </ScrollView>
                <QRScreen
                    modalState={this.state.modalState}
                    closeModal={() => { this.setState({ modalState: false }) }}
                    startTrip={(e) => { this.startTrip(e) }}
                />
                <Maps
                    askForLocationPermissions={e => this.askForLocationPermissions(e)}
                    modalState={this.state.locationModal}
                    closeModal={() => { this.setState({ locationModal: false }) }}
                    location={this.state.location}
                    valetLocation={this.state.valetLocation}
                    carLocation={this.state.carLocation}
                    keyLocation={this.state.keyLocation}
                    businessLocation={this.state.businessLocation}
                    askForCar={this.askForCar}
                />
            </View>
        );
    }
}

