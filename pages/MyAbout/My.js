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
    TextInput,
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar,} from 'react-native-scrollable-tab-view';
import NavigationBar from '../../components/NavigationBar';

export default class MyPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {navigation} = this.props;
        return (
            <View style={styles.container}>
            <NavigationBar
                title='自定义标签'
                style={{backgroundColor:'#6495ED'}}
            />
                <Text
                onPress={()=>{
                    navigation.navigate('CustomKeyPage');
                }}
                >自定义标签</Text>
                <Text
                onPress={()=>{
                    navigation.navigate('SortKeyPage');
                }}
                >标签排序</Text>
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
