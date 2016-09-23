import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

class MyCard extends Component {
  render(){
    const {uri,title,description} = this.props;
    return(
      <View style={styles.box}>
        <Image style={styles.icon} source={{uri:uri}}/>
        <View style={styles.text}>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.description}>
            {description}
          </Text>
        </View>
        <Text>
          >
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#fff',
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 15,
  },
  text: {
    flex:1,
    justifyContent: 'center',
    height: 40,
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  description:{
    fontSize:12,
    color: '#999',
  }
});

export default MyCard;
