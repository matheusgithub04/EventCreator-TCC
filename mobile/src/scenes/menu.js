import React, {useEffect, useState} from 'react'
import { AsyncStorage, Image, StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, SafeAreaView, StatusBar, Modal, Platform} from 'react-native'
import { requestPermissionsAsync,  getCurrentPositionAsync} from 'expo-location'
import { MaterialCommunityIcons, AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons';
import api from '../services/api'
import * as Font from 'expo-font';
import {TextInputMask} from 'react-native-masked-text';
import socketio from 'socket.io-client'
import prompt from 'react-native-prompt-android';

function Menu({navigation}) {
    const [fontLoaded, setFontLoaded] = useState(false)
    const [nome, setNome] = useState('')
    const [Telefone, setTelefone] = useState('')
    const [uri, setUri] = useState('')
    const [wins, setWins] = useState(0)
    // const [modalPesquisa, setModalPesquisa] = useState(false)

    useEffect(() => {
        AsyncStorage.getItem('cpf', (e, cpf) => {
            AsyncStorage.getItem('senha', (e, senha) => {
                
                handleBio(cpf, senha)
            })
        })
        // setModalPesquisa(false)
        
        navigation.addListener('didFocus', (informacoes) => {
            AsyncStorage.getItem('uri', (e, uri) => {
                setUri({uri: `http://${require('./ip').default}:3516/files/`+uri})
            })
        });
    }, [])



    function handleBio(cpf, senha){
        api.post('/auth', {cpf, senha}).then((r) => {
            setNome(r.data.Users.nome)
            setTelefone(r.data.Users.telefone)
            setWins(r.data.Users.wins)
            AsyncStorage.setItem('uri', r.data.Users.uri)
            setUri({uri: `http://${require('./ip').default}:3516/files/`+r.data.Users.uri})
        })
    }

    async function fontLoading(){
        await Font.loadAsync({
            'helvetica-bold': require('./Fonts/Helvetica/Helvetica-Bold.ttf'),
            'helvetica-light': require('./Fonts/Helvetica/Helvetica-Light.otf'),
        });
    
        setFontLoaded(true)
    }
    function handleBack(){
        navigation.navigate('voice')
    }
    //<View style={{flex: 1, backgroundColor: '#fff'}}></View>

    fontLoading()

    async function handleSearch(){
        if(Platform.OS == "ios"){            
            Alert.prompt('Evento', 'Informe o ID do evento: ', [{
                text: 'Cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            },
            { text: 'OK', onPress: async (id) =>  {
                    id = Number(id)
                
                    if(String(id) == 'NaN'){
                        return alert('Digite um número válido.')
                    }
                    if(id == ''){
                        return console.log('retornou')
                    }
                    console.log(id)
                    const {data} = await api.post(`/event/matches/${id}`).catch((e)  =>{
                        alert(e)
                        console.log(e)
                    })
                    if(data.Events){
                        navigation.navigate('event', {id: data.Events.id_event})
                    }else if(data.erro){
                        alert(data.erro)
                    }
                    console.log(typeof id)
                }}
            ])
        }else{
            prompt(
            'Enter password',
            'Enter your password to claim your $1.5B in lottery winnings',
            [
             {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
             {text: 'OK', onPress: password => console.log('OK Pressed, password: ' + password)},
            ],
            {
                type: 'secure-text',
                cancelable: false,
                defaultValue: 'test',
                placeholder: 'placeholder'
            }
        );
        }
    }
    return (   
        <>     
            <StatusBar backgroundColor="#ff1040"  barStyle="light-content"/>
            
            <SafeAreaView style={[styles.safeContainer]}>
            
                <ScrollView indicatorStyle='white' style={styles.safeScroll} showsVerticalScrollIndicator={false}>
                    <View style={styles.safeHeader}>
                        <Text style={[{color: '#fff', fontSize: 30, width: '85%'}, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}>Menu</Text>
                        <TouchableOpacity onPress={handleBack} style={[styles.safeBack,  Platform.OS == 'ios' ? {borderRadius: '50%'} : '']}>
                            <Ionicons name="ios-arrow-forward" size={30} color="#fff"  />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.safeProfile}>
                        <Image style={styles.safeImage} source={uri} />
                        <View style={styles.safeInf}>
                            <Text style={[styles.safeNick, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}>{nome}</Text>
                            {/* <Text style={[styles.safeNick, fontLoaded == true ? {fontFamily: 'helvetica-light'} : '']}>{Telefone}</Text> */}
                            
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
                                style={[styles.safeNick, fontLoaded == true ? {fontFamily: 'helvetica-light'} : '']}
                                value={Telefone}
                                onChangeText={text => {
                                setTelefone(text);
                                }}
                            />
                        </View>
                    </View>
                    <View style={[styles.hr, Platform.OS == 'ios' ? { borderRadius: '50%' } : '']}></View>
                    <View style={styles.safeBody}>

                        <TouchableOpacity onPress={item => navigation.navigate('profile')} style={styles.safeBox}>
                            <AntDesign name='profile' size={40} style={{color: '#ff1040'}} />
                            <Text style={[styles.textGen, fontLoaded == true ? {fontFamily: 'helvetica-bold', paddingBottom: '8%'} : '']}>Perfil</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={item => navigation.navigate('myevent')} style={styles.safeBox}>
                            <Ionicons name='ios-trophy' size={40} style={{color: '#ff1040'}} />
                            <Text style={[styles.textGen, fontLoaded == true ? {fontFamily: 'helvetica-bold', paddingBottom: '8%'} : '']}>Meus Eventos</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={item => navigation.navigate('map')} style={styles.safeBox}>
                            <MaterialCommunityIcons name='map-marker-radius' size={40} style={{color: '#ff1040'}} />
                            <Text style={[styles.textGen, fontLoaded == true ? {fontFamily: 'helvetica-bold', paddingBottom: '8%'} : '']}>Mapa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={item => navigation.navigate('myteam')} style={styles.safeBox}>
                            <AntDesign name='team' size={40} style={{color: '#ff1040'}} />
                            <Text style={[styles.textGen, fontLoaded == true ? {fontFamily: 'helvetica-bold', paddingBottom: '8%'} : '']}>Meu Time</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSearch} style={[styles.safeBox]}>
                            <FontAwesome name="search" size={40} color="#ff1040" />
                            <Text style={[styles.textGen, fontLoaded == true ? {fontFamily: 'helvetica-bold', paddingBottom: '8%', marginTop: 10} : '']}>Procurar evento</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={test => alert(`Você venceu ${wins} ${wins != 1 ? 'eventos' : 'evento'} até o momento.`)} style={[styles.safeBox]}>
                            {/* <FontAwesome name="search" size={40} color="#ff1040" /> */}
                            <Text style={{fontFamily: 'magneto', fontSize: 35, color: '#ff1040'}}>{wins}</Text>
                            <Text style={[styles.textGen, fontLoaded == true ? {fontFamily: 'helvetica-bold', paddingBottom: '8%', marginTop: 3} : '']}>Vitórias</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
            
            {/* <Modal
                animationType="slide"
                transparent={true}
                visible={modalPesquisa}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={{width: '100%', height: '100%', backgroundColor: '#111', opacity: 0.5, position: 'absolute'}}>
                </View>
                <View
                    style={{width: '94%', height: '30%', backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'flex-end', left: '3%', top: '35%', borderRadius: 10, position: 'relative', borderWidth: 2, borderColor: '#fff'}}>
                </View>
            </Modal> */}
        </>
    );
}

const styles = StyleSheet.create({
    containerScroll: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: '5%',
        paddingTop: '70%'
    },
    safeScroll: {

    },
    safeContainer: {
        backgroundColor: '#ff1040',
        position: 'absolute', 
        zIndex: 5 , 
        height: '100%', 
        width: '100%', 
        elevation: 5,
        shadowRadius: 20
    },
    safeHeader: {
        marginTop: 5,
        marginLeft: '5%',
        width: '95%',
        flexDirection: 'row'
    },
    safeProfile: {
        marginTop: 15,
        marginLeft: '5%',
        width: '90%',
        flexDirection: 'row'
    },
    hr: {
        borderWidth: 2,
        borderColor: '#fff',
        opacity: 0.7,
        marginTop: 10,
        marginLeft: '5%',
        width: '90%',
    },
    safeBack: {
        width: '10%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeInf: {
        marginLeft: 10,
    },
    safeBody: {
        marginTop: 10,
        marginLeft: '5%',
        width: '90%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    safeImage: {
        height: 50, 
        width: 50,
        borderRadius: 25
    },
    safeNick: {
        color: '#fff',
        fontSize: 18
    },
    safeBox: {
        backgroundColor: '#fff',
        marginTop: 10,
        height: 100,
        borderRadius: 10,
        width: '49%', 
        justifyContent: 'flex-end',
        alignItems: 'center', 
    },
    textGen: {
        fontSize: 15
    }
})


export default Menu