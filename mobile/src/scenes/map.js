import React, {useEffect, useState} from 'react'
import {Image, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, StatusBar} from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps'
import { requestPermissionsAsync,  getCurrentPositionAsync} from 'expo-location'
import { MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import api from '../services/api'
import { cos } from 'react-native-reanimated';
import socketio from 'socket.io-client'

function Map({navigation}) {
    const [currentRegion, setCurrentRegion] = useState(null)
    const [animation, setAnimation] = useState('none')
    const [eventos, setEventos] = useState([])
    const [bool, setBool] = useState(true)
    const [city, setCity] = useState('')
    const [icon, setIcon] = useState('menu')

    function handleMenu() {
        if(bool) {
            setAnimation('flex')
            setBool(false)
            setIcon('close')
        }else{
            setAnimation('none')
            setBool(true)
            setIcon('menu')
        }
    }

    async function handleSoccer() {
        let {data} = await api.get('/listarAll')

        var verification = new Array()

        data.map((event)=> {
            if(event.lat != null && event.lon != null){
                if(event.modalidade.toUpperCase().includes('FUTEBOL')){
                    verification.push(event)
                }
            }
        })
        setEventos(verification)
    }

    async function handleFight() {
        let {data} = await api.get('/listarAll')

        var verification = new Array()

        data.map((event)=> {
            if(event.lat != null && event.lon != null){
                if(event.modalidade.toUpperCase().includes('LUTA')){
                    verification.push(event)
                }
            }
        })
        setEventos(verification)
    }

    async function handleCity() {
        let {data} = await api.get('/listarAll')

        var verification = new Array()
        console.log(data)
        data.map((event)=> {
            if(event.lat != null && event.lon != null){
                if(event.localidade.toUpperCase().includes(city.toUpperCase())){
                    verification.push(event)
                }
            }
        })
        setEventos(verification)
        console.log(eventos)
        Keyboard.dismiss()
    }

    async function submitAll() {
        let {data} = await api.get('/listarAll')

        var verification = new Array()

        data.map((event)=> {
            if(event.lat != null && event.lon != null){
                verification.push(event)
            }
        })
        setEventos(verification)
    }

    useEffect(() => {
        async function loadInitialPosition(){
            const {granted} = await requestPermissionsAsync()
            if(granted) {
                const {coords} = await getCurrentPositionAsync({
                    enableHighAccuracy: true
                })

                const {latitude, longitude} = coords
                setCurrentRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                })

            }

        }

        submitAll()
        loadInitialPosition()

        var socketi = socketio(`http://${require('./ip').default}:3516`)
        socketi.on('eventRecent', data => {
            if(data.length != 0){
                if(data[0].id_org){ 
                    setEventos(data)
                }
            }
        })
    }, [])

    if(!currentRegion){
        return (
            <>
            <StatusBar barStyle='dark-content'/>
                <MapView  style={{flex: 1}}>
                    {eventos.map(item => (
                        
                        <Marker key={item.id_event} coordinate={{latitude: Number(item.lat), longitude: Number(item.lon)}}>
                            <Image style={{height: 50, width: 50, borderRadius: 10,borderWidth: 2, borderColor: '#ff1040'}} source={{uri: `http://${require('./ip').default}:3516/files/${item.users.uri}`}} />

                            <Callout onPress={data => {
                                navigation.navigate('event', {id: item.id_event})
                            }}>
                                <View style={styles.callout}>
                                    <Text style={styles.devName}>{item.users.nome}</Text>
                                    <Text style={styles.devBio}>{item.localidade}</Text>
                                    <Text style={styles.devTech}>{item.modalidade}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>
                
                <View style={[styles.searchForm, {justifyContent: 'center', bottom: 20}]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.ButtonMenu, {height: 50, width: 50, borderRadius: 25, backgroundColor: '#fff', display: 'flex'}]}>
                        <FontAwesome name="home" size={25} color="#ff1040" />
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    return (   
        <>     
            <StatusBar barStyle='dark-content'/>
            <MapView  initialRegion={currentRegion} style={{flex: 1}}>
                <Marker coordinate={currentRegion} />
                
                {eventos.map(item => (
                    
                    <Marker key={item.id_event} coordinate={{latitude: Number(item.lat), longitude: Number(item.lon)}}>
                        <Image style={{height: 50, width: 50, borderRadius: 10,borderWidth: 2, borderColor: '#ff1040'}} source={{uri: `http://${require('./ip').default}:3516/files/${item.users.uri}`}} />

                        <Callout onPress={data => {
                            navigation.navigate('event', {id: item.id_event})
                        }}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{item.users.nome}</Text>
                                <Text style={styles.devBio}>{item.localidade}</Text>
                                <Text style={styles.devTech}>{item.modalidade}</Text>
                            </View>
                        </Callout>
                    </Marker>
                    /*
                    <Marker
                        key={dev._id}
                        coordinate={{
                            longitude: dev.location.coordinates[0],
                            latitude: dev.location.coordinates[1]
                        }}>
                        <Image style={styles.avatar} source={{ uri: dev.avatar_url }}></Image>
                        <Callout onPress={() => {
                            // Navegação
                            navigation.navigate('Profile', { github: dev.github });
                        }}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text style={styles.devTechs}>{dev.techs.join(', ')}</Text>
                            </View>
                        </Callout>
                    </Marker>
                    */
                ))}

            </MapView>
            <View style={[styles.searchForm, styles.searchTop]}>
                <TextInput
                    value={city}
                    onChangeText={text => setCity(text)}
                    style={styles.searchInput}
                    placeholder='Cidade:'
                    placeholderTextColor='#999'
                    autoCapitalize='words'
                    autoCorrect={false}
                />

                <TouchableOpacity onPress={handleCity} style={styles.searchButton}>
                    <MaterialIcons name="my-location" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
            
            <View style={[styles.searchForm, styles.searchBottom, {justifyContent: 'center'}]}>

                <TouchableOpacity onPress={handleMenu}  style={styles.ButtonMenu}>
                    <MaterialIcons name={icon} size={30} color="#FFF" />
                </TouchableOpacity>
            </View>

            
            <View onTouchStart={() => {setAnimation('none'); setIcon('menu'); setBool(true)}} style={[styles.searchForm, styles.searchBottom, {justifyContent: 'center', bottom: 90}]}>

                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.ButtonMenu, {height: 45, width: 45, borderRadius: 20, backgroundColor: '#fff', display: animation}]}>
                    <FontAwesome name="home" size={25} color="#ff1040" />
                </TouchableOpacity>
            </View>

            <View onTouchStart={() => {setAnimation('none'); setIcon('menu'); setBool(true)}} style={[styles.searchForm, styles.searchBottom, {justifyContent: 'center', bottom: 150}]}>

                <TouchableOpacity onPress={handleFight} style={[styles.ButtonMenu, {height: 45, width: 45, borderRadius: 20, backgroundColor: '#fff', display: animation}]}>
                    <MaterialCommunityIcons name="sword-cross" p='karate'  size={25} color="#ff1040" />
                    
                </TouchableOpacity>
            </View>

            <View onTouchStart={() => {setAnimation('none'); setIcon('menu'); setBool(true)}} style={[styles.searchForm, styles.searchBottom, {justifyContent: 'center', bottom: 210}]}>

                <TouchableOpacity onPress={handleSoccer} style={[styles.ButtonMenu, {height: 45, width: 45, borderRadius: 20, backgroundColor: '#fff', display: animation}]}>
                    <FontAwesome name="soccer-ball-o" size={25} color="#ff1040" />
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    searchForm: {
        position: 'absolute',
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },
    searchTop: {
        top: 20
    },
    searchBottom: {
        bottom: 20
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: '#FFF',
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 4,
            height: 4,
        },
        elevation: 2
    },
    searchButton: {
        width: 50,
        height: 50,
        backgroundColor: '#ff1040',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15
    },
    ButtonMenu: {
        width: 60,
        height: 60,
        backgroundColor: '#ff1040',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        
        shadowColor: "#ff1040",
        shadowOffset: { width: 0, height: 5},
        shadowOpacity: 0.9,
        shadowRadius: 10,
    },
    callout: {
        width: 260,
        padding: 10
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16,
    }, 
    devBio: {
        color: '#666',
        marginTop: 5
    },
    devTech: {
        marginTop: 5
    }
});


export default Map