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

    const dataSource = new ListView.DataSource({
      getRowData: (dataBlob, sectionID, rowID) => dataBlob[rowID],
      getSectionHeaderData: (dataBlob, sectionID) => dataBlob[sectionID],
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => true,
    });

    this.dataBlob = {};
    this.sectionIDs = ["section"];
    this.dataBlob.section = ["附近集市"];
    this.rowIDs = [];
    this.rowIDs[0] = [];

    createTwentyRows(0).forEach((row)=>{
      this.rowIDs[0].push(row.id);
      this.dataBlob[row.id] = row;
    });

    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
      theta: new Animated.Value(45),

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
      <View style={styles.flipCardContainer}>
        <Animated.View style={[
          styles.flipCard,
          {transform: [
            {rotateX: this.state.theta.interpolate({
              inputRange: [0, 180],
              outputRange: ['0deg', '180deg']
            })},
          ]}]}>
          <Text style={styles.flipText}>
            附近集市
          </Text>
        </Animated.View>
        <Animated.View style={[styles.flipCard, {
          position: 'absolute',
          top: 0,
          backgroundColor: 'red',
          transform: [
            {rotateX: this.state.theta.interpolate({
              inputRange: [0, 180],
              outputRange: ['180deg', '360deg']
            })},
          ]}]}>
          <View style={styles.renderSectionHeader}>
            <Text>1111111</Text>
          </View>
        </Animated.View>
      </View>
    )
  }


  handleScroll(e){

    const under = e.nativeEvent.contentOffset.y - 300 < 0 ? false: true; // 350 手算的，没找到对应api。 后期可以让给 Header 一个 static height 的变量。
    if(under !== this.sticked){
      // this.sectionIDs = this.sticked ? ["normalSection"] : ["stickSection"] ;
      if(this.sticked){
        this.dataBlob.section = ["附近赶集"];
        Animated.timing(this.state.theta, {
          toValue: 0,
          duration: 5000,
        }).start();

      }else{
        this.dataBlob.section = ["全部","二手","租房","二手房"];
        this.state.theta.setValue(0);

        Animated.timing(this.state.theta, {
          toValue: 360,
          duration: 5000,
        }).start();


      }
      this.sticked = !this.sticked;
      // this.dataBlob
      // this.setState({
      //   dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs)
      // });
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
    borderBottomWidth: 1/ PixelRatio.get(),
    borderBottomColor: '#c3c3c3',
    backgroundColor: '#f5f5f5',
  },
  stickItem: {
    flexDirection: 'row',
    flex:1 ,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  active: {
    color: '#ff552e',
    borderWidth: 2,
    borderColor: '#ff552e',
  },
  content: {
    backgroundColor: 'deepskyblue',
    borderWidth: 1,
    borderColor: 'dodgerblue',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  container: {
    height: 500,
  },
  box1: {
    left: 0,
    backgroundColor: 'green',
    height: 50,
    position: 'absolute',
    top: 0,
    transform: [
      {translateX: 100},
      {translateY: 50},
      {rotate: '30deg'},
      {scaleX: 2},
      {scaleY: 2},
    ],
    width: 50,
  },
  box2: {
    left: 0,
    backgroundColor: 'purple',
    height: 50,
    position: 'absolute',
    top: 0,
    transform: [
      {scaleX: 2},
      {scaleY: 2},
      {translateX: 100},
      {translateY: 50},
      {rotate: '30deg'},
    ],
    width: 50,
  },
  box3step1: {
    left: 0,
    backgroundColor: 'lightpink',
    height: 50,
    position: 'absolute',
    top: 0,
    transform: [
      {rotate: '30deg'},
    ],
    width: 50,
  },
  box3step2: {
    left: 0,
    backgroundColor: 'hotpink',
    height: 50,
    opacity: 0.5,
    position: 'absolute',
    top: 0,
    transform: [
      {rotate: '30deg'},
      {scaleX: 2},
      {scaleY: 2},
    ],
    width: 50,
  },
  box3step3: {
    left: 0,
    backgroundColor: 'deeppink',
    height: 50,
    opacity: 0.5,
    position: 'absolute',
    top: 0,
    transform: [
      {rotate: '30deg'},
      {scaleX: 2},
      {scaleY: 2},
      {translateX: 100},
      {translateY: 50},
    ],
    width: 50,
  },
  box4: {
    left: 0,
    backgroundColor: 'darkorange',
    height: 50,
    position: 'absolute',
    top: 0,
    transform: [
      {translate: [200, 350]},
      {scale: 2.5},
      {rotate: '-0.2rad'},
    ],
    width: 100,
  },
  box5: {
    backgroundColor: 'maroon',
    height: 50,
    position: 'absolute',
    right: 0,
    top: 0,
    width: 50,
  },
  box5Transform: {
    transform: [
      {translate: [-50, 35]},
      {rotate: '50deg'},
      {scale: 2},
    ],
  },
  flipCardContainer: {
    marginVertical: 40,
    flex: 1,
    alignSelf: 'center',
  },
  flipCard: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    backfaceVisibility: 'hidden',
  },
  flipText: {
    width: 90,
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  }

})

export default Page;
