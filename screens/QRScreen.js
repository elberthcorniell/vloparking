import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  Button,
  TouchableOpacity,
  Alert,
  Modal,
  StatusBar
} from 'react-native';
import { styles } from '../style/styles'
import { BarCodeScanner } from 'expo-barcode-scanner';
import { AntDesign } from '@expo/vector-icons'
import * as  SecureStore from "expo-secure-store";
import { API_HOST } from '../config';
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

export default class QRScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasPermission: null,
      scanned: false
    }
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
    setTimeout(()=>{
      this.setState({
        scanned: false
      })
    }, 10000)
    Alert.alert(
      'Hey!',
      'Do you want Start this trip?',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => {
            this.props.startTrip(data);
            this.props.closeModal()
          }
        },
      ],
      { cancelable: false }
    );
  };


  render() {
    if (this.state.hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (this.state.hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.modalState || false}
        onRequestClose={() => {
          this.props.closeModal()
        }}
      >
        <StatusBar barStyle="dark-content" backgroundColor="rgba(0,0,0,0.4)" />
        <View style={{
          ...styles.container,
          backgroundColor: 'rgba(0,0,0,0.4)'
        }}>
          <View style={{ ...styles.modalView }}>
            <TouchableOpacity
              onPress={() => { this.props.closeModal() }}
              style={{
                margin: 10,
                position: 'absolute',
                top: 10,
                right: 20,
                zIndex: 2
              }}
            >
              <Text><AntDesign name='close' size={20} color='#a1a1a1' /></Text>
            </TouchableOpacity>

            <Text style={styles.blueTitle} >Qr Scanner</Text>
            <View style={{ ...styles.qrContainer, marginTop: 10 }}>
              <BarCodeScanner
                onBarCodeScanned={this.state.scanned ? undefined : (data) =>
                  this.setState({
                    scanned: true
                  }, this.handleBarCodeScanned(data))}
                style={styles.QR}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

