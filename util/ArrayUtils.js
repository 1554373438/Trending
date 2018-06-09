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
}