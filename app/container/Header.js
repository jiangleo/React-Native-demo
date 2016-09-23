import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';

import MyCard from '../component/MyCard';
import RecommendCard from '../component/RecommendCard';
import config from '../../config.js';
const host = config.host;

import {myCardContent,recommendCardContent} from '../constans/card';


class Header extends Component {
  constructor(props) {
    super(props);
  
  }

  shouldComponentUpdate(nextProps, nextState) {
    // 节约性能
    return false;
  }

  render(){
    return(
      <View style={styles.container}>
        <View style={styles.myCardBox}>
          {
            myCardContent.map((content)=>{
              return (
                <MyCard 
                  uri={content.uri}
                  title={content.title}
                  description={content.description}
                />
              )
            })
          }
        </View>
        <View style={styles.recommendCardBox}>
          {
            recommendCardContent.map((content)=>{
              return(
                <View style={styles.recommendRows}>
                  {
                    content.map((c)=>{
                      return(
                        <RecommendCard
                          uri={c.uri}
                          title={c.title}
                          description={c.description}
                        />
                      )
                    })
                  }
                </View>
              )
            })
          }
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e5e5e5'
  },
  myCardBox:{
    marginBottom: 15,
  },
  recommendCardBox:{
    marginBottom: 15,
  },
  recommendRows:{
    flexDirection:'row'
  },
});


export default Header;