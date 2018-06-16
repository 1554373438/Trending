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
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import NavigationBar from '../../components/NavigationBar';

import ViewUtils from '../../util/ViewUtils';
import ArrayUtils from '../../util/ArrayUtils';
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';

export default class CustomKeyPage extends Component {
    constructor(props) {
        super(props);
        this.isRemoveKey = this.props.navigation.state.params.isRemoveKey ? true:false;
        this.LanguageDao = new LanguageDao(this.props.navigation.state.params.flag);
        this.changevalues=[];
        this.state = {
            dataArry: []
        }
    }
    componentDidMount() {
        this.loadData();
    }
    loadData() {
        this.LanguageDao.fetch()
            .then(result=>{
                this.setState({
                    dataArry:result
                })
            })
            .catch(error=>{
                console.log(error);
            })
    }
    onSave() {
        if(this.changevalues.length === 0) {
            this.props.navigation.goBack();
            return;
        }
        if(this.isRemoveKey){
            for(let i=0,l=this.changevalues.length;i<l;i++){
                ArrayUtils.remove(this.state.dataArry,this.changevalues[i]);
            }
        }
        this.LanguageDao.save(this.state.dataArry);
        this.props.navigation.goBack(); 
    }
    onBack() {
        if(this.changevalues.length === 0) {
            this.props.navigation.goBack();
            return;
        }
        Alert.alert(
            '提示',
            '要修改保存吗？',
            [
              {text: '不保存', onPress: () => {
                this.props.navigation.goBack();
              }, style: 'cancel'},
              {text: '保存', onPress: () => this.onSave()},
            ],
            { cancelable: false }
          )
    }
    renderView() {
        if(!this.state.dataArry || this.state.dataArry.length === 0) return null;
        let len = this.state.dataArry.length;
        let views = [];
        for(let i=0; i < len-2 ; i+= 2) {
            views.push(
                <View key={i}>
                    <View style={[styles.item, styles.bottomLine]}>
                        {this.renderCheckBox(this.state.dataArry[i])}
                        {this.renderCheckBox(this.state.dataArry[i+1])}
                    </View>
                </View>
            )
        }
        views.push(
            <View key={len-1}>
                <View style={styles.item}>
                    {len%2 === 0 ? this.renderCheckBox(this.state.dataArry[len-1]): null}
                    {this.renderCheckBox(this.state.dataArry[len-1])}
                </View>
            </View>
        )
        return views;
    }
    onClickCheckBox(data) {
        if(!this.isRemoveKey)data.checked = !data.checked;
        ArrayUtils.updataArray(this.changevalues, data);
    }
    renderCheckBox(data) {
        let isChecked = this.isRemoveKey ? false : data.checked;
        return <CheckBox
            style={{flex:1,padding:10}}
            onClick={()=>this.onClickCheckBox(data)}
            leftText={data.name}
            isChecked={isChecked}
            checkedImage={
                <Image style={{tintColor:'#6495ED'}} source={require('../../res/images/ic_check_box.png')}/>
            }
            unCheckedImage={
                <Image style={{tintColor:'#6495ED'}} source={require('../../res/images/ic_check_box_outline_blank.png')}/>
            }
        />
    }
    render() {
        let rightBuyttonTitle = this.isRemoveKey ? '移除' : '保存'
        let rightButton = <TouchableOpacity
            onPress={()=>this.onSave()}
            >
            <View style={{margin:10}}>
                <Text style={styles.title}>{rightBuyttonTitle}</Text>
            </View>
            </TouchableOpacity>
        let navTitle = this.isRemoveKey ? '标签移除' : '自定义标签';
        navTitle = this.props.navigation.state.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : navTitle;
        return (
            <View style={styles.container}>
            <NavigationBar
                title= {navTitle}
                style={{backgroundColor:'#EE6363'}}
                leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                rightButton={rightButton}
            />
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
    flex:1,
    },

    item:{
        flexDirection:'row',
        alignItems:'center',
    },
    bottomLine:{
        borderBottomWidth:0.7,
        borderColor:'darkgray',
    },
    title: {
        fontSize: 20,
        color: '#FFF',
    }

});
