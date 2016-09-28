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

const STICK_ARR=["ALL","ER_SHOU","ZU_FANG","ER_SHOU_CHE"];

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
  const pageSize = 20;
  const rows = [];
  const last = dataStore[type].last;
  const start = dataStore[type].scope[0] + (page-1) * pageSize;
  const end = start + pageSize > dataStore[type].scope[1] ? dataStore[type].scope[1] : start + pageSize;

  dataStore[type].last += 20;

  for(let i = start; i < end; i++){
    const row = {};
    row.picUrl = `http://${host}/img/${i}.jpg`;
    row.time = (new Date()).toDateString();
    row.description = '第'  + i + ' 个数据: ' + TYPE_MAP[type].repeat(10) ;
    row.title = TYPE_MAP[type];
    row.infoid =  type + i;
    rows.push(row);
  }

  return rows;
}




class Page extends Component {
  
  constructor(props){
    super(props);

    this.sticked = false;
    this.didUpdata = true;
    this.page = 1;



    this.dataBlob = {};
    this.sectionIDs = ["section"];
    this.dataBlob.section = {stickTitle: "附近集市",stickItems: ["全部","二手","租房","二手房"],activeId:0};
    this.rowIDs = [];
    this.rowIDs[0] = [];

    getServerData({type:"ALL",page:this.page}).forEach((row)=>{
      this.rowIDs[0].push(row.infoid);
      this.dataBlob[row.infoid] = row;
    });

    // 修复 sectionHeaderHasChanged s1,s2 参数相同，无法对比的情况。注意判断的是 sectionData 的引用。 
    // FB 并不打算修复这个 BUG https://github.com/facebook/react-native/issues/8689
    const sectionHeaderHasChanged = (function(preActiveId) {
      return function(s2){
        const reRerender = s2.activeId !== preId;
        preActiveId = s2.activeId;
        return  reRerender;
      }
    })(this.dataBlob.section.activeId);

    const dataSource = new ListView.DataSource({
      getRowData: (dataBlob, sectionID, rowID) => dataBlob[rowID],
      getSectionHeaderData: (dataBlob, sectionID) => dataBlob[sectionID],
      rowHasChanged: (row1, row2) => false,
      sectionHeaderHasChanged: (s1, s2) => sectionHeaderHasChanged,
    });

    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
      sectionTop: new Animated.Value(0),
      underlineLeft: new Animated.Value(0),
      underlineWidth: new Animated.Value(0),
      activeColor: new Animated.Value(0),
    };

    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleEndReached  = this.handleEndReached.bind(this);
    this.handleSticksPress = this.handleSticksPress.bind(this);
    this.onSectionMount = this.onSectionMount.bind(this);
  }

  componentDidUpdate() {
    this.didUpdata = true;
  }


  handleSticksPress({index,underlineLefts=this.underlineLefts,underlineWidths=this.underlineWidths}){


    if(this.dataBlob.section.activeId !== index) {

      this.dataBlob.section.activeId = index;
      this.rowIDs[0] = [];
      this.page = 1;

      getServerData({type: STICK_ARR[index], page: this.page}).forEach((row)=>{
        this.rowIDs[0].push(row.infoid);
        this.dataBlob[row.infoid] = row;
      });

      Animated.timing(this.state.underlineWidth, {
        toValue: underlineWidths[index],
        duration: 10,
      }).start();


      Animated.timing(this.state.underlineLeft, {
        toValue:  underlineLefts[index],
        duration: 400,
      }).start();

      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs)
      });

    }

  }


  handleEndReached(){
    if(this.didUpdata){
      this.didUpdata = false;
      this.page = this.page + 1;

      getServerData({type: STICK_ARR[this.dataBlob.section.activeId], page: this.page}).forEach((row)=>{
        this.rowIDs[0].push(row.infoid);
        this.dataBlob[row.infoid] = row;
      });

      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs)
      });

    }
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


  onSectionMount({itemWidths=this.itemWidths,underlineWidths=this.underlineWidths,underlineLefts=this.underlineLefts,sectionDataArray}){

    itemWidths.reduce((sum,itemWidth,index)=>{
      underlineLefts[index] = sum  + (itemWidth / 2 - underlineWidths[index] / 2);
      return sum + itemWidth;
    },0);

    Animated.timing(this.state.underlineWidth, {
      toValue: underlineWidths[0],
      duration: 1,
    }).start();

    Animated.timing(this.state.underlineLeft, {
      toValue: underlineLefts[0],
      duration: 1,
    }).start();

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

    let calculationCount = 0;
    let firstRender = false;

    // 初始渲染时，记录渲染位置，再次渲染时只改变文字颜色。
    if(!this.underlineLefts){
      firstRender = true;

      this.underlineLefts = [];
      this.underlineWidths = [];
      this.itemWidths = [];
    }

    return(

      <View style={styles.renderSectionHeader}>
        <Animated.View style={
          {transform: [
            {translateY: this.state.sectionTop},
          ]}}>
            <View style={styles.stickTitle}>
              <Text style={styles.stickTitleText}>
                {sectionData.stickTitle}
              </Text>
            </View>
            <View>
              <View style={styles.stickItems}>
                {
                  sectionData.stickItems.map((text,index,sectionDataArray)=>{
                    return(
                      <TouchableOpacity 
                          activeOpacity={1}
                          style={styles.stickItem} 
                          key={index}
                          onPress={()=>this.handleSticksPress({index})}
                          onLayout={(event)=>{

                            if(firstRender) {
                              calculationCount++;
                              this.itemWidths[index] = event.nativeEvent.layout.width;

                              // 由于不知道组件的渲染顺序，所以使用了 this.itemWidths[index] = xxx，但是会导致数组空值的出现
                              // 所以用 calculationCount 来判断，数组是否填充完成。
                              if(calculationCount === sectionDataArray.length*2){
                                this.onSectionMount({sectionDataArray});
                              }
                            }
                          }}>
                        <View 
                            style={[styles.itemBox]} >
                          <Text 
                              style={[
                                styles.itemText,
                                this.dataBlob.section.activeId == index && styles.activeText
                                ]} 
                              onLayout={(event)=>{
                                if(firstRender){
                                  calculationCount++;
                                  this.underlineWidths[index] = event.nativeEvent.layout.width;

                                  if(calculationCount === sectionDataArray.length*2){
                                    this.onSectionMount({sectionDataArray});
                                  }
                                }
                              }}>
                            {text}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })
                }
              </View>
              <Animated.View style={[
                  styles.activeUnderline,
                  { 
                    left: this.state.underlineLeft,
                    width: this.state.underlineWidth,
                  }]}>
              </Animated.View>
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
            pageSize={10}
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
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1/ PixelRatio.get(),
    borderBottomColor: '#e5e5e5',
  },
  stickTitleText:{
    paddingLeft:15,
  },
  stickItems: {
    position:'relative',
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
    height:44,
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
    fontSize: 14,
    color: '#ff552e',
  },
  activeUnderline:{
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 2,
    backgroundColor: '#ff552e',
  }

})

export default Page;
