import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

class MarketItem extends Component {
  render(){
    const {uri,title,description,time} = this.props;
    return(
      <View style={styles.box}>
        <Image
          style={styles.icon}
           source={{uri:uri}}
         />
        <View style={styles.text}>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.description}>
            {description}
          </Text>
          <Text style={styles.time}>
            {time}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 106,
    backgroundColor: '#fff',
    paddingRight:15,
    paddingLeft:15,
  },
  icon: {
    width: 100,
    height: 76,
    resizeMode: 'contain',
  },
  text: {
    flex:1,
    height: 76,
    marginLeft: 15,
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  description:{
    fontSize:12,
    lineHeight: 18,
    color: '#999',
  },
  time:{
    fontSize:12,
    lineHeight: 18,
    color: '#999',
    textAlign:'right',
  }
});

export default MarketItem;
