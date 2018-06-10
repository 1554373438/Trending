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
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Alert
} from 'react-native';
import SortableListView from 'react-native-sortable-listview';
import NavigationBar from '../../components/NavigationBar';

import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
import ArrayUtils from '../../util/ArrayUtils';
import ViewUtils from '../../util/ViewUtils';

export default class SortKeyPage extends Component {
    constructor(props) {
        super(props);
        this.LanguageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        this.dataArray = [];
        this.sortResultArray = [];
        this.originalCheckedArray = [];
        this.state = {
            checkedArray: []
        }
    }
    componentDidMount() {
        this.loadData();
    }
    loadData() {
        this.LanguageDao.fetch().then((data)=> {
            this.getCheckedItems(data);
        }).catch((error)=> {
            console.log(error);
        });
    }
    getCheckedItems(dataArray) {
        this.dataArray = dataArray;
        let checkedArray = [];
        for (let i = 0, j = dataArray.length; i < j; i++) {
            let data = dataArray[i];
            if (data.checked)checkedArray.push(data);
        }
        this.setState({
            checkedArray: checkedArray
        })
        this.originalCheckedArray = ArrayUtils.clone(checkedArray);
    }
    onBack() {
        if (!ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
            Alert.alert(
                '提示',
                '是否要保存修改呢?',
                [
                    {
                        text: '否', onPress: () => {
                        this.props.navigator.pop();
                    }
                    }, {
                    text: '是', onPress: () => {
                        this.onSave(true);
                    }
                }
                ]
            )
        } else {
            this.props.navigation.goBack();
        }
    }
    onSave(haChecked) {
        if (!haChecked) {
            if (ArrayUtils.isEqual(this.originalCheckedArray, this.state.checkedArray)) {
                this.props.navigation.goBack();
                return;
            }
        }
        this.getSortResult();
        this.LanguageDao.save(this.sortResultArray);
        this.props.navigation.goBack();
    }
    getSortResult() {
        this.sortResultArray = ArrayUtils.clone(this.dataArray);
        for (let i = 0, j = this.originalCheckedArray.length; i < j; i++) {
            let item = this.originalCheckedArray[i];
            let index = this.dataArray.indexOf(item);
            this.sortResultArray.splice(index, 1, this.state.checkedArray[i]);
        }
    }
    render() {
        const {navigation} = this.props;
        let rightButton = <TouchableOpacity
            onPress={()=>this.onSave()}
            >
            <View style={{margin:10}}>
                <Text style={styles.title}>保存</Text>
            </View>
            </TouchableOpacity>
        return (
            <View style={styles.container}>
            <NavigationBar
                title='标签排序'
                style={{backgroundColor:'#6495ED'}}
                leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                rightButton={rightButton}
            />
                <SortableListView
                    data={this.state.checkedArray}
                    order={Object.keys(this.state.checkedArray)}
                    onRowMoved={(e) => {
                        this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
                        this.forceUpdate();
                    }}
                    renderRow={row => <SortCell data={row} {...this.props}/>}
                />
            </View>
        );
    }
}
class SortCell extends Component {
    render() {
        return  (
            <TouchableHighlight
            underlayColor={'#eee'}
            style={styles.item}
            {...this.props.sortHandlers}>
            <View style={styles.row}>
                <Image source={require('../../res/images/ic_sort.png')} resizeMode='stretch' style={styles.image}/>
                <Text>{this.props.data.name}</Text>
            </View>
        </TouchableHighlight>
        )   
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        padding:15,
        backgroundColor: "#F8F8F8",
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 50,
        justifyContent: 'center'
    },
    row: {
        flexDirection:'row',
        alignItems:'center',
    },
    image: {
        width: 16,
        height: 16,
        marginRight: 10,
        tintColor:'#2196F3',
    },
    title: {
        fontSize: 20,
        color: '#FFF',
    }

});
