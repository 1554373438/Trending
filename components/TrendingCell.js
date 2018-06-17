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
    TouchableOpacity
} from 'react-native';
import HTMLView from 'react-native-htmlview';

export default class TrendingCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFavorite: this.props.data.isFavorite,
            favoriteIcon: this.props.data.isFavorite ? require('../res/images/ic_star.png') : require('../res/images/ic_unstar_transparent.png'),
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setFavoriteState(nextProps.data.isFavorite);
    }

    onPressFavorite() {
        this.setFavoriteState(!this.state.isFavorite);
        this.props.onFavorite(this.props.data.modelItem, !this.state.isFavorite)
    }

    setFavoriteState(isFavorite) {
        this.state.isFavorite = isFavorite;
        this.setState({
            isFavorite: isFavorite,
            favoriteIcon: isFavorite ? require('../res/images/ic_star.png') : require('../res/images/ic_unstar_transparent.png')
        })
    }

    render() {
        let favoriteButton = (
            <TouchableOpacity
                style={{padding: 6}}
                onPress={() => this.onPressFavorite()} underlayColor='transparent'>
                <Image
                    ref='favoriteIcon'
                    style={{width: 22, height: 22, tintColor: '#2196F3'}}
                    source={this.state.favoriteIcon}/>
            </TouchableOpacity>
        )
        let itemData = this.props.data.modelItem;
        let description = '<p>' + itemData.description + '</p>'
        return <TouchableOpacity
            onPress={this.props.onSelect}
        >
            <View style={styles.cell_container}>
                <Text style={styles.title}>{itemData.fullName}</Text>
                {/*<Text style={styles.description}>{itemData.description}</Text>*/}
                <HTMLView
                    value={itemData.description}
                    onLinkPress={(url) => {
                    }}
                    stylesheet={{
                        p: styles.description,
                        a: styles.description,
                    }}

                />
                <Text style={styles.description}>{itemData.meta}</Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text>Build By:</Text>
                        {itemData.contributors.map((result, i, arr) => {
                            return <Image
                                style={{height: 20, width: 20, borderRadius: 10,}}
                                source={{uri: arr[i]}}
                                key={i}
                            />
                        })}
                    </View>
                    {favoriteButton}
                </View>
            </View>
        </TouchableOpacity>
    }
}
const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        color: '#212121',
        marginBottom: 2
    },
    description: {
        fontSize: 16,
        color: '#757575',
        marginBottom: 2
    },
    cell_container: {
        backgroundColor: 'white',
        padding: 10,
        marginHorizontal: 5,
        marginVertical: 3,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2,
    }
})