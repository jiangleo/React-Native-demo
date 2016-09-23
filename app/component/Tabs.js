import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';


class Tabs extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      tabs: this.props.tabs
    };
  }

  componentWillUpdate(nextProps, nextState) {
      alert(2);  
  }

  render(){
    const {activeIndex=0} = this.props;
    return(
      <View style={styles.box}>
      {
        this.state.tabs.map((tabText,index)=>{
          const active = index == activeIndex;
          return(
            <View style={[styles.tab, active && styles.activeTab]}>
              <Text style={styles.text, active && styles.activeText}>{tabText}</Text>
            </View>
          )
        })
      }
      </View>
    )
  }
}



const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    height:43,
    backgroundColor:'#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    justifyContent: 'space-around',
  },
  tab: {
    flexDirection: 'row',
    height: 43,
    alignItems: 'center',
  },
  text: {
    alignSelf: 'center',
  },
  activeText: {
    color: '#ff552e',
  },
  activeTab: {
    borderBottomColor: '#ff552e',
    borderBottomWidth: 2,
  }
});

export default Tabs;
