import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

class RecommendCard extends Component {
  render(){
    const {uri,title,description} = this.props;
    return(
      <View style={styles.box}>
        <View style={styles.text}>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.description}>
            {description}
          </Text>
        </View>
        <Image style={styles.icon} source={{uri:uri}}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  box: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    backgroundColor: '#fff',
    paddingLeft:15,
    paddingRight:15,
  },
  icon: {
    width: 40,
    height: 40,
  },
  text: {
    flex:1,
    height: 40,
  },
  title: {
    fontSize: 16,
    color: '#333',
  },
  description:{
    fontSize:12,
    lineHeight: 18,
    color: '#999',
  }
});

export default RecommendCard;
