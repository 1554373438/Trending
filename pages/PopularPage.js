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
    FlatList,
    RefreshControl
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar,} from 'react-native-scrollable-tab-view';

import NavigationBar from '../components/NavigationBar';
import DataRepository from '../expand/dao/DataRepository';
import RepositoryCell from '../components/RepositoryCell';

import LanguageDao, {FLAG_LANGUAGE} from '../expand/dao/LanguageDao';
const URL = 'https://api.github.com/search/repositories?q=';
const QYERY_STR = '&sort=start'

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.LanguageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.dataRepository = new DataRepository();
        this.state = {
            languageArray: [],
        }
    }
    static  navigationOptions =  {
        headerTitle:'最热',
    }
    componentDidMount() {
        this.loadlanguageData();
    }
    loadlanguageData() {
        this.LanguageDao.fetch()
            .then(result=>{
                this.setState({
                    languageArray:result
                })
            })
            .catch(error=>{
                console.log(error);
            })
    }
    render() {
        const {navigation} = this.props;
        let statusBar={
            // backgroundColor: 'red',
            barStyle: 'dark-content',
        }
        let navigationBar =
            <NavigationBar
                title={'最热'}
                style={{backgroundColor:'#EE6363'}}
                statusBar={statusBar}
            />;
        const content = this.state.languageArray.length > 0 ? <ScrollableTabView
        tabBarBackgroundColor='#2196F3'
        tabBarActiveTextColor='white'
        tabBarInactiveTextColor='mintcream'
        tabBarUnderlineStyle={{backgroundColor:'#e7e7e7',height:2}}
        renderTabBar={() => <ScrollableTabBar/>}
    >
        {
            this.state.languageArray.map((item,index)=>{
                let languageItem = item;
                return languageItem.checked?<PopularTab key={index} tabLabel={languageItem.name}></PopularTab>:null;
            })
        }
    </ScrollableTabView> : null;
        return (
            <View style={styles.container}>
                {navigationBar}
                {content}
            </View>
        );
    }
}

class PopularTab extends Component {
    constructor(props) {
        super(props);
        this.dataRepository = new DataRepository();
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
            isLoading:true
        })
        let url = URL + this.props.tabLabel + QYERY_STR;
        this.dataRepository.fetchNetRepository(url)
            .then((result) => {
                this.setState({
                    dataSource: result.items,
                    isLoading:false
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    renderRow({item}) {
        return <RepositoryCell data={item}/>
    }

    render() {
        return (
            <View>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={(data) => this.renderRow(data)}
                    refreshControl={
                        <RefreshControl
                            title={'loading...'}
                            colors={['#2196F3']}
                            tintColor={'#2196F3'}
                            titleColor={'#2196F3'}
                            refreshing={this.state.isLoading}
                            onRefresh={()=>this.loadData()}
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
    }
});
