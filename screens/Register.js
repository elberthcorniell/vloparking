import * as React from 'react';
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    TextInput,
    Image,
    TouchableOpacityBase
} from 'react-native';
import { styles } from '../style/styles'
import { API_HOST } from '../config';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons'
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;


export default class Register extends React.Component {
    state = {
        hidePassword: true,
        index: 0
    }
    register() {
        fetch(`${API_HOST}/api/validate/register`, {
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
                    this.props.navigation.navigate('Login')
                }
            })
    }
    verifyEmail(){

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
                        this.props.navigation.replace('Home')
                    }
                })
        })
    }
    renderView(index) {
        switch (index) {
            case 0: return (
                <View>
                    <TextInput
                        onChangeText={email => this.setState({ email })}
                        placeholder='Email'
                        style={{
                            ...styles.input,
                            marginTop: 0.1 * screenHeight
                        }}
                    />
                    <TouchableOpacity
                        style={{
                            ...styles.buttonBlue
                        }}
                        onPress={() => { /*this.register()*/ this.setState({ index: this.state.index + 1 }) }}
                    >
                        <View>
                            <Text style={styles.buttonBlueText}>Register <AntDesign name={'arrowright'} size={14} /></Text> 
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { this.props.navigation.navigate('Login') }}>  
                        <Text>Already have an account? Login!</Text>
                    </TouchableOpacity>
                </View>
            )
            case 2: return (
                <View>
                    <TextInput
                        onChangeText={username => this.setState({ username })}
                        placeholder='Username'
                        style={styles.input}
                    />
                    <TextInput
                        onChangeText={email => this.setState({ email })}
                        placeholder='Email'
                        style={styles.input}
                    />
                    <TextInput
                        onChangeText={password => this.setState({ password })}
                        placeholder='Password'
                        textContentType='password'
                        secureTextEntry={this.state.hidePassword}
                        style={styles.input}
                    />
                </View>
            )
        }
    }
    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Text style={styles.blueTitle}>Create Account</Text>
                    {this.renderView(this.state.index)}
                    <View style={{
                        width: screenWidth,
                        padding: 20,
                        position: 'absolute',
                        bottom: 20,
                    }}>
                        <Text style={{ fontWeight: "bold", textAlign: 'center' }}>
                            By signing up you agree to the Terms of Service and Privacy Policy
                    </Text>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

