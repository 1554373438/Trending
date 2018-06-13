import {
    AsyncStorage,
} from 'react-native';
import Trending from "GitHubTrending";
export var FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending', flag_my: 'my'}

export default class DataRepository {
    constructor(flag) {
        this.flag = flag;
        if (flag === FLAG_STORAGE.flag_trending)this.treding = new Trending();
    }

    fetchRepository(url) {
        return new Promise((resolve, reject)=> {
            this.fetchLocalRepository(url).then((result)=> {
                if (result) {
                    resolve(result);
                } else {
                    this.fetchNetRepository(url).then((result)=> {
                        resolve(result);
                    }).catch((error)=> {
                        reject(error);
                    })
                }

            }).catch((error)=> {
                this.fetchNetRepository(url).then((result)=> {
                    resolve(result);
                }).catch((error=> {
                    reject(error);
                }))
            })
        })
    }
    /**
     * 获取本地数据
     * @params url
     * @return {Promise}
     **/
    fetchLocalRepository(url) {
        return new Promise((resolve, reject)=> {
            AsyncStorage.getItem(url, (error, result)=> {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                        console.error(e);
                    }
                } else {
                    reject(error);
                    console.error(error);
                }
            })
        })
    }
    /**
     * 获取网络数据
     * @params url
     * @return {Promise}
     **/
    fetchNetRepository(url) {
        return new Promise((resolve, reject)=>{
            if (this.flag !== FLAG_STORAGE.flag_trending) {
                fetch(url)
                    .then(response=>response.json())
                    .then(result=>{
                        if(!result) {
                            reject(new Error('responseData is null'));
                            return;
                        }
                        resolve(result.items);
                        this.saveRepository(url, result.items);
                    })
                    .catch(error=>{
                        reject(error);
                    })
            }else {
                this.treding.fetchTrending(url)
                    .then((items)=> {
                        if (!items) {
                            reject(new Error('responseData is null'));
                            return;
                        }
                        resolve(items);
                        this.saveRepository(url, items)
                    }).catch((error)=> {
                    reject(error);
                })
            }

        })
    }

    saveRepository(url, items, callback) {
        if (!items || !url)return;
        let wrapData = {items: items, update_date: new Date().getTime()};
        AsyncStorage.setItem(url, JSON.stringify(wrapData), callback);
    }

    /**
     * 检查项目更新时间
     * @param longTime 项目更新时间戳
     * @return {boolean} true 不需要更新,false需要更新
     */
    checkDate(longTime) {
        let currentDate = new Date();
        let targetDate = new Date();
        targetDate.setTime(longTime);
        if (currentDate.getMonth() !== targetDate.getMonth())return false;
        if (currentDate.getDate() !== targetDate.getDate())return false;
        if (currentDate.getHours() - targetDate.getHours() > 1)return false;
        // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
        return true;
    }
}