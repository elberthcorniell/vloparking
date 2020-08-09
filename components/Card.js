import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;


export default class Card extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      style: ''
    }
  }
  componentDidMount() {
    const style = StyleSheet.create({
      Card: {
        width: (screenWidth / 2) - 40,
        height: (screenWidth / 2) - 40,
        backgroundColor: 'white',
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        margin: 20,
        padding: 10,
        borderRadius: 5
      }
    })
    this.setState({ style })
  }
  render() {
    return (
      <TouchableOpacity
        onPress={() => { this.props.onPress() }}
      >
        <View
          style={this.state.style.Card}
        >
          <Text style={{ textAlign: 'center' }}>{this.props.icon}{"\n"}{this.props.title}</Text>
        </View>
      </TouchableOpacity>)
  }
}




