import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
} from 'react-native';


export default class NormalList extends Component{
  constructor(props){
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(this.createRows()),
    }
  }
  render(){
    return(
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
      />
    )
  }
  createRows(){
    const rows = [];
    for(let i = 0;i < 1000; i++){
      rows.push("row" + i);
    }
    return rows;
  }
  renderRow(rowData,sectionID,rowID){
    const picUrl = 'http://10.252.166.108:3000/build/' + rowID + '.png';
    return(
      <View style={styles.row}>
        <Image style={styles.img} source={{uri: picUrl}} />
        <Text style={styles.tex}>{picUrl}</Text>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  row:{
    flexDirection:'row',
  },
  img: {
    width: 100,
    height: 100,
  },
  txt:{
    flex:1,
  }
});
