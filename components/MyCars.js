import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { styles } from '../style/styles'
import Slider from './Slider'
import { AntDesign } from '@expo/vector-icons'
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;


export default class MyCars extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      style: ''
    }
  }
  render() {
    return (
      <View style={{
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
      }}>
        <Slider
          style={{
            marginTop: 170
          }}
          width={200}
          height={200}
        />
      </ View>)
  }
}




