import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, Button, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../style/styles'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { AntDesign } from '@expo/vector-icons'
import * as  SecureStore from "expo-secure-store";
import { API_HOST } from '../config';

export default class QRScreen extends React.Component {
  state = {
    hasPermission: null,
    scanned: false
  }
  componentDidMount() {
    this.useEffect()
  }
  useEffect = () => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      this.setState({ hasPermission: status === 'granted' });
    })();
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });
    SecureStore.getItemAsync('authtoken').then((token) => {
      fetch(`${API_HOST}/api/validate/getQrData`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'authorization': token
        },
        body: data
      })
        .then(res => res.json())
        .then((data) => {
          if (data.success) {
            Alert.alert(
              'Hey!',
              'Do you want Juan to park your car at?',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                { text: 'Yes', onPress: () => { this.props.navigation.replace('Maps') } },
              ],
              { cancelable: false }
            );
          } else {
            alert(`Invalid data provided`);
          }
        })
    })
  };


  render() {
    if (this.state.hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (this.state.hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={styles.container}>
        <View style={ styles.qrContainer }>
          <BarCodeScanner
            onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
            style={styles.QR}
          />
        </View>
        {this.state.scanned ?
          <View style={styles.bottom}>
            <TouchableOpacity
              onPress={() => { this.setState({ scanned: false }) }}
            >
              <View style={styles.Button}>
                <AntDesign name='reload1' size={20} color='white' />
              </View>
            </TouchableOpacity>
          </View>
          :
          <View style={styles.bottom}>
            <TouchableOpacity
              onPress={() => { this.props.navigation.navigate('History') }}
            >
              <View style={styles.Button}>
                <AntDesign name='arrowleft' size={20} color='white' />
              </View>
            </TouchableOpacity>
          </View>}
      </View>
    );
  }
}

