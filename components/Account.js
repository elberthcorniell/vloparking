import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TouchableOpacityComponent } from 'react-native';
import { styles } from '../style/styles'
import * as  SecureStore from "expo-secure-store";
import { AntDesign } from '@expo/vector-icons'


export default class Account extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            style: ''
        }
    }
    logout(){
        SecureStore.setItemAsync('authtoken', '')
        .then(this.props.navigation.replace('Login'))
    }
    render() {
        return (
            <View>
                <TouchableOpacity
                    onPress={()=>{this.logout()}}
                >
                    <View
                        style={styles.buttonBlueM}>
                        <Text>Log Out</Text>
                    </View>
                </TouchableOpacity>
            </ View>)
    }
}




