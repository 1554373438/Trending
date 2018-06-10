import React  from 'react';
import {
    TouchableHighlight,
    Image,
    TouchableOpacity,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default class ArrayUtils {
    /**
     * 更新数组，若item 已存在则从数组中将它移除，否则添加到数据
     */
    static updataArray(array, item) {
        for(var i=0,len=array.length;i<len;i++) {
            var temp = array[i];
            if(item === item) {
                array.splice(i,1);
                return;
            }
        }
        array.push(item);
    }
    /**
     * clone 数组
     * @return Array 新的数组
     * */
    static clone(from){
        if(!from)return [];
        let newArray=[];
        for(let i=0,l=from.length;i<l;i++){
            newArray[i]=from[i];
        }
        return newArray;
    }
    /**
     * 判断两个数组的是否相等
     * @return boolean true 数组长度相等且对应元素相等
     * */
    static isEqual(arr1,arr2){
        if(!(arr1&&arr2))return false;
        if(arr1.length!=arr2.length)return false;
        for(let i=0,l=arr1.length;i<l;i++){
            if (arr1[i]!=arr2[i])return false;
        }
        return true;
    }
}