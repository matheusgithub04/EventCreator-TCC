import React from 'react'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import {Router, Scene} from 'react-native-router-flux';

import LoadingScene from './scenes/LoadingScene';
import AuthScene from './scenes/AuthScene';
import main from './scenes/FormComponent'
import facebook from './scenes/facebook1'
import map from './scenes/map'
import menu from './scenes/menu'
import profile from './scenes/profile'
import AR from './scenes/AR'
import myEvent from './scenes/myEvent';
import event from './scenes/event'
import MyTeam from './scenes/myteam'

export default function App() {
  return (
      <Router >
        <Scene key="roots">
          <Scene key="loading" component={LoadingScene} hideNavBar={true}></Scene>
          <Scene key="voice" component={main} hideNavBar={true}></Scene>
          <Scene key="event" component={event} hideNavBar={true}></Scene>
          <Scene key="auth" component={AuthScene} hideNavBar={true}></Scene>
          <Scene key="map" component={map} hideNavBar={true}></Scene>
          <Scene key="myteam" component={MyTeam} hideNavBar={true}></Scene>
          <Scene key="AR" component={AR} hideNavBar={true}></Scene>
          <Scene key="profile" component={profile} hideNavBar={true}></Scene>
          <Scene key="menu" component={menu} hideNavBar={true}></Scene>
          <Scene key="myevent" component={myEvent} hideNavBar={true}></Scene>
        </Scene>
      </Router>
  );
}


