import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image, TouchableOpacityBase, StatusBar } from 'react-native';
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
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default class Home extends React.Component {
    state = {
        card: [
            { name: 'Cars', status: false, icon_name: 'car', content: <MyCars /> },
            { name: 'History', status: false, icon_name: 'bars', content: <History /> },
        ],
        userMap: [
            {text: 'Personal Data', description: 'mmg', icon: <AntDesign name={'idcard'} size={14} color='mediumaquamarine' size={30} />, margin: 40},
            {text: 'Referral ID', description: 'mmg', icon: <AntDesign name={'adduser'} size={14} color='mediumaquamarine' size={30} />, margin: 40},
            {text: 'Notifications', description: 'mmg', icon: <AntDesign name={'notification'} size={14} color='mediumaquamarine' size={30} />, margin: 40},
        ]
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
            <View style={styles.container}>
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
                        onPress={() => { this.props.navigation.navigate('QRScreen') }}>
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
                        height: 400,
                        borderRadius: 5,
                        alignItems: 'center'
                    }}
                >
                    <View
                        style={{
                            width: screenWidth,
                            height: 80,
                            backgroundColor: 'orange',
                            marginBottom: -40
                        }}
                    >
                    </View>
                    <View
                        style={{
                            width: screenWidth - 40,
                            height: 120,
                            elevation: 10,
                            backgroundColor: 'white',
                            borderRadius: 5
                        }}
                    >
                    </View>
                    <View style={{marginTop:20}}>
                        {this.state.userMap.map(info=>{
                            return(<SettingButton {...info}/>)
                        })}
                    </View>
                </View>

                <View style={{
                    marginTop: 0,
                    width: screenWidth,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                }}>
                    {/*this.state.card.map((data, index) => {
                        return (<Card
                            key={'Card' + index}
                            position={index + 1}
                            title={data.name}
                            status={data.status}
                            activeContent={data.content}
                            icon={<AntDesign name={data.icon_name} size={60} />}
                            onPress={() => { this.props.navigation.navigate(data.name) }}
                        />)
                    })*/}
                </View>
                {/*<MapView style={styles.mapContainer} />*/}
            </View>
        );
    }
}

