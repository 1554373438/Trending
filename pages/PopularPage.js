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
import Toast,{DURATION} from 'react-native-easy-toast'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';

import NavigationBar from '../components/NavigationBar';
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository';
import RepositoryCell from '../components/RepositoryCell';

import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';

const URL = 'https://api.github.com/search/repositories?q=';
const QYERY_STR = '&sort=start'

export default class PopularPage extends Component {
    constructor(props) {
        super(props);
        this.LanguageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        // this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
        this.state = {
            languageArray: [],
        }
    }

    static navigationOptions = {
        headerTitle: '最热',
    }

    componentDidMount() {
        this.loadlanguageData();
        this.listener = DeviceEventEmitter.addListener('showToast', (text) => this.toast.show(text, DURATION.LENGTH_LONG));
    }
    componentWillUnmount(){
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
                style={{backgroundColor: '#EE6363'}}
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
                    return languageItem.checked ? <PopularTab key={index} tabLabel={languageItem.name} {...this.props}/> : null;
                })
            }
        </ScrollableTabView>) : null;
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
                <Toast ref={(toast)=>this.toast=toast}/>
            </View>
        );
    }
}

class PopularTab extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_popular);
        this.state = {
            dataSource: '',
            isLoading: false,
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
                let items = result && result.items ? result.items : result ? result : [];
                this.setState({
                    dataSource: items,
                    isLoading: false,
                });

                if(result&&result.update_date&&!this.dataRepository.checkDate(result.update_date)) {
                    DeviceEventEmitter.emit('showToast', '数据过时')
                    return this.dataRepository.fetchNetRepository(url)
                }else {
                    DeviceEventEmitter.emit('showToast', '显示缓存数据')
                }
            })
            .then(items=>{
                if(!items || items.length === 0 ) return;
                this.setState({
                    dataSource: items,
                    isLoading: false,
                });
                DeviceEventEmitter.emit('showToast', '显示网络数据')
            })
            .catch((error) => {
                console.log(error);
            })
    }

    onSelect(item) {
        this.props.navigation.navigate('RepositoryDetail',item);
    }

    renderRow({item}) {
        return <RepositoryCell
            data={item}
            key={item.id}
            onSelect={() => this.onSelect(item)}
        />
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
