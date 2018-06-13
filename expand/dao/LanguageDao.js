
import React, {Component} from 'react';
import {
    AsyncStorage,
} from 'react-native';
import keys from '../../res/data/keys.json';
import langs from '../../res/data/langs.json';
export const FLAG_LANGUAGE = {flag_language:'flag_language_language', flag_key:'flag_language_key'}
export default class LanguageDao {
    constructor(flag) {
        this.flag = flag;
    }
    fetch() {
        return new Promise((resove,reject)=>{
            AsyncStorage.getItem(this.flag,(error,result)=>{
                if(error) {
                    reject(error);
                }else {
                    if(result) {
                        try {
                            resove(JSON.parse(result))
                        }catch (e) {
                            reject(e);
                        }
                    }else {
                        let data = this.flag === FLAG_LANGUAGE.flag_key ? keys : langs;
                        this.save(data);
                        resove(data);
                    }
                }
            })
        })
    }
    save(data) {
        AsyncStorage.setItem(this.flag,JSON.stringify(data),(error)=>{
            
        })
    }
}