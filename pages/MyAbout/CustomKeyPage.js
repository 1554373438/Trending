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
import ViewUtils from '../../util/ViewUtils';
import ArrayUtils from '../../util/ArrayUtils';
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';

export default class CustomKeyPage extends Component {
    constructor(props) {
        super(props);
        this.LanguageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
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
        data.checked = !data.checked;
        ArrayUtils.updataArray(this.changevalues, data);
    }
    renderCheckBox(data) {
        return <CheckBox
            style={{flex:1,padding:10}}
            onClick={()=>this.onClickCheckBox(data)}
            leftText={data.name}
            isChecked={data.checked}
            checkedImage={
                <Image style={{tintColor:'#6495ED'}} source={require('../../res/images/ic_check_box.png')}/>
            }
            unCheckedImage={
                <Image style={{tintColor:'#6495ED'}} source={require('../../res/images/ic_check_box_outline_blank.png')}/>
            }
        />
    }
    render() {
        const {navigation} = this.props;
        let rightButton = <TouchableOpacity
            onPress={()=>this.save()}
            >
            <View style={{margin:10}}>
                <Text style={styles.title}>保存</Text>
            </View>
            </TouchableOpacity>
        return (
            <View style={styles.container}>
            {/* <Navigationbar
                title='自定义标签'
                style={{backgroundColor:'white'}}
                leftButton={ViewUtils.getLeftButton(()=>this.onBack())}
                rightButton={rightButton}
            /> */}
                <ScrollView>
                    {this.renderView()}
                    <Text onPress={()=>this.onSave()}>保存</Text>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
    flex:1,
    },
    title:{
        fontSize:22,
    },
    item:{
        flexDirection:'row',
        alignItems:'center',
    },
    bottomLine:{
        borderBottomWidth:0.7,
        borderColor:'darkgray',
    }

});
