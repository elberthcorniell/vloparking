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
  TouchableOpacityBase
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
    this.props.closeModal()
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
    
    /*
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
    })*/
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
      <View style={{
        height: screenHeight * 0.90,
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white', 
        width: screenWidth,
        alignItems: 'center',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        elevation: 20 
      }}>
        <TouchableOpacity
          onPress={()=>{this.props.closeModal()}}
          style={{
            margin: 10,
            position: 'absolute',
            top: 10,
            right: 20
          }}
        >
        <Text><AntDesign name='close' size={20} color='#a1a1a1'  /></Text>
        </TouchableOpacity>
        <View style={{ ...styles.qrContainer, marginTop: 60 }}>
          <BarCodeScanner
            onBarCodeScanned={this.state.scanned ? undefined : this.handleBarCodeScanned}
            style={styles.QR}
          />
        </View>
        {/*this.state.scanned ?
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
          </View>*/}
          </View>
      </Modal>
    );
  }
}

