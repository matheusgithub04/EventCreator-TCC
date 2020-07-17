import React, {useState, useEffect} from 'react';
import {Alert, Text, AsyncStorage, ScrollView, Animated, Image, SafeAreaView, View, StyleSheet, PanResponder, TouchableOpacity, StatusBar, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { MaterialIcons, SimpleLineIcons, FontAwesome, Foundation } from '@expo/vector-icons';
import Lottie from 'lottie-react-native'

import surpriseAnimation from '../../assets/fogos.json'
import * as Font from 'expo-font';
import Logo from '../../assets/logo-amazing-white.png'
import Banner from '../../assets/banner.png'
import Luta from '../../assets/luta.jpg'
import Futebol from '../../assets/futebol.jpg'
import map from '../../assets/map.jpg'
import api from '../services/api';
import socketio from 'socket.io-client';
import {TextInputMask} from 'react-native-masked-text';


export default function Main({navigation}) {
  const [fontLoaded, setFontLoaded] = useState(false)
  const [scrolling, setScrolling] = useState(true)
  const [pan, setPan] = useState(new Animated.ValueXY())
  const [animation, setAnimation] = useState('flex')
  const [events, setEvents] = useState([])
  const [winners, setWinners] = useState([])
  const welcome = 'Bem Vinda, '+'nivia'
  const [alertas, setAlertas] = useState([])

  setTimeout(() => {
    setAnimation('none')
  }, 4500);

  // navigation.addListener('didFocus', () => {
  //   loadEvents()
  // });

  const panResponder = React.useMemo(() => PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderGrant: (e, gestureState) => {
          //setScrolling(false)
        },
        onPanResponderStart: (e, r)=> {
          //setScrolling(false)
        },
      onPanResponderMove: Animated.event([
        null,
        //{ dx: pan.x, dy: pan.y },
        //setScrolling(false)
        ]),
      onPanResponderRelease: (evt, gestureState) => {
        // Animated.spring(pan, { toValue: { x: 0, y: 0 } }).start();
        // setScrolling(true)
      },
    }), []);

    async function fontLoading(){
      await Font.loadAsync({
          'helvetica-bold': require('./Fonts/Helvetica/Helvetica-Bold.ttf'),
          'helvetica-light': require('./Fonts/Helvetica/Helvetica-Light.otf'),
          'helvetica-normal': require('./Fonts/Helvetica/Helvetica-Normal.ttf'),
          'magneto': require('./Fonts/Magneto/magneto-bold.ttf'),
      });
  
      setFontLoaded(true)
  }

    function handleLogout(){
      AsyncStorage.clear((e) => {
        navigation.navigate('auth')
      })
    }
    useEffect(() => {
      fontLoading()
      Speech.speak(welcome, {
        language: 'pt-BR'
      });

      loadEvents()
      AsyncStorage.getItem('id', async (e, r) => {
        const response = await api.post(`/event/${r}`)
        setAlertas(response.data)
        
        response.data.map(item => {
          Alert.alert(
            'Evento',
            `Pronto para um evento? Hoje as ${item.horaevento} está programado para acontecer um evento de ${item.modalidade.toLowerCase()}, deseja ir até ele?`,
            [
              {
                text: 'Cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              { text: 'OK', onPress: () =>  {navigation.navigate('event', {id: item.id_event});}}
            ],
            { cancelable: false }
          );
        })

        var socketi = socketio(`http://${require('./ip').default}:3516`)
        socketi.on('eventRecent', data => {
            if(data.length != 0){
                if(data[0].id_org){
                    setEvents(data)
                }
            }
        })
        socketi.on('winners', data => {
          if(data.length != 0) {
            setWinners(data)
          }
        })
      
        setAnimation('none')
      })
      
    }, [])
    
    async function loadEvents() {
      const {data} = await api.get('/listEvent')
      setEvents(data)

      const response = await api.get('/bestWinners')
      setWinners(response.data)
    }

    return (
      <>
        <StatusBar backgroundColor='#ff1040' barStyle='light-content'/>
        <SafeAreaView style={[styles.container, {backgroundColor: '#ff1040'}]}>
          
          <View style={{backgroundColor: '#ff1040', position: 'absolute', height: 20, width: '100%'}}></View>
          <ScrollView scrollEnabled={scrolling} showsVerticalScrollIndicator={false}>

            <View style={[styles.safeTop]}>
              <View style={[styles.safeHeader]}>

                <TouchableOpacity onPress={item => navigation.navigate('menu')} style={[styles.safeBack, Platform.OS == 'ios' ? {borderRadius: '50%'} : '']}>
                    <MaterialIcons name="menu" size={40} color="#fff"  />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleLogout}  style={[styles.safeBack, Platform.OS == 'ios' ? {borderRadius: '50%'} : '']}>
                    <SimpleLineIcons name="logout" size={28} color="#fff"  />
                </TouchableOpacity>

              </View>

              <Image style={styles.logo} source={Logo}/>
            </View>

            <View style={{minHeight: 1060, backgroundColor: '#fff'}}>
              <Animated.View
                {...panResponder.panHandlers}
                style={[styles.shadow, {
                  transform: [
                    { translateX: pan.x },
                    { translateY: pan.y }
                  ]
                }]}>
                <Image style={[styles.banner]} source={Banner} />
              </Animated.View>

              <View style={styles.events}>
                <Text style={[styles.eventsText, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}>Eventos Recentes</Text>
              </View>

              <View style={{marginTop: 20}}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

                  {events.map(item => (
                    <TouchableOpacity onPress={() => navigation.navigate('event', {id: item.id_event})} style={styles.card}>
                    <Image style={{width: '100%', height: '50%', borderTopLeftRadius: 20, borderTopRightRadius: 20}} source={item.modalidade.toUpperCase().includes('FUTEBOL') ? Futebol : Luta}/>
                    <View style={styles.cardView}>
                      <FontAwesome name="user" size={17} color="#fff"  />
                      <Text style={[styles.cardText, fontLoaded == true ? {fontFamily: 'helvetica-bold', marginLeft: 8} : '']}>{item.users.nome}</Text>
                    </View>
                    <View style={styles.cardView}>
                      <TextInputMask
                          type={'datetime'}
                          options={{
                              format: 'DD/MM/YYYY'
                          }}
                          editable={false}
                          value={item.datainicio.split('-')[2] + item.datainicio.split('-')[1] + item.datainicio.split('-')[0]}
                          style={[styles.cardText, fontLoaded == true ? {fontFamily: 'helvetica-light', fontSize: 16} : '']}
                      />
                    </View>
                    
                    <View style={styles.cardView}>
                      <FontAwesome name="phone" size={20} color="#fff"  />
                      {/* <Text style={[styles.cardText, fontLoaded == true ? {fontFamily: 'helvetica-light', fontSize: 16, marginLeft: 8} : '']}>{item.users.telefone}</Text> */}
                      
                      <TextInputMask
                                type={'cel-phone'}
                                placeholder="(xx) xxxxx-xxxx"
                                placeholderTextColor="#fff"
                                editable={false}
                                options={{
                                maskType: 'BRL',
                                withDDD: true,
                                dddMask: '(99) ',
                                }}
                                style={[styles.cardText, fontLoaded == true ? {fontFamily: 'helvetica-light', fontSize: 16, marginLeft: 8} : '']}
                                value={item.users.telefone}
                            />
                    </View>
                  </TouchableOpacity>
                  ))}
                  {
                    events.length == 0 ? 
                    <TouchableOpacity style={[styles.card, {backgroundColor: '#ddd', padding: 20, justifyContent: 'center', alignItems: 'center'}]}>
                      <Text style={fontLoaded == true ? {fontFamily: 'helvetica-normal', fontSize: 20, textAlign: 'center'} : {}}>Nenhum evento disponivel no momento.</Text>
                    </TouchableOpacity> 
                    : <View/>     
                  }
                </ScrollView>
              </View>
              
              <View style={styles.events}>
                <Text style={[styles.eventsText, fontLoaded == true ? {fontFamily: 'helvetica-bold', fontSize: 22, marginTop: 20} : '']}>Veja eventos perto de você</Text>
              </View>
              
              <TouchableOpacity onPress={item => navigation.navigate('map')} style={styles.viewMap}>
                <Image style={styles.map} source={map}/>
              </TouchableOpacity>

              <View style={[styles.events, {marginTop: 20}]}>
                <Text style={[styles.eventsText, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}>Top vencedores</Text>
              </View>

              <View style={{marginTop: 20}}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

                  {winners.map(item => (
                    item.id_users ? 
                    <View onPress={() => navigation.navigate('event', {id: item.id_event})} style={styles.card}>
                      <Image style={{width: '100%', height: '50%', borderTopLeftRadius: 20, borderTopRightRadius: 20}} source={{ uri: `http://${require('./ip').default}:3516/files/${item.uri}`}}/>
                      <View style={styles.cardView}>
                        <Text style={[styles.cardText, fontLoaded == true ? {fontFamily: 'helvetica-bold', marginLeft: 8} : '']}>{item.nome}</Text>
                      </View>
                      <View style={styles.cardView}>
                        <Text style={[styles.cardText, fontLoaded == true ? {fontFamily: 'helvetica-bold', marginLeft: 8} : '']}>{item.cidade}</Text>
                      </View><View style={styles.cardView}>
                        <Text style={[styles.cardText, fontLoaded == true ? {fontFamily: 'helvetica-bold', marginLeft: 8} : '']}>Vitórias: {item.wins}</Text>
                      </View>
                  </View>
                    :
                    <View onPress={() => navigation.navigate('event', {id: item.id_event})} style={styles.card}>
                      <Image style={{width: '100%', height: '50%', borderTopLeftRadius: 20, borderTopRightRadius: 20}} source={{ uri: `http://${require('./ip').default}:3516/files/${item.uri}`}}/>
                      <View style={styles.cardView}>
                        <Text style={[styles.cardText, fontLoaded == true ? {fontFamily: 'helvetica-bold', marginLeft: 8} : '']}>{item.nome_time}</Text>
                      </View>
                      <View style={styles.cardView}>
                        <Text style={[styles.cardText, fontLoaded == true ? {fontFamily: 'helvetica-bold', marginLeft: 8} : '']}>Time de {item.modalidade.toLowerCase()}</Text>
                      </View><View style={styles.cardView}>
                        <Text style={[styles.cardText, fontLoaded == true ? {fontFamily: 'helvetica-bold', marginLeft: 8} : '']}>Vitórias: {item.wins}</Text>
                      </View>
                  </View>
                  ))}
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>

        {animation == 'flex' ? <Lottie style={{display: animation}} source={surpriseAnimation} autoPlay /> : <View></View>}
        
      </>
    );
}
{/* <Lottie source={surpriseAnimation} autoPlay /> */}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  safeTop: {
    height: 200,
    backgroundColor: '#ff1040'
  },
  safeHeader: {
      marginTop: 5,
      marginLeft: '5%',
      width: '90%',
      flexDirection: 'row',
      justifyContent: 'space-between'
  },
  safeBack: {
      width: '10%',
      justifyContent: 'center',
      alignItems: 'center',
  },
  logo: {
    width: '100%', 
    marginTop: '5%', 
  },
  shadow: {
    shadowColor: "#111",
    shadowOffset: { width: 6, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  banner: {
    height: 200,
    width: '90%',
    marginLeft: '5%',
    borderRadius: 20,
    backgroundColor: '#fff',
    transform: [{translateY: -60}],
  },
  body: {
    backgroundColor: '#fff',
    height: 300, 
    width: '100%',
  },
  events: {
    width: '90%',
    marginLeft: '5%',
  },
  eventsText: {
    fontSize: 28
  },  
  card: {
    backgroundColor: '#ff1040', 
    marginLeft: 15, 
    height: 200, 
    width: 200, 
    borderRadius: 20
  },
  cardText: {
    textAlign: 'center',
    color: '#fff'
  },
  cardView: { 
    height: '10%',
    width: '100%', 
    marginTop: '5%',
    justifyContent: 'center',  
    flexDirection: 'row'
  },
  viewMap: {
    marginTop: 15,
    marginLeft: '5%'
  },
  map: {
    borderRadius: 20,
    width: '95%', 
    height: 200,
  }
});
