import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  ScrollView,
  PixelRatio,
  Animated,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';

import InfiniteScrollView from 'react-native-infinite-scroll-view';

import MarketItem from '../component/MarketItem';
import Tabs from '../component/Tabs';
import Header from './Header.js'
import config from '../../config.js';

const host = config.host;
const gif = require('../images/gif.gif');


// 替代请求数据
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

const TYPE_MAP = {
  ALL: "全部",
  ER_SHOU: "二手",
  ZU_FANG: "租房",
  ER_SHOU_CHE: "二手车",
}

const dataStore = {
  ALL: {
    last: 0,
    scope: [0,1999]
  },
  ER_SHOU: {
    last: 0,
    scope: [0, 59]
  },
  ZU_FANG: {
    last: 60,
    scope:[60,499]
  },
  ER_SHOU_CHE: {
    last: 500,
    scope:[500,1999]
  },
}

function getServerData({type,page}){
  const rows = [];
  const last = dataStore[type].last;

  // dataStore[type].last += 20;

  // for(let i = last;last + i < dataSource || i < last + 20; i++){
  //   const row = {};

  //   row.picUrl = 'http://'+host+'/img/' + (last + i) + '.jpg';
  //   row.time = (new Date()).toDateString();
  //   row.description = '第'  + (last + i) + ' 个数据: ' + TYPE_MAP[type].repeat(10) ;
  //   row.title = TYPE_MAP[type];
  //   row.infoid =  type + i;
  //   rows.push(row);
  // }

  return rows;
}




class Page extends Component {
  
  constructor(props){
    super(props);

    this.dataBlob = {};
    this.sectionIDs = ["section"];
    this.dataBlob.section = {stickTitle: "附近集市",stickItems: ["全部","二手","租房","二手房"],activeId:0};
    this.rowIDs = [];
    this.rowIDs[0] = [];

    createTwentyRows(0).forEach((row)=>{
      this.rowIDs[0].push(row.id);
      this.dataBlob[row.id] = row;
    });

    // 修复 sectionHeaderHasChanged s1,s2 参数相同，无法对比的情况。注意判断的是 sectionData 的引用。 
    // FB 并不打算修复这个 BUG https://github.com/facebook/react-native/issues/8689
    const sectionHeaderHasChanged = (function(preActiveId) {
      return function(s2){
        let reRerender = s2.activeId !== preId;
        preActiveId = s2.activeId;
        return  reRerender;
      }
    })(this.dataBlob.section.activeId);

    const dataSource = new ListView.DataSource({
      getRowData: (dataBlob, sectionID, rowID) => dataBlob[rowID],
      getSectionHeaderData: (dataBlob, sectionID) => dataBlob[sectionID],
      rowHasChanged: (row1, row2) => true,
      sectionHeaderHasChanged: (s1, s2) => sectionHeaderHasChanged,
    });

    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
      sectionTop: new Animated.Value(0),
    };


    this.sticked = false;
    this.didUpdata = false;
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleEndReached  = this.handleEndReached.bind(this);
    this.handleSticksPress = this.handleSticksPress.bind(this);
  }

  componentDidUpdate() {
    this.didMount = true;
  }


  handleSticksPress(index){

    if(this.dataBlob.section.activeId !== index) {

      this.dataBlob.section.activeId = index;
      this.rowIDs[0] = [];

      createTwentyRows(index*500).forEach((row)=>{
        this.rowIDs[0].push(row.id);
        this.dataBlob[row.id] = row;
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs)
      });

    }

  }


  handleEndReached(){

    // if(this.didMount){
    //   this.didMount = false;

    //   const  = 

    //   createTwentyRows(this.rowIDs[0][] || 0).forEach((row)=>{
    //     this.rowIDs[0].push(row.id);
    //     this.dataBlob[row.id] = row;
    //   });



    // }
  }


  handleScroll(e){
    // 350 手算的，没找到对应api。 后期可以让给 Header 一个 static height 的变量。 注意

    const under = e.nativeEvent.contentOffset.y - 350 < 0 ? false: true;

    if(under !== this.sticked){
      if(this.sticked){
        // 下翻
        Animated.timing(this.state.sectionTop, {
          toValue: 0,
          duration: 400,
        }).start();

      }else{
        // 上翻
        Animated.timing(this.state.sectionTop, {
          toValue: -44,
          duration: 500,
        }).start();

      }
      this.sticked = !this.sticked;
    }
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


  renderSectionHeader(sectionData,sectionID){
    return(

      <View style={styles.renderSectionHeader}>
        <Animated.View style={
          {transform: [
            {translateY: this.state.sectionTop},
          ]}}>
            <View style={styles.stickTitle}>
              <Text>
                {sectionData.stickTitle}
              </Text>
            </View>
            <View style={styles.stickItems}>
              {
                sectionData.stickItems.map((text,index)=>{
                  return(
                    <TouchableOpacity 
                        activeOpacity={1}
                        style={styles.stickItem} 
                        key={index}
                        onPress={()=>this.handleSticksPress(index)}>
                      <View style={[styles.itemBox,sectionData.activeId === index && styles.activeBox]}>
                        <Text style={[styles.itemText,sectionData.activeId === index && styles.activeText]}>{text}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                })
              }
            </View>
        </Animated.View>
      </View>

    )
  }

  render(){
    return(
        <View style={{flex:1,position:'relative'}}>
          <ListView
            initialListSize={1}
            showsVerticalScrollIndicator={false}
            dataSource={this.state.dataSource}
            renderHeader={this.renderHeader}
            renderSectionHeader={this.renderSectionHeader}
            renderRow={this.renderRow}
            onEndReachedThreshold={100}
            onEndReached={this.handleEndReached}
            onScroll={this.handleScroll}
          />
        </View>
    )
  }
}



const styles = StyleSheet.create({
  renderSectionHeader: {
    backgroundColor: '#fff',
    height:44,
    overflow:'hidden',
  },
  stickTitle: {
    flex:1 ,
    height: 44,
    paddingLeft:15,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1/ PixelRatio.get(),
    borderBottomColor: '#e5e5e5',
  },
  stickItems: {
    flexDirection: 'row',
    flex:1 ,
    height: 44,
    alignItems: 'stretch',
    backgroundColor: '#fff',
    borderBottomWidth: 1/ PixelRatio.get(),
    borderBottomColor: '#e5e5e5',
  },
  stickItem:{
    flex:1,
    height:44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemBox:{
    flexDirection: 'row',
    height:42,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  itemText:{

  },
  activeBox: {
    borderColor: '#ff552e',
  },
  activeText: {
    color: '#ff552e',
  },





})

export default Page;
