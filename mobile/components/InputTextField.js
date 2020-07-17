import React from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";

import {TextInputMask} from 'react-native-masked-text';

export default class InputTextField extends React.Component {
    render() {
        var setStates = this.props.setState
        var states = this.props.state
        return (
            <View style={this.props.style}>
                <Text style={[styles.inputTitle, this.props.colo]}>{this.props.title}</Text>
                {this.props.cpf ? 

                <TextInputMask
                    type={'cpf'}
                    value={states}
                    autoCapitalize='none'
                    placeholder={this.props.placeholderText}
                    onChangeText={text => setStates(text)}
                    style={[styles.input, this.props.colo]}
                    secureTextEntry={this.props.isSecure}
                />
                
                : 
                
                <TextInput
                    onChangeText={text => setStates(text)}
                    value={states}
                    autoCapitalize='none'
                    placeholder={this.props.placeholderText}
                    secureTextEntry={this.props.isSecure}
                    style={[styles.input, this.props.colo]}
                />
                }
                
                <View style={[{ borderBottomColor: "#D8D8D8", borderBottomWidth: 1 }, this.props.bold]} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputTitle: {
        color: "#000",
        fontWeight: "500",
        fontSize: 14
    },
    input: {
        paddingVertical: 12,
        color: "#333",
        fontSize: 14,
    }
});
