import * as React from 'react';
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    StatusBar
} from 'react-native';
import { styles } from '../style/styles'
import * as  SecureStore from "expo-secure-store";
import { API_HOST } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default class Login extends React.Component {
    state = {
        password_err: '',
        username_err: ''
    }
    Login() {
        fetch(`${API_HOST}/api/validate/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...this.state
            })
        })
            .then(res => res.json())
            .then((data) => {
                if (data.success) {
                    SecureStore.setItemAsync('authtoken', data.token)
                        .then(this.props.navigation.replace('Home'))
                } else {
                    const { password_err, username_err } = data
                    Alert.alert('Login error', (password_err || username_err || msg))
                    /*
                <Text>{this.state.username_err}</Text>
                <Text>{this.state.password_err}</Text>*/
                }
            })
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
                    if (data.success) {
                        this.props.navigation.replace('History')
                    }
                })
        })
    }
    render() {
        return (
            <SafeAreaView>
                <StatusBar barStyle="light-content" backgroundColor=/*"#5b86e5"*/'black' />

                <View style={{
                    ...styles.container,
                    backgroundColor: /*'#5b86e5'*/'black'
                }}>
                    <View style={{
                        height: screenHeight * 0.2,
                        width: screenWidth,
                        padding: screenHeight * 0.02,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Image
                            style={{
                                height: screenWidth * 0.25 /*(screenWidth * 0.14)*/,
                                width: screenWidth * 0.25 /*screenWidth * 0.45*/
                            }}
                            source={0 ? {
                                uri: 'https://inverte.io/assets/images/logo-text.png'
                            }: require('../assets/logo.png')} />
                    </View>
                    <View style={{
                        ...styles.modalView,
                        height: screenHeight * 0.8,
                        paddingTop: 20
                    }}>
                        <View style={{
                            backgroundColor: '#f0f0f0',
                            height: 6,
                            width: 50,
                            marginTop: -10,
                            zIndex: 2,
                            borderRadius: 3
                        }}></View>
                        <Text style={styles.blueTitle}>Login Below</Text>
                        {/*<Image
                    source={require('../assets/VPL.png')}
                    style={{
                        height: 80,
                        width: 133,
                        marginBottom: 70,
                        marginTop: 50
                    }}
                />*/}
                        <TextInput
                            onChangeText={username => this.setState({ username })}
                            placeholder='Username'
                            style={{
                                ...styles.input,
                                marginTop: 30
                            }}
                        />
                        <TextInput
                            onChangeText={password => this.setState({ password })}
                            placeholder='Password'
                            textContentType='password'
                            secureTextEntry={true}
                            style={styles.input}
                        />
                        <TouchableOpacity
                            style={styles.buttonBlue}
                            onPress={() => { this.Login() }}
                        >
                            <View>
                                <Text style={styles.buttonBlueText}>Login</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Register') }}>
                            <Text>Don't have an account? Register now!</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

