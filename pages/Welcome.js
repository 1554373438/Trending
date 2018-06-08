/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
} from 'react-native';

export default class Welcome extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
                <Text>Welcome to my tabNav</Text>
                <Button
                    title='go to my tabnav'
                    onPress={()=>{
                        navigation.navigate('TabNav')
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
