import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image, TouchableOpacityBase, StatusBar, ScrollView } from 'react-native';
import { styles } from '../style/styles'
import Card from '../components/Card'
import { AntDesign } from '@expo/vector-icons'
import * as  SecureStore from "expo-secure-store";
import MapView from 'react-native-maps';
import Account from '../components/Account'
import MyCars from '../components/MyCars'
import History from '../components/History'
import Settings from '../components/Settings'
import { API_HOST } from '../config'
import SettingButton from '../components/settingButton'
import QRScreen from './QRScreen'
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default class Home extends React.Component {
    state = {
        card: [
            { name: 'Cars', status: false, icon_name: 'car', content: <MyCars /> },
            { name: 'History', status: false, icon_name: 'bars', content: <History /> },
        ],
        userMap: [
            { text: 'Personal Data', description: 'mmg', icon: <AntDesign name={'idcard'} size={14} color='mediumaquamarine' size={30} />, margin: 40 },
            { text: 'Referral ID', description: 'mmg', icon: <AntDesign name={'adduser'} size={14} color='mediumaquamarine' size={30} />, margin: 40 },
            { text: 'Notifications', description: 'mmg', icon: <AntDesign name={'notification'} size={14} color='mediumaquamarine' size={30} />, margin: 40 },
        ],
        modalState: false
    }

    componentDidMount() {
        this.verifyAuth()
    }

    updateState(index) {
        var card = this.state.card
        card[index].status = !card[index].status
        this.setState({ card })
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
            <View style={{ ...styles.container, minHeight: screenHeight, padding: 10, height: undefined }}>
                <ScrollView>
                    <StatusBar barStyle="dark-content" backgroundColor="white" />
                    <View
                        style={{
                            width: screenWidth
                        }}
                    >
                        {/*<Image
                        source={require('../assets/VPL.png')}
                        style={{
                            height: 40,
                            width: 66,
                            margin: 20,
                            marginTop: 30,
                            zIndex: 1,
                        }}
                    />*/}
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
                        width: screenWidth - 20,
                        overflow: 'hidden',
                        borderRadius: 5,
                        alignItems: 'center'
                    }}
                >
                    <View
                        style={{
                            width: screenWidth,
                            height: 120,
                            backgroundColor: 'orange',
                            marginBottom: -80
                        }}
                    >
                    </View>
                    <View
                        style={{
                            width: screenWidth - 40,
                            height: 120,
                            elevation: 10,
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
                    <View style={{ marginTop: 20 }}>
                        {this.state.userMap.map(info => {
                            return (<SettingButton {...info} />)
                        })}
                    </View>
                </View>

                {/*<MapView style={styles.mapContainer} />*/}
                <QRScreen modalState={this.state.modalState} closeModal={() => { this.setState({ modalState: false }) }} />
                </ScrollView>
            </View >
        );
    }
}

