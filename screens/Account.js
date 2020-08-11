import * as React from 'react';
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    ScrollView
} from 'react-native';
import { styles } from '../style/styles'
import * as  SecureStore from "expo-secure-store";
import { API_HOST } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingButton from '../components/settingButton'
import { AntDesign } from '@expo/vector-icons'
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default class Login extends React.Component {
    state = {
        userMap: [
            {text: 'Personal Data', description: 'mmg', icon: <AntDesign name={'idcard'} size={14} color='mediumaquamarine' size={30} />},
            {text: 'Referral ID', description: 'mmg', icon: <AntDesign name={'adduser'} size={14} color='mediumaquamarine' size={30} />},
            {text: 'Notifications', description: 'mmg', icon: <AntDesign name={'bells'} size={14} color='mediumaquamarine' size={30} />},
            {text: 'Anouncements', description: 'mmg', icon: <AntDesign name={'notification'} size={14} color='mediumaquamarine' size={30} />},
        ],
        securityMap: [
            {text: 'Password & Pin', description: 'mmg', icon: <AntDesign name={'lock'} size={14} color='lightskyblue' size={30} />},
            {text: '2 Factor Authentication', description: 'mmg', icon: <AntDesign name={'home'} size={14} color='lightskyblue' size={30} />},
            {text: 'Anti Phishing Code', description: 'mmg', icon: <AntDesign name={'Safety'} size={14} color='lightskyblue' size={30} />},
            {text: 'Address Whitelist', description: 'mmg', icon: <AntDesign name={'bars'} size={14} color='lightskyblue' size={30} />},
        ],
        otherMap: [
            {text: 'General Settings', description: 'Yino mmg', icon: <AntDesign name={'setting'} size={14} color='sandybrown' size={30} />},
            {text: 'Color Preference', description: 'Yino mmg', icon: <AntDesign name={'picture'} size={14} color='sandybrown' size={30} />},
            {text: 'Help & Support', description: 'mmg', icon: <AntDesign name={'customerservice'} size={14} color='sandybrown' size={30} />},
            {text: 'Share The App', description: 'mmg', icon: <AntDesign name={'sharealt'} size={14} color='sandybrown' size={30} />},
        ]
    }
    logout(){
        
        Alert.alert(
            'Alert!', 
            'Do you want to log out?',
            [
                {
                  text: 'Yes',
                  onPress: () => {
                    SecureStore.setItemAsync('authtoken', '')
                    .then(this.props.navigation.replace('Login'))
                  }
                },
                {
                  text: 'Cancel',
                  style: 'cancel'
                }
              ]
            )
    }
    render() {
        return (
            <View style={{...styles.container, height: undefined}}>
                <ScrollView>
                <TouchableOpacity
                    onPress={() => { this.logout() }}
                >
                    <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        backgroundColor: '#f3f5f7',
                        marginBottom: 10,
                        borderRadius: 5,
                        width: screenWidth - 20,
                        height: 120,
                        marginTop: 10,
                        marginBottom: 20
                    }}
                ></View>
                    <View>
                        {this.state.userMap.map(info=>{
                            return(<SettingButton {...info}/>)
                        })}
                        <Text>{"\n"}</Text>
                        {this.state.securityMap.map(info=>{
                            return(<SettingButton {...info}/>)
                        })}
                        <Text>{"\n"}</Text>
                        {this.state.otherMap.map(info=>{
                            return(<SettingButton {...info}/>)
                        })}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        ...styles.buttonBlue,
                        marginTop: 20
                    }}
                    onPress={() => { this.logout() }}
                >
                    <View>
                        <Text style={styles.buttonBlueText}>Log out</Text>
                    </View>
                </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

