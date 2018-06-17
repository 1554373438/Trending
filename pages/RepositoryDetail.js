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
    Image,
    TouchableOpacity,
    DeviceEventEmitter,
} from 'react-native';
import NavigationBar from '../components/NavigationBar';
import FavoriteDao from '../expand/dao/FavoriteDao';

import ViewUtils from '../util/ViewUtils';
const TRENDING_URL = 'https://github.com/';

export default class RepositoryDetail extends Component {
    constructor(props) {
        super(props);
        let flag = this.props.navigation.state.params.flag;
        let isFavorite = this.props.navigation.state.params.projectModel.isFavorite;
        let modelItem = this.props.navigation.state.params.projectModel.modelItem;
        let url = modelItem.owner && modelItem.owner.html_url ? modelItem.owner.html_url: TRENDING_URL+modelItem.fullName;
        let title = modelItem.full_name ? modelItem.full_name : modelItem.fullName;
        this.favoriteDao = new FavoriteDao(flag);
        this.state = {
            url: url,
            canGoBack: false,
            title: title,
            modelItem: modelItem,
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../res/images/ic_star.png') : require('../res/images/ic_star_navbar.png'),
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
    onRightButtonClick() {
        this.setFavoriteState(this.state.isFavorite = !this.state.isFavorite);
        let key = this.state.modelItem.fullName ? this.state.modelItem.fullName : this.state.modelItem.id.toString();
        if (this.state.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(this.state.modelItem));
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
    }
    setFavoriteState(isFavorite) {
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../res/images/ic_star.png') : require('../res/images/ic_star_navbar.png'),
        })
    }
    renderRightButton() {
        return (<View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={()=>this.onRightButtonClick()}>
                    <Image
                        style={{width: 20, height: 20, marginRight: 10}}
                        source={this.state.favoriteIcon}/>
                </TouchableOpacity>
            </View>
        )
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
                    rightButton={this.renderRightButton()}
                />
                <WebView
                    ref={webview => this.webView  = webview}
                    source={{uri:this.state.url}}
                    startInLoadingState={true}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                />
                {/*<View><Text>{JSON.stringify(this.props.navigation.state.params)}</Text></View>*/}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
    },
});
