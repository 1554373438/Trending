/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    RefreshControl,
    DeviceEventEmitter,
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';

import NavigationBar from '../components/NavigationBar';
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository';
import RepositoryCell from '../components/RepositoryCell';

import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
import FavoriteDao from '../expand/dao/FavoriteDao'
import ProjectModel from '../model/ProjectModel'
import Utils from '../util/Utils'
const URL = 'https://api.github.com/search/repositories?q=';
const QYERY_STR = '&sort=start'
var favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);

export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.LanguageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        // this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
        this.state = {
            languageArray: [],
        }
    }

    componentDidMount() {
        this.loadlanguageData();
        this.listener = DeviceEventEmitter.addListener('showToast', text => this.toast.show(text, DURATION.LENGTH_LONG));
    }

    componentWillUnmount() {
        if (this.listener) {
            this.listener.remove();
        }
    }

    loadlanguageData() {
        this.LanguageDao.fetch()
            .then((result) => {
                this.setState({
                    languageArray: result,
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    render() {
        const {navigation} = this.props;
        const statusBar = {
            // backgroundColor: 'red',
            barStyle: 'dark-content',
        }
        const navigationBar =
            (<NavigationBar
                title="最热"
                style={{backgroundColor: '#2196F3'}}
                statusBar={statusBar}
            />);
        const content = this.state.languageArray.length > 0 ? (<ScrollableTabView
            tabBarBackgroundColor="#2196F3"
            tabBarActiveTextColor="white"
            tabBarInactiveTextColor="mintcream"
            tabBarUnderlineStyle={{backgroundColor: '#e7e7e7', height: 2}}
            renderTabBar={() => <ScrollableTabBar/>}
        >
            {
                this.state.languageArray.map((item, index) => {
                    const languageItem = item;
                    return languageItem.checked ?
                        <PopularTab key={index} tabLabel={languageItem.name} {...this.props} /> : null;
                })
            }
        </ScrollableTabView>) : null;
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
                <Toast ref={toast => this.toast = toast}/>
            </View>
        );
    }
}

class PopularTab extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
        this.state = {
            dataSource: [],
            isLoading: false,
            favoriteKeys: [],
        }
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        this.setState({
            isLoading: true,
        })
        const url = URL + this.props.tabLabel + QYERY_STR;
        this.dataRepository.fetchRepository(url)
            .then((result) => {
                this.items = result && result.items ? result.items : result || [];
                // this.setState({
                //     dataSource: items,
                //     isLoading: false,
                // });
                this.getFavoriteKeys();
                if (result && result.update_date && !this.dataRepository.checkDate(result.update_date)) {
                    DeviceEventEmitter.emit('showToast', '数据过时')
                    return this.dataRepository.fetchNetRepository(url)
                }
                DeviceEventEmitter.emit('showToast', '显示缓存数据')
            })
            .then((items) => {
                if (!items || items.length === 0) return;
                // this.setState({
                //     dataSource: items,
                //     isLoading: false,
                // });
                this.items = items;
                this.getFavoriteKeys();
                DeviceEventEmitter.emit('showToast', '显示网络数据')
            })
            .catch((error) => {
                console.log(error);
                this.updateState({
                    isLoading: false,
                })
            })
    }

    /**
     * 更新ProjectItem的Favorite状态
     */
    flushFavoriteState() {
        let projectModels = [];
        let items = this.items;
        for (var i = 0, len = items.length; i < len; i++) {
            projectModels.push(new ProjectModel(items[i],  Utils.checkFavorite(items[i], this.state.favoriteKeys)));
        }
        this.updateState({
            isLoading: false,
            dataSource: projectModels,
        });
    }
    /**
     * 获取本地用户收藏的ProjectItem
     */
    getFavoriteKeys() {
        favoriteDao.getFavoriteKeys().then((keys)=> {
            if (keys) {
                this.updateState({favoriteKeys: keys});
            }
            this.flushFavoriteState();
        }).catch((error)=> {
            this.flushFavoriteState();
            console.log(error);
        });
    }
    updateState(dic) {
        if (!this)return;
        this.setState(dic);
    }

    onSelect(item) {
        this.props.navigation.navigate('RepositoryDetail', {projectModel:item, flag: FLAG_STORAGE.flag_popular});
    }

    onFavorite(modelItem,isFavorite) {
        if(isFavorite) {
            favoriteDao.saveFavoriteItem(modelItem.id.toString(),JSON.stringify(modelItem))
        }else {
            favoriteDao.removeFavoriteItem(modelItem.id.toString())
        }

    }
    renderRow({item}) {
        return (<RepositoryCell
            data={item}
            key={item.modelItem.id}
            onSelect={()=>this.onSelect(item)}
            onFavorite={(callbackModelItem,callbackIsFavorite)=>this.onFavorite(callbackModelItem,callbackIsFavorite)}
        />)
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={data => this.renderRow(data)}
                    keyExtractor={(item, index) => index}
                    refreshControl={
                        <RefreshControl
                            title="loading..."
                            colors={['#2196F3']}
                            tintColor="#2196F3"
                            titleColor="#2196F3"
                            refreshing={this.state.isLoading}
                            onRefresh={() => this.loadData()}
                        />
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
