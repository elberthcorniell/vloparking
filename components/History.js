import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Slider from './Slider'
import { styles } from '../style/styles'
import { AntDesign } from '@expo/vector-icons'


export default class History extends React.Component {
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




