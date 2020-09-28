import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons'
const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;


export default class SettingButton extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            style: ''
        }
    }
    render() {
        return (
            <TouchableOpacity
                onPress={() => { this.props.onPress ? this.props.onPress() : '' }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        backgroundColor: '#f3f5f7',
                        marginBottom: 10,
                        borderRadius: 5,
                        width: screenWidth - (this.props.margin || 20),
                        ...this.props.style
                    }}
                >
                    {this.props.icon && <View
                        style={{
                            width: 60,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 60
                        }}>
                        {this.props.icon}
                    </View>}
                    <View
                        style={{
                            width: (screenWidth) - (100 + (this.props.margin || 20)),
                            justifyContent: 'center',
                            height: 60,
                            marginLeft: this.props.icon ? 0 : 20
                        }}
                    >
                        <Text style={{ fontSize: 16 }} numberOfLines={1}>{this.props.text}</Text>
                        <Text style={{ color: '#a1a1a1', ...this.props.descriptionStyle }}>{this.props.description}</Text>
                    </View>
                    {this.props.onPress && <View
                        style={{
                            width: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 60,
                        }}
                    >
                        <AntDesign name={'right'} size={14} color='black' size={18} />
                    </View>}
                </View>
            </TouchableOpacity>)
    }
}




