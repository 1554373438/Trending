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

import DataRepository from '../expand/dao/DataRepository';
import RepositoryCell from '../components/RepositoryCell';

const URL = 'https://api.github.com/search/repositories?q=';
const QYERY_STR = '&sort=start'

export default class My extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>自定义标签</Text>
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
        alignItems: 'center',
        justifyContent: 'center',
    }
});
