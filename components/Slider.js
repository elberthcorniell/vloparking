import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { styles } from '../style/styles'
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;
import { AntDesign } from '@expo/vector-icons'


export default class Slider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            style: ''
        }
    }
    componentDidMount() {
        const style = StyleSheet.create({
            Card: {
                flex: 1,
                position: 'absolute',
                width: (screenWidth / 2) - 40,
                height: (screenWidth / 2) - 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFF',
                borderRadius: 5,
                zIndex: 1
            }
        })
        this.setState({ style })
    }
    render() {
        return (
            <View style={{
                ...this.props.style,
                flex: 1,
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'center',
                
            }}>
                <TouchableOpacity
                    onPress={() => {}}>
                    <AntDesign style={{marginTop: -10}} name='arrowleft' size={20} />
                </TouchableOpacity>
                <View style={{
                    width: this.props.width || 80,
                    height: this.props.height || 80,
                    marginTop: -(this.props.height / 2) || -40,
                    backgroundColor: '#f3f5f7',
                    borderRadius: 10,
                    overflow: 'hidden'
                }}>
                    <Text style={styles.Title}>Toyota</Text>
                    <Text style={styles.welcome}>Corolla</Text>
                    <Text>2017</Text>
                </View>
                <TouchableOpacity
                    onPress={() => {}}>
                    <AntDesign style={{marginTop: -10}} name='arrowright' size={20} />
                </TouchableOpacity>
            </View>
        )
    }
}




