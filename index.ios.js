/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Demo from './app/container/Main.js';
// import Demo from './app/test/SectionHeader.js'
// import Demo from './app/test/Animated.js'
// import Demo from './app/test/LearnAnimated.js'



AppRegistry.registerComponent('Wuba', () => Demo);
