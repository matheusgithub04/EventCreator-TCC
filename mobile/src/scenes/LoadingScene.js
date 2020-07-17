import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  SafeAreaView,
  StatusBar
} from 'react-native';
console.disableYellowBox=true
import {Actions} from 'react-native-router-flux';
/* Logo */
import Logo from '../../assets/logo-amazing-white.png';

const switchToAuth = () => {
  Actions.replace('auth')
};

class LoadingScene extends Component {
  state = {
    LogoAnime: new Animated.Value(0),
    LogoText: new Animated.Value(0),
    loadingSpinner: false,
    load: false
  };

  async componentDidMount() {
    this.setState({
      loadingSpinner: false,
      load: true
    });
        
      const {LogoAnime, LogoText} = this.state;
      Animated.parallel([
        Animated.spring(LogoAnime, {
          toValue: 1,
          tension: 10,
          friction: 1,
          duration: 2000,
        }).start(),

        Animated.timing(LogoText, {
          toValue: 1,
          duration: 2200,
        }),
      ]).start(() => {

        setTimeout(switchToAuth, 2000);
      });
  }

  render() {
    
    //          <Image source={Logo}/>
    return (
      <>
        <StatusBar barStyle='light-content' backgroundColor='#16182F'/>
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            <Animated.View
              style={{
                opacity: this.state.LogoAnime,
                top: this.state.LogoAnime.interpolate({
                  inputRange: [0, 1],
                  outputRange: [80, 0],
                }),
              }}>
              <Image source={Logo}/>
              {this.state.loadingSpinner ? (
                <ActivityIndicator
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  size="large"
                  color="#ff1040"
                />
              ) : null}
            </Animated.View>
            <Animated.View style={{opacity: this.state.LogoText}}>
              <Text style={this.state.load == true ? [styles.logoText] : ''}>Aguarde um Momento</Text>
            </Animated.View>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default LoadingScene;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff1040',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoText: {
    color: '#fff',
    fontSize: 25,
    marginTop: 29.1,
    fontWeight: '500', 
    },
  logo: {
  }
});
