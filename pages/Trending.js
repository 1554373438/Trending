/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Button,
    Text,
    TextInput,
    findNodeHandle,
    NativeModules,
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl,
    DeviceEventEmitter,
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import {Popover} from 'react-native-modal-popover';
import NavigationBar from '../components/NavigationBar';
import DataRepository, {FLAG_STORAGE} from '../expand/dao/DataRepository';
import TrendingCell from '../components/TrendingCell';

import TimeSpan from '../model/TimeSpans';
import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';

const timeSpanTextArray = [
    new TimeSpan('今 天', 'since=daily'),
    new TimeSpan('本 周', 'since=weekly'),
    new TimeSpan('本 月', 'since=monthly')];
const API_URL = 'https://github.com/trending/';

export default class TrendingPage extends Component {
    constructor(props) {
        super(props);
        this.LanguageDao = new LanguageDao(FLAG_LANGUAGE.flag_language);
        this.state = {
            languageArray: [],
            timeSpan: timeSpanTextArray[0],
            showPopover: true,
            popoverAnchor: {x: 0, y: 0, width: 0, height: 0},
        }
    }

    componentDidMount() {
        this.loadlanguageData();
        this.listener = DeviceEventEmitter.addListener('showToast', (text) => this.toast.show(text, DURATION.LENGTH_LONG));
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

    renderTitleView() {
        return (
            <TouchableOpacity
                ref={r => this.button = r}
                onLayout={()=>this.setButton()}
                onPress={()=> this.openPopover()}
            >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{
                        fontSize: 18,
                        color: '#FFFFFF',
                        fontWeight: '400'
                    }}>趋势 </Text>
                    <Image
                        style={{width: 12, height: 12, marginLeft: 5}}
                        source={require('../res/images/ic_spinner_triangle.png')}
                    />
                </View>
            </TouchableOpacity>
        )
    }

    setButton = (e) => {
        const handle = findNodeHandle(this.button);
        if (handle) {
            NativeModules.UIManager.measure(handle, (x0, y0, width, height, x, y) => {
                this.setState({popoverAnchor: {x: x, y: y, width: width, height: height}});
            });
        }
    }

    openPopover() {
        this.setState({showPopover: true})
        // this.button.measure((x0, y0, width, height, x, y) => {
        //     this.setState({ popoverAnchor: { x: x, y: y, width: width, height: height }});
        // });
    }

    closePopover() {
        this.setState({showPopover: false});
    }
    onSelectTimeSpan(timeSpan) {
        this.closePopover();
        this.setState({
            timeSpan: timeSpan
        })
    }

    render() {
        const statusBar = {
            // backgroundColor: 'red',
            barStyle: 'dark-content',
        }
        const navigationBar =
            (<NavigationBar
                titleView={this.renderTitleView()}
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
                        <TrendingTab key={index} tabLabel={languageItem.name} timeSpan={this.state.timeSpan} {...this.props}/> : null;
                })

            }
        </ScrollableTabView>) : null;
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
                <Popover
                    visible={this.state.showPopover}
                    fromRect={this.state.popoverAnchor}
                    onClose={()=>this.closePopover()}
                    placement="bottom"
                    contentStyle={{backgroundColor:'#343434',opacity:0.8}}>
                    {timeSpanTextArray.map((result, i, arr) => {
                        return <TouchableOpacity key={i} onPress={() => this.onSelectTimeSpan(arr[i])}
                                                 underlayColor='transparent'>
                            <Text
                                style={{fontSize: 18, color: 'white', padding: 8, fontWeight: '400'}}>
                                {arr[i].showText}
                            </Text>
                        </TouchableOpacity>
                    })
                    }
                </Popover>
                <Toast ref={(toast) => this.toast = toast}/>
            </View>
        );
    }
}

class TrendingTab extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository(FLAG_STORAGE.flag_trending);
        this.state = {
            dataSource: '',
            isLoading: false,
        }
    }

    componentDidMount() {
        this.loadData(this.props.timeSpan, true);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.timeSpan !== this.props.timeSpan) {
            this.loadData(nextProps.timeSpan);
        }
    }

    genFetchUrl(timeSpan, category) {//objective-c?since=daily
        return API_URL + category + '?' + timeSpan.searchText;
    }
    onRefresh() {
       this.loadData(this.props.timeSpan)
    }
    loadData(timeSpan, isRefresh) {
        this.updateState({
            isLoading: true,
        })
        const url = this.genFetchUrl(timeSpan, this.props.tabLabel);
        this.dataRepository.fetchRepository(url)
            .then((result) => {
                let items = result && result.items ? result.items : result ? result : [];
                this.updateState({
                    dataSource: items,
                    isLoading: false,
                });

                if (result && result.update_date && !this.dataRepository.checkDate(result.update_date)) {
                    DeviceEventEmitter.emit('showToast', '数据过时')
                    return this.dataRepository.fetchNetRepository(url)
                } else {
                    DeviceEventEmitter.emit('showToast', '显示缓存数据')
                }
            })
            .then(items => {
                if (!items || items.length === 0) return;
                this.updateState({
                    dataSource: items,
                    isLoading: false,
                });
                DeviceEventEmitter.emit('showToast', '显示网络数据')
            })
            .catch((error) => {
                console.log(error);
            })
    }
    updateState(dic) {
        if(!this) return;
        this.setState(dic)
    }
    onSelect(item) {
        this.props.navigation.navigate('RepositoryDetail', item);
    }

    renderRow({item}) {
        return <TrendingCell
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
                            onRefresh={() => this.onRefresh()}
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
    app: {
        ...StyleSheet.absoluteFillObject,
        padding: 10,
        backgroundColor: '#c2ffd2',
        alignItems: 'center',
    },
});
