import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  ScrollView,
  PixelRatio,
  TouchableOpacity,
  Animated,
} from 'react-native';

import InfiniteScrollView from 'react-native-infinite-scroll-view';

import MarketItem from '../component/MarketItem';
import Tabs from '../component/Tabs';
import Header from '../container/Header.js'
import config from '../../config.js';

const host = config.host;
const gif = require('../images/gif.gif');



function createTwentyRows(start=0){
  const rows = [];

  for(let i = start;i < start + 20; i++){
    const row = {};
    row.picUrl = 'http://'+host+'/img/' + i + '.jpg';
    row.time = (new Date()).toDateString();
    row.description = row.picUrl;
    row.title = "第 " + i + " 个数据";
    row.id = i;
    rows.push(row);
  }

  return rows;
}




class Page extends Component {
  
  constructor(props){
    super(props);

    this.dataBlob = {};
    this.sectionIDs = ["section"];
    this.dataBlob.section = ["附近集市"];
    this.rowIDs = [];
    this.rowIDs[0] = [];

    createTwentyRows(0).forEach((row)=>{
      this.rowIDs[0].push(row.id);
      this.dataBlob[row.id] = row;
    });

    // 修复 https://github.com/facebook/react-native/issues/8689
    const sectionHeaderHasChanged = (function(s1) {
      return function(s2){
        let reRerender = s2 !== s1;
        s1 = s2;
        return  reRerender;
      }
    })(this.dataBlob.section);

    const dataSource = new ListView.DataSource({
      getRowData: (dataBlob, sectionID, rowID) => dataBlob[rowID],
      getSectionHeaderData: (dataBlob, sectionID) => dataBlob[sectionID],
      rowHasChanged:(row1,row2)=> row1!==row2,
      sectionHeaderHasChanged: sectionHeaderHasChanged,
    });


    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
      theta: new Animated.Value(0),
    };


    this.sticked = false;
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.onEndReached  = this.onEndReached.bind(this);
  }


  componentDidMount() {
    // Animated.timing(          // Uses easing functions
    //   this.state.fadeAnim,    // The value to drive
    //   {
    //     toValue: 1,
    //     duration: 3000, 
    //   }            // Configuration
    // ).start();                // Don't forget start!
  }


  renderRow(rowData,sectionID,rowID){
    return(
      <MarketItem
        uri={rowData.picUrl}
        title={rowData.title}
        description={rowData.description}
        time={rowData.time}
      />
    )
  }

  renderHeader(){
    return (
      <Header/>
    )
  }

  onEndReached(){
    // this.list = this.list.concat(this.createTwentyRows(this.list.pop()));
    // setTimeout( () => {
    //   this.setState({
    //     dataSource: this.state.dataSource.cloneWithRows(this.list)
    //   })
    // },1000)
  }

  renderSectionHeader(sectionData,sectionID){

    return(
      <View style={styles.renderSectionHeader}>
        <Animated.View style={[
            styles.ani,
            {transform: [
              {translateY: this.state.theta},
            ]}
          ]}>
          <View>
            <Text style={[styles.stickItem,{backgroundColor: "#0ac"}]}>
              {sectionData[0]}
            </Text>
            <Text style={[styles.stickItem,{backgroundColor: "#0ca"}]}>
              {sectionData[0]}
            </Text>
          </View>
        </Animated.View>
      </View>
    )
  }


  handleScroll(e){

    const under = e.nativeEvent.contentOffset.y - 200 < 0 ? false: true; // 350 手算的，没找到对应api。 后期可以让给 Header 一个 static height 的变量。
    if(under !== this.sticked){
      // this.sectionIDs = this.sticked ? ["normalSection"] : ["stickSection"] ;
      if(this.sticked){
        this.dataBlob.section = ["附近赶集"];
        Animated.timing(this.state.theta, {
          toValue: 0,
          duration: 1000,
        }).start();

      }else{
        this.dataBlob.section = ["全部","二手","租房","二手房"];
        this.state.theta.setValue(0);

        Animated.timing(this.state.theta, {
          toValue: -50,
          duration: 1000,
        }).start();


      }
      this.sticked = !this.sticked;
      this.dataBlob
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs)
      });
    }
  }



  render(){
    return(
        <View style={{flex:1,position:'relative'}}>
          <ListView
            initialListSize={1}
            pageSize={1}
            showsVerticalScrollIndicator={false}
            renderHeader={this.renderHeader}
            renderSectionHeader={this.renderSectionHeader}
            renderRow={this.renderRow}
            dataSource={this.state.dataSource}
            onEndReachedThreshold={500}
            onEndReached={this.onEndReached}
            onScroll={this.handleScroll}
          />
        </View>
    )
  }
}



const styles = StyleSheet.create({
  renderSectionHeader: {
    flexDirection: 'row',
    height:50,
    borderBottomWidth: 1/PixelRatio.get(),
    borderBottomColor: '#c3c3c3',
    backgroundColor: '#f5f5f5',
    overflow:'hidden',
  },
  stickItem: {
    height: 50,
  },
  active: {
    color: '#ff552e',
    borderWidth: 2,
    borderColor: '#ff552e',
  },
  ani: {
    backgroundColor:'#f3f3f3',
  }

})

export default Page;
