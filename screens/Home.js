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
    Alert,
    RefreshControl
} from 'react-native';
import { styles } from '../style/styles'
import { AntDesign } from '@expo/vector-icons'
import * as  SecureStore from "expo-secure-store";
import { API_HOST } from '../config'
import SettingButton from '../components/settingButton'
import * as Permissions from 'expo-permissions'
import * as Notifications from 'expo-notifications'
import QRScreen from './QRScreen'
import Maps from './Maps'
import io from 'socket.io-client'
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager'
import * as Constants from 'expo-constants'
import EndTrip from './EndTrip';
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
let socket
let headers
export default class Home extends React.Component {
    state = {
        userTrips: [{}],
        events: [],
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
        SecureStore.getItemAsync('authtoken').then(token => {
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': token
            }
        })
        this.verifyAuth(() => {
            this.getUserTrips()
            SecureStore.getItemAsync('pushToken').then(token => {
                if (!token || token == '') {
                    this.registerForPushNotificationsAsync().then(pushToken => {
                        SecureStore.setItemAsync('pushToken', pushToken)
                        fetch(`${API_HOST}/api/admin/pushToken`, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify({
                                pushToken,
                                valetId: this.state.valetId
                            })
                        })
                    })
                }
            })
        })
        this.setState({ refreshing: false })
        this.mountSocket()

    }
    mountSocket() {
        socket = io(`${API_HOST}/`)
        socket.on('valetLocation', valetLocation => {
            this.setState({
                valetLocation
            })
        })
        socket.on('tripEnded', tripId => {
            console.log('trip Ended')
            this.setState({
                locationModal: false,
                endModal: false
            }, () => {
                this.getUserTrips()
            })
        })
        socket.on('update', () => {
            this.getUserTrips()
            this.getEvents()
        })
        socket.on('carWithOwner', () => {
            this.setState({
                endModal: true
            })
        })
    }
    update(){
        this.getUserTrips()
        this.getEvents()
    }
    joinTrip(tripId) {
        socket.emit('joinTrip', {
            tripId
        }, data => {
            let { valetLocation, carLocation, keyLocation, userLocation } = data
            data != 'FAIL' && this.setState({
                valetLocation: valetLocation || {},
                carLocation: carLocation || {},
                keyLocation: keyLocation || {},
                userLocation: userLocation || {}
            })
        })
    }
    getUserTrips() {
        fetch(`${API_HOST}/api/admin/trips/user/${this.state.userId}`, { headers })
            .then(res => res.json())
            .then(data => {
                let { success, userTrips } = data
                if (success) {
                    let tripIds = Array.from(userTrips, x => x.dateEnd ? undefined : x.tripId)
                    this.setState({
                        userTrips,
                        tripIds
                    })
                    for (let i = 0; i < tripIds.length; i++) {
                        if (tripIds[i]) {
                            this.startReporting()
                            break
                        }
                    }
                }
            })
    }
    askForCar() {
        Alert.alert(
            'Hey!',
            'Do you need your car?',
            [
                {
                    text: 'Yes',
                    onPress: () => {
                        socket.emit('askForCar', {
                            tripId: this.state.tripId
                        }, data => {
                            data == "FAIL" && Alert.alert(
                                'Error!',
                                'Your car is on the way',
                                [
                                    {
                                        text: 'OK',
                                    }
                                ]
                            )
                        })
                    },
                    style: 'cancel',
                }
            ],
            { cancelable: false }
        )
    }
    askForLocationPermissions = async (callback) => {
        let { status } = await Location.requestPermissionsAsync();
        callback(status == 'granted')
        this.setState({
            location: status == 'granted'
        })
    }
    startReporting() {
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
                    speed,
                    tripId: this.state.tripId || 0
                }, console.log)
                this.setState({
                    location: locations[0].coords
                })
            })
        })
    }
    startTrip(data) {
        data = JSON.parse(data)
        data.userId = this.state.userId
        socket.emit('startTrip', data, response => {
            if (response == "OK") {
                this.setState({
                    locationModal: true,
                    tripId: data.tripId,
                    dateEnd: null
                }, () => {
                    this.startReporting()
                    this.getUserTrips()
                    this.getEvents()
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
    verifyAuth(callback) {
        fetch(`${API_HOST}/api/validate/`, { headers })
            .then(res => res.json())
            .then((data) => {
                this.setState({
                    ...data
                })
                if (!data.success) {
                    this.props.navigation.replace('Login')
                } else {
                    if (callback)
                        callback()
                }
            })
    }
    getEvents() {
        fetch(`${API_HOST}/api/admin/events/${this.state.tripId}`, { headers })
            .then(res => res.json())
            .then(data => {
                let { success, events } = data
                this.setState({
                    events: events || []
                })
            })
    }
    registerForPushNotificationsAsync = async () => {
        let token;
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }

        return token;
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
                >
                    <RefreshControl
                        refreshing={this.state.refreshing} onRefresh={() => this.componentDidMount()}

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
                                    <TouchableOpacity
                                        onPress={() => { this.update(); }}
                                        style={{
                                            margin: 10,
                                            position: 'absolute',
                                            top: 10,
                                            right: 20,
                                            zIndex: 2
                                        }}
                                    >
                                        <Text><AntDesign name='reload1' size={20} color='#a1a1a1' /></Text>
                                    </TouchableOpacity>
                                    <Text style={{ margin: 10, fontWeight: 'bold', width: '100%' }}>Your Trips</Text>
                                    <Text style={{
                                        fontSize: 36,
                                        textAlign: 'right',
                                        marginRight: 20,
                                        marginBottom: 10,
                                        fontWeight: '400'
                                    }}>{this.state.userTrips.length} trips</Text>
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

                        <View style={{ marginTop: 20, width: screenWidth, minHeight: screenHeight, alignItems: 'center' }}>
                            {this.state.userTrips.map(info => {
                                return <SettingButton
                                    text={info.username}
                                    description={info.dateStart}
                                    onPress={() => {
                                        this.setState({
                                            tripId: info.tripId,
                                            locationModal: true,
                                            dateEnd: info.dateEnd
                                        }, () => {
                                            this.getEvents()
                                            this.joinTrip(info.tripId)
                                        })
                                    }}
                                    icon={
                                        info.dateEnd ?
                                            <View style={{
                                                backgroundColor: 'lightgreen',
                                                height: 40, width: 40,
                                                justifyContent: "center",
                                                alignItems: 'center',
                                                borderRadius: 20,
                                            }}><Text style={{
                                                color: 'white',
                                                fontWeight: "bold"
                                            }}>Done</Text></View> :
                                            <View style={{
                                                backgroundColor: '#FF4040',
                                                height: 40, width: 40,
                                                justifyContent: "center",
                                                alignItems: 'center',
                                                borderRadius: 20,
                                            }}><Text style={{
                                                color: 'white',
                                                fontWeight: "bold"
                                            }}>Live</Text></View>
                                    }
                                />
                            })}
                        </View>
                    </RefreshControl>

                </ScrollView>
                <QRScreen
                    modalState={this.state.modalState}
                    closeModal={() => { this.setState({ modalState: false }) }}
                    startTrip={(e) => { this.startTrip(e) }}
                />
                <EndTrip
                    modalState={this.state.endModal}
                    closeModal={() => { this.setState({ endModal: false }) }}
                    userId={this.state.userId}
                    tripId={this.state.tripId}
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
                    askForCar={() => this.askForCar()}
                    dateEnd={this.state.dateEnd}
                    events={this.state.events}
                />
            </View>
        );
    }
}

