import * as React from 'react';
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
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
        userMap: [],
        securityMap: [],
        otherMap: []
    }
    logout() {

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
            <View style={{ ...styles.container }}>
                <ScrollView>
                    <TouchableOpacity
                        onPress={() => { this.logout() }}
                    >
                       <View>
                            {this.state.userMap.map(info => {
                                return (<SettingButton {...info} />)
                            })}
                            <Text>{"\n"}</Text>
                            {this.state.securityMap.map(info => {
                                return (<SettingButton {...info} />)
                            })}
                            <Text>{"\n"}</Text>
                            {this.state.otherMap.map(info => {
                                return (<SettingButton {...info} />)
                            })}
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            ...styles.buttonBlue,
                            margin: 20
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

