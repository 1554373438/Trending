import React from 'react';
import {Button} from 'react-native';
import {StackNavigator, TabNavigator} from 'react-navigation';
import Welcome from '../pages/Welcome';
import PopularPage from '../pages/PopularPage';
import Trending from '../pages/Trending';
import Favarite from '../pages/Favarite';
import My from '../pages/MyAbout/My';
import CustomKeyPage from '../pages/MyAbout/CustomKeyPage';

import Ionicons from 'react-native-vector-icons/Ionicons';

export const AppTabNavigator = TabNavigator({
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            title:'最热',
            headerTitle:'最热',
            tabBarLabel: '最热',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={focused ? 'ios-home' : 'ios-home-outline'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    },
    Trending: {
        screen: Trending,
        navigationOptions: {
            title:'最热',
            tabBarLabel: '趋势',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={focused ? 'ios-home' : 'ios-home-outline'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    },
    Favarite: {
        screen: Favarite,
        navigationOptions: {
            title:'最热',
            tabBarLabel: '收藏',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={focused ? 'ios-heart' : 'ios-heart-outline'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    },
    My: {
        screen: My,
        navigationOptions: {
            title:'最热',
            tabBarLabel: '我的',
            tabBarIcon: ({tintColor, focused}) => (
                <Ionicons
                    name={focused ? 'ios-person' : 'ios-person-outline'}
                    size={26}
                    style={{color: tintColor}}
                />
            )
        }
    },
});

export const AppStackNavigator = StackNavigator({
    Welcome: {
        screen: Welcome,
    },
    CustomKeyPage: {
        screen: CustomKeyPage,
    },
    TabNav: {
        screen: AppTabNavigator,
    },
},{
    navigationOptions: {
        title:'Trending',
        // header:null,
    }
});