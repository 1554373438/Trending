/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    WebView,
    DeviceEventEmitter,
} from 'react-native';
import NavigationBar from '../components/NavigationBar';

import ViewUtils from '../util/ViewUtils';
const TRENDING_URL = 'https://github.com/';

export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props);
        let url= this.props.navigation.state.params.owner && this.props.navigation.state.params.owner.html_url ? this.props.navigation.state.params.owner.html_url:
            TRENDING_URL+this.props.navigation.state.params.fullName;
        let title = this.props.navigation.state.params.full_name ? this.props.navigation.state.params.full_name :
            this.props.navigation.state.params.fullName;
        this.state = {
            url: url,
            canGoBack: false,
            title: title,
        }
    }
    componentDidMount() {

    }
    onBack() {
        if(this.state.canGoBack) {
            this.webView.goBack();
        }else {
            DeviceEventEmitter.emit('showToast', '已到顶～')
            this.props.navigation.goBack();
        }
    }
    onNavigationStateChange(e) {
        this.setState({
            canGoBack: e.canGoBack,
            url: e.url,
            title: e.title,
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title= {this.state.title}
                    style={{backgroundColor:'#EE6363'}}
                    leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                />
                <WebView
                    ref={webview => this.webView  = webview}
                    source={{uri:this.state.url}}
                    startInLoadingState={true}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
    },
});
