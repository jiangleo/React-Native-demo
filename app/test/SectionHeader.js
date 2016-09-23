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
} from 'react-native';

import config from '../../config.js';

const host = config.host;


function createTwentyRows(start=0){
  const rows = [];

  for(let i = start;i < start + 20; i++){
    const row = {};
    row.picUrl = 'http://'+host+'/img/' + i + '.jpg';
    row.time = (new Date()).toDateString();
    row.description = row.picUrl;
    row.title = "第 " + i + " 个数据";
  }

  return rows;
}




export default class SectionHeaderDemo extends Component{
  constructor(props) {
    super(props);

    var getSectionData = (dataBlob, sectionID) => {
      return dataBlob[sectionID];
    };
    var getRowData = (dataBlob, sectionID, rowID) => {
      return dataBlob[rowID];
    };

    var dataSource = new ListView.DataSource({
      getRowData: getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });


    this.dataBlob = {};
    this.sectionIDs = ["normalSection"];
    this.rowIDs = [];
    this.dataBlob.normalSection = "附近集市";
    this.dataBlob.stickSection = ["全部","二手","租房","二手房"];

    // 获取数据
    const rowsData = createTwentyRows(0);
    this.rowIDs[0] = ["1","2"];
    rowsData.forEach((row,index)=>{
      this.dataBlob[index] = row
    });

    this.state = {
      dataSource: dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
    };



    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.renderRow = this.renderRow.bind(this);

  }

  renderRow(rowData,sectionID,rowID){
    return(
      <View style={styles.header}>
        <Text style={styles.rowText}>
          {rowData}
        </Text>
      </View>
    )
  }

  renderSectionHeader(sectionData, sectionID){
    return (
      <View style={styles.section}>
        <Text style={styles.text}>
          {sectionData}
        </Text>
      </View>
    )
  }

  componentDidMount() {
      // setTimeout(()=>{
      //   // 当 sectionID 的变化时，小标题的内容才会更新。
      //   this.sectionIDs[1] = "Changed";
      //   this.dataBlob["Changed"] = "ChangedSectionHeader";

      //   this.setState({
      //     dataSource: this.state.dataSource.cloneWithRowsAndSections(this.dataBlob, this.sectionIDs, this.rowIDs),
      //   })
      // },2000);
  }

  render(){
    return(
      <ListView
        dataSource={this.state.dataSource}
        renderSectionHeader={this.renderSectionHeader}
        renderRow={this.renderRow}
      />
    );
  }
}


const styles = StyleSheet.create({
  listview: {
    backgroundColor: '#B0C4DE',
  },
  header: {
    height: 40,
  },
  text: {
    color: 'white',
    paddingHorizontal: 8,
  },
  rowText: {
    color: '#888888',
  },
  thumbText: {
    fontSize: 20,
    color: '#888888',
  },
  buttonContents: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 3,
    padding: 5,
    backgroundColor: '#EAEAEA',
    borderRadius: 3,
    paddingVertical: 10,
  },
  img: {
    width: 64,
    height: 64,
    marginHorizontal: 10,
    backgroundColor: 'transparent',
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 6,
    backgroundColor: '#5890ff',
  },
});