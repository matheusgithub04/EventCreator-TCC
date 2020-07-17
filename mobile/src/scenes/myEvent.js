import React, {useEffect, useState} from 'react'
import { AsyncStorage, Image, StyleSheet, View, TextInput, Text, ScrollView, TouchableOpacity, Keyboard, SafeAreaView, StatusBar, Platform} from 'react-native'
import { requestPermissionsAsync,  getCurrentPositionAsync} from 'expo-location'
import { MaterialIcons, SimpleLineIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import api from '../services/api';
import {TextInputMask} from 'react-native-masked-text';
import Lottie from 'lottie-react-native'
import socketio from 'socket.io-client'

function myEvent({navigation}) {
    const [eventos, setEventos] = useState([])
    const [ID, setID] = useState(0)
    const [socket, setSocket] = useState('')

    useEffect(() => {
        myEventsLoad()
    }, [])

    function myEventsLoad(){
        AsyncStorage.getItem('id', async (e, r) => {
            setID(r)
            var socketi = socketio(`http://${require('./ip').default}:3516`, {
                query: {user_id: r}
            })
            socketi.on('newEvent', data => {
                if(data.length != 0){
                    if(data[0].id_org){
                        setEventos(data)
                    }
                }
            })
            socketi.on('delEvent', data => {
                if(data.length != 0){
                    if(data[0].id_org){
                        alert('Evento deletado')
                        setEventos(data)
                    }
                }
            })
            setSocket(socketi)

            const {data} = await api.get(`/event/${r}`)
            if(data.length != 0){
                setID(data[0].id_org)
                setEventos(data)
            }
        })
        
    }

    // navigation.addListener('didFocus', () => {
    //     myEventsLoad()
    //   });
    return (    
        <>     
            <StatusBar backgroundColor="#ff1040"  barStyle="light-content"/>
            <SafeAreaView style={{backgroundColor: '#ff1040', height:'100%'}}>
                <ScrollView>
                    <View style={{flexDirection: 'row', alignItems: 'center', padding: 8}}>
                        <TouchableOpacity onPress={item => {socket.disconnect();navigation.goBack() }} style={{marginLeft: 5}}>
                            <Ionicons name="ios-arrow-back" size={30} color="#fff"  />
                        </TouchableOpacity>
                        
                        <Text style={{ color: '#fff', fontFamily: 'helvetica-bold', fontSize: 18, width: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                            Meus Eventos
                        </Text>
                    </View>
                    <View style={{
                        flexWrap: 'wrap',
                        flexDirection: 'row',
                        justifyContent: 'space-between', padding: 10}}>

                        {eventos.map(item => (
                            
                            <TouchableOpacity onPress={() => navigation.navigate('event', {id: item.id_event})} style={{width: '43%', height: 140, marginTop: 10}}>
                                {
                                    Platform.OS == 'ios' ?
                                        <Lottie autoPlay={item.state ? true : false} source={item.modalidade.toUpperCase() === 'LUTA' ? require('../../assets/FightLottie.json') : require('../../assets/SoccerLottie.json')} style={[{width: '100%', maxWidth: '100%', height: 100, backgroundColor: '#fff'}, Platform.OS == "ios" ? {borderRadius: 8} : '']}/>
                                    :
                                        <View style={[{width: '100%', maxWidth: '100%', height: 100, backgroundColor: '#fff'}, Platform.OS == "ios" ? {borderRadius: 8} : '']}/>
                                }
                                {/* <Text style={{color: '#0f0', justifyContent: 'center', textAlign: 'center', marginTop: 5, fontFamily: 'helvetica-light', fontSize: 17}}>
                                    {item.datainicio}
                                </Text> */
                                }
                                <TextInputMask
                                    type={'datetime'}
                                    options={{
                                        format: 'DD/MM/YYYY'
                                    }}
                                    editable={false}
                                    value={item.datainicio.split('-')[2] + item.datainicio.split('-')[1] + item.datainicio.split('-')[0]}
                                    style={{color: item.state ? '#0f0' : '#111', justifyContent: 'center', textAlign: 'center', marginTop: 5, fontFamily: 'helvetica-light', fontSize: 17}}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
})


export default myEvent