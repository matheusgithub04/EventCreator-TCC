import React, {useEffect, useState} from 'react'
import { AsyncStorage, Image, StyleSheet, View, Alert, TextInput, Modal, Text, ScrollView, TouchableOpacity, Keyboard, SafeAreaView, StatusBar, TouchableOpacityBase, Platform} from 'react-native'
import { requestPermissionsAsync,  getCurrentPositionAsync} from 'expo-location'
import { FontAwesome5, FontAwesome, AntDesign, Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import api from '../services/api';
import { LinearGradient } from 'expo-linear-gradient';
import {TextInputMask} from 'react-native-masked-text';
import Lottie from 'lottie-react-native'
import socketio from 'socket.io-client'

function Event({navigation}) {
    const [dono, setDono] = useState(false)
    const [modalWinner, setModalWinner] = useState(false)
    const [modalInfo, setModalInfo] = useState(false)
    const [alerta, setAlerta] = useState({visible: 'none'})
    const [modalPartida, setModalPartida] = useState({visible: false, item: {partida: 1, pri_part: 2, seg_part: 6, primeiro:{nome_time: 'conexao'},segundo: {nome_time: 'conexao'}}})
    const [finalizado, setFinalizado] = useState(false)
    const [fechado, setFechado] = useState(false)
    const [socket, setSocket] = useState('')
    const [uri, setUri] = useState('')
    
    const [matches, setMatches] = useState([])
    const [teams, setTeams] = useState([])

    const [modalidade, setModalidade] = useState('')
    const [dataInicio, setDataInicio] = useState('')
    const [endereco, setEndereco] = useState('')
    const [horario, setHorario] = useState('')
    const [participantes, setParticipantes] = useState(0)
    
    const [ID, setID] = useState('')
    const [matche, setMatche] = useState(1)
    const [vencedor, setVencedor] = useState('')
    const [organizador, setOrganizador] = useState('')
    const [participando, setParticipando] = useState(true)
    const [controle, setControle] = useState({partida: 0, vencedor: 1})
    const [color, setColor] = useState(0)


    useEffect(() => {
        //setModalPartida({visible: true, item: {partida: 1, primeiro:{nome_time: 'conexao'},segundo: {nome_time: 'conexao'}}})
        AsyncStorage.getItem('  '+navigation.state.params.id, (e, r) => {
            if(r != null){
                setMatche(Number(r))
                // console.log(r, matche)
            }
        })
        
        async function handleEvent() {
            let ids = navigation.state.params.id
            // setID(2)
            // console.log(ID)
            console.log(ids)
            // AsyncStorage.setItem('  '+navigation.state.params.id, '1')
            // navigation.navigate('event', {id: navigation.state.params.id})
            var {data} = await api.post(`/event/matches/${ids}`).catch((e)  =>{
                alert(e)
                handleEvent()
            })
            setMatches(data.Matches)
            setUri(data.Events.users.uri)
            setModalidade(data.Events.modalidade)
            setDataInicio(data.Events.datainicio)
            setEndereco(data.Events.localidade)
            setHorario(data.Events.horaevento)
    
            setOrganizador(data.Events.users.nome)
            setDono(data.Events.id_org)
            setParticipantes(data.Events.qtdParticipantes)
    
            if( data.Vencedor !== null){
                setVencedor(data.Vencedor.nome_time)
                setFinalizado(true)
                setParticipando(true)
                AsyncStorage.removeItem('  '+navigation.state.params.id)
                return
            }else{
                setFinalizado(false)
            }
            
            if(data.Matches.length >= (data.Events.qtdParticipantes/2)){
                setFechado(true)
                setParticipando(true)
                return
            }else{
                setFechado(false)
                
            }
    
            
            var {data} = await api.get(`/team/${ids}`)
            setTeams(data)
            data.length == 0 ? setParticipando(false) : setParticipando(true)

            AsyncStorage.getItem('id', (e, r) => {
                const newArray = data.filter(item => item.id_part == r);
                console.log(ID, newArray)
    
                if(newArray.length != 0){
                    setParticipando(true)
                }else{
                    setParticipando(false)
                }
            })
        }
        
        AsyncStorage.getItem('id', (e, r) => {
            setID(r)
            var socketi = socketio(`http://${require('./ip').default}:3516`, {
                query: {
                    id_event: navigation.state.params.id,
                    user_id: r
                }
            })
            socketi.on('chaveamento', async data => {
                if(data.length != 0){
                    if(data.auth){
                        var ids = navigation.state.params.id
                        var {data} = await api.post(`/event/matches/${ids}`)
                        console.log(data,'          ', Platform.OS)
                        setParticipando(true)
                        setFechado(true)
                        setMatches(data.Matches)
                    }
                }
            })

            
            socketi.on(''+navigation.state.params.id, async data => {
                if(data.length != 0){
                    if(data.Matches){
                        setMatches(data.Matches)
                        if(data.Events.state == false){
                            setFechado(true)
                            setVencedor(data.Vencedor.nome_time)
                            setFinalizado(true)
                            AsyncStorage.removeItem('  '+navigation.state.params.id)
                        }
                    }
                }
            })

            setSocket(socketi)
        })

        handleEvent()
    }, [])


    navigation.addListener('didFocus', () => {

    });
    function handleWinner() {
        if(finalizado) {
            setModalWinner(true)
        }else{
            Alert.alert(
              'Em andamento...',
              `O evento não foi finalizado ainda.`,
              [
                { text: 'OK', onPress: () =>  {}}
              ],
              { cancelable: false }
            );
        }
    }

    async function handleDelete() {
        var ids = navigation.state.params.id
        
        if(ID == dono && participando == true && finalizado != true){
            Alert.alert(
                'Evento',
                ``,
                [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                { text: 'Sair do evento?', onPress: async () =>  {
                    if(modalidade == 'LUTA'){
                        const {data} = await api.post(`/team/delete/${ID}/${ids}`, {
                            modalidade: 'luta'
                        })
                        console.log(data)
                        if(data == 1){
                            setParticipando(false)
                        }
                    }else{
                        console.log('oi')
                        const {data} = await api.post(`/team/futebol/${ID}/${ids}`, {
                            modalidade: 'futebol'
                        })
                        if(data){
                            setParticipando(false)
                        }
                    }
                }},
                { text: 'Deletar evento?', onPress: async () =>  {
                    const {data} = await api.post(`event/delete/${ids}`, {
                        id_org: ID
                    })
                    console.log(data)
                    if(data === null) {
                        navigation.goBack()
                    }else{
                        alert('Não foi possivel deletar')
                    }
                }}
                ],
                { cancelable: false }
            );
        }else if(ID == dono) {
            Alert.alert(
                'Evento',
                `Tem certeza que quer deletar esse evento?`,
                [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                { text: 'OK', onPress: async () =>  {
                    const {data} = await api.post(`event/delete/${ids}`, {
                        id_org: ID
                    })
                    console.log(data)
                    if(data === null) {
                        navigation.goBack()
                    }else{
                        alert('Não foi possivel deletar')
                    }
                }}
                ],
                { cancelable: false }
            );
        }else{
            if(modalidade.toUpperCase() == 'LUTA'){
                if(fechado) {
                    alert('Desculpe voce nao pode sair desse evento mais.')
                }else{
                    if(participando) {
                        Alert.alert(
                            'Evento',
                            `Tem certeza que quer sair?`,
                            [
                            {
                                text: 'Cancelar',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel'
                            },
                            { text: 'OK', onPress: async () =>  {
                                const {data} = await api.post(`/team/delete/${ID}/${ids}`, {
                                    modalidade: 'luta'
                                })
                                console.log(data)
                                if(data == 1){
                                    setParticipando(false)
                                }
                            }}
                            ],
                            { cancelable: false }
                        );
                    }else{
                        alert('Voce nao está participando deste evento.')
                    }
                }
            }else{
                if(fechado) {
                    alert('Desculpe voce nao pode sair desse evento mais.')
                }else{
                    if(participando) {
                        Alert.alert(
                            'Evento',
                            `Tem certeza que quer sair?`,
                            [
                            {
                                text: 'Cancelar',
                                onPress: () => console.log('Cancel Pressed'),
                                style: 'cancel'
                            },
                            { text: 'OK', onPress: async () =>  {
                                const {data} = await api.post(`/team/futebol/${ID}/${ids}`, {
                                    modalidade: 'futebol'
                                })
                                if(data){
                                    setParticipando(false)
                                }
                            }}
                            ],
                            { cancelable: false }
                        );
                    }else{
                        alert('Voce nao está participando deste evento.')
                    }
                }
            }
        }
    }

    async function handleLogin() {
        var ids = navigation.state.params.id
        if(modalidade.toUpperCase() == 'LUTA'){
            const {data} = await api.post('cadTeam', {
                nome_time: "dddfff", 
                id_part: ID, 
                id_event: ids,
                modalidade: 'luta',
                ver: 1
            })
            if(data){
                teams.push(data)
                setParticipando(true)
            }
        }else{
            const {data} = await api.post('verification/team', {
                id: ID,
                id_event: ids,
                modalidade: 'Futebol'
            })

            if(data.erro) {
                return alert(data.erro)
            }

            if(data.error){
                return Alert.alert(
                    'Evento',
                    data.error,
                    [
                      {
                        text: 'Cancelar',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel'
                      },
                      { text: 'Sim', onPress: () =>  {navigation.navigate('event')}}
                    ],
                    { cancelable: false }
                  );
            }

            if(data) {
                setTeams(data)
                setParticipando(true)
            }
        }
    }
    
    async function handlePartida(item, vencedor, perdedor){
        if(participantes == 2){
            let {data} = await api.post('/updtMatches', {
                id: item.id_matches,
                perdedor: perdedor,
                resultado: vencedor,
                state: false
            })
            if(data){
                setMatche(data.partida+1)
                setModalPartida({visible: false, item})
                setAlerta({visible: 'none'})
                AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
            }
            let ids = navigation.state.params.id
            var response = await api.post(`/event/matches/${ids}`)
            
            setVencedor(response.data.Vencedor.nome_time)
            setFinalizado(true)
            AsyncStorage.removeItem('  '+navigation.state.params.id)
        }else if(participantes == 4) {
            if(matche == 1){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    setControle({partida: data.partida+2, vencedor: vencedor})
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 1')
                }
            }else if(matche == 2){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 2')
                }

                let response = await api.post('cadMatches', {
                    partida: controle.partida, 
                    pri_part: controle.vencedor, 
                    seg_part: vencedor, 
                    id_evento: navigation.state.params.id, 
                    state: true, 
                    resultado: null,
                    perdedor: null
                })
                if(response.data){
                    console.log('controle: cadastro outra partida')
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    var array = new Array()
                    matches.map(item => {
                        array.push(item)
                    })
                    array.push(response.data)
                    setMatches(array)
                }
            }else if(matche == 3){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: false
                })
                if(data){
                    setMatche(data.partida+1)
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    console.log('controle 3')
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                }
                let ids = navigation.state.params.id
                var response = await api.post(`/event/matches/${ids}`)
                setMatches(response.data.Matches)
                setVencedor(response.data.Vencedor.nome_time)
                setFinalizado(true)
                AsyncStorage.removeItem('  '+navigation.state.params.id)
            }
        }else if(participantes == 8) {
            console.log('8')
            if(matche == 1) {
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    setControle({partida: data.partida+4, vencedor: vencedor})
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 1')
                }
            }else if(matche == 2){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 2')
                }

                let response = await api.post('cadMatches', {
                    partida: controle.partida, 
                    pri_part: controle.vencedor, 
                    seg_part: vencedor, 
                    id_evento: navigation.state.params.id, 
                    state: true, 
                    resultado: null,
                    perdedor: null
                })
                if(response.data){
                    console.log('controle: cadastro outra partida 5')
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    console.log(response.data)
                    matches.push(response.data)
                }
            }else if(matche == 3){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    setControle({partida: data.partida+3, vencedor: vencedor})
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 3')
                }
            }else if(matche == 4){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 4')
                }

                let response = await api.post('cadMatches', {
                    partida: controle.partida, 
                    pri_part: controle.vencedor, 
                    seg_part: vencedor, 
                    id_evento: navigation.state.params.id, 
                    state: true, 
                    resultado: null,
                    perdedor: null
                })
                if(response.data){
                    console.log('controle: cadastro outra partida 6')
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    console.log(response.data)
                    matches.push(response.data)
                }
            }else if(matche == 5){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    setControle({partida: data.partida+2, vencedor: vencedor})
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 5')
                }
            }else if(matche == 6){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 4')
                }

                let response = await api.post('cadMatches', {
                    partida: controle.partida, 
                    pri_part: controle.vencedor, 
                    seg_part: vencedor, 
                    id_evento: navigation.state.params.id, 
                    state: true, 
                    resultado: null,
                    perdedor: null
                })
                if(response.data){
                    console.log('controle: cadastro outra partida 6')
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    console.log(response.data)
                    var array = new Array()
                    matches.map(item => {
                        array.push(item)
                    })
                    array.push(response.data)
                    setMatches(array)
                }
            }else if(matche == 7){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: false
                })
                if(data){
                    setMatche(data.partida+1)
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    console.log('controle 3')
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                }
                let ids = navigation.state.params.id
                var response = await api.post(`/event/matches/${ids}`)
                setMatches(response.data.Matches)
                setVencedor(response.data.Vencedor.nome_time)
                setFinalizado(true)
                AsyncStorage.removeItem('  '+navigation.state.params.id)
            }

        }else if(participantes == 16) {
            console.log('16')
            if(matche == 1){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    setControle({partida: data.partida+8, vencedor: vencedor})
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 1')
                }
            }else if(matche == 2){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 2')
                }

                let response = await api.post('cadMatches', {
                    partida: controle.partida, 
                    pri_part: controle.vencedor, 
                    seg_part: vencedor, 
                    id_evento: navigation.state.params.id, 
                    state: true, 
                    resultado: null,
                    perdedor: null
                })
                if(response.data){
                    console.log('controle: cadastro outra partida 9')
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    var array = new Array()
                    matches.map(item => {
                        array.push(item)
                    })
                    array.push(response.data)
                    setMatches(array)
                }
            }else if(matche == 3){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    setControle({partida: data.partida+7, vencedor: vencedor})
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 3')
                }
            }else if(matche == 4){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 4')
                }

                let response = await api.post('cadMatches', {
                    partida: controle.partida, 
                    pri_part: controle.vencedor, 
                    seg_part: vencedor, 
                    id_evento: navigation.state.params.id, 
                    state: true, 
                    resultado: null,
                    perdedor: null
                })
                if(response.data){
                    console.log('controle: cadastro outra partida 10')
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    var array = new Array()
                    matches.map(item => {
                        array.push(item)
                    })
                    array.push(response.data)
                    setMatches(array)
                }
            }else if(matche == 5){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    setControle({partida: data.partida+6, vencedor: vencedor})
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 5')
                }
            }else if(matche == 6){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 6')
                }

                let response = await api.post('cadMatches', {
                    partida: controle.partida, 
                    pri_part: controle.vencedor, 
                    seg_part: vencedor, 
                    id_evento: navigation.state.params.id, 
                    state: true, 
                    resultado: null,
                    perdedor: null
                })
                if(response.data){
                    console.log('controle: cadastro outra partida 11')
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    var array = new Array()
                    matches.map(item => {
                        array.push(item)
                    })
                    array.push(response.data)
                    setMatches(array)
                }
            }else if(matche == 7){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    setControle({partida: data.partida+5, vencedor: vencedor})
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+6).toString())
                    console.log('controle 7')
                }
            }else if(matche == 8){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 8')
                }

                let response = await api.post('cadMatches', {
                    partida: controle.partida, 
                    pri_part: controle.vencedor, 
                    seg_part: vencedor, 
                    id_evento: navigation.state.params.id, 
                    state: true, 
                    resultado: null,
                    perdedor: null
                })
                if(response.data){
                    console.log('controle: cadastro outra partida 12')
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    var array = new Array()
                    matches.map(item => {
                        array.push(item)
                    })
                    array.push(response.data)
                    setMatches(array)
                }
            }else if(matche == 9){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    setControle({partida: data.partida+4, vencedor: vencedor})
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+5).toString())
                    console.log('controle 9')
                }
            }else if(matche == 10){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 10')
                }

                let response = await api.post('cadMatches', {
                    partida: controle.partida, 
                    pri_part: controle.vencedor, 
                    seg_part: vencedor, 
                    id_evento: navigation.state.params.id, 
                    state: true, 
                    resultado: null,
                    perdedor: null
                })
                if(response.data){
                    console.log('controle: cadastro outra partida 13')
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    var array = new Array()
                    matches.map(item => {
                        array.push(item)
                    })
                    array.push(response.data)
                    setMatches(array)
                }
            }else if(matche == 11){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    setControle({partida: data.partida+3, vencedor: vencedor})
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 11')
                }
            }else if(matche == 12){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 12')
                }

                let response = await api.post('cadMatches', {
                    partida: controle.partida, 
                    pri_part: controle.vencedor, 
                    seg_part: vencedor, 
                    id_evento: navigation.state.params.id, 
                    state: true, 
                    resultado: null,
                    perdedor: null
                })
                if(response.data){
                    console.log('controle: cadastro outra partida 14')
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    var array = new Array()
                    matches.map(item => {
                        array.push(item)
                    })
                    array.push(response.data)
                    setMatches(array)
                }
            }else if(matche == 13){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    setControle({partida: data.partida+2, vencedor: vencedor})
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 13')
                }
            }else if(matche == 14){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: true
                })
                if(data){
                    setMatche(data.partida+1)
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                    console.log('controle 14')
                }

                let response = await api.post('cadMatches', {
                    partida: controle.partida, 
                    pri_part: controle.vencedor, 
                    seg_part: vencedor, 
                    id_evento: navigation.state.params.id, 
                    state: true, 
                    resultado: null,
                    perdedor: null
                })
                if(response.data){
                    console.log('controle: cadastro outra partida 15')
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    var array = new Array()
                    matches.map(item => {
                        array.push(item)
                    })
                    array.push(response.data)
                    setMatches(array)
                }
            }else if(matche == 15){
                let {data} = await api.post('/updtMatches', {
                    id: item.id_matches,
                    perdedor: perdedor,
                    resultado: vencedor,
                    state: false
                })
                if(data){
                    setMatche(data.partida+1)
                    setModalPartida({visible: false, item})
                    setAlerta({visible: 'none'})
                    console.log('controle 15')
                    AsyncStorage.setItem('  '+navigation.state.params.id, (data.partida+1).toString())
                }
                let ids = navigation.state.params.id
                var response = await api.post(`/event/matches/${ids}`)
                setMatches(response.data.Matches)
                setVencedor(response.data.Vencedor.nome_time)
                setFinalizado(true)
                AsyncStorage.removeItem('  '+navigation.state.params.id)
            }




        }
        // if(data){
        //     setMatche(data.partida+1)
        //     AsyncStorage.setItem('  '+navigation.state.params.id, matche.toString())
        // }
        // alert(vencedor+' '+ perdedor)
        // setModalPartida({visible: true, item})
        // alert(vencedor+' '+ perdedor)
        // setModalPartida({visible: false, item})
    }

    return (    
        <>     
            <StatusBar backgroundColor="#ff1040"  barStyle="light-content"/>
            <SafeAreaView style={{backgroundColor: '#ff1040', height:'100%'}}>
                <View style={{flexDirection: 'row', backgroundColor: '#ff1040' ,alignItems: 'center', padding: 8,
                    borderBottomWidth: 0.6,
                    borderBottomColor: '#999',
                    shadowOpacity: 0.8,
                    shadowRadius: 5,
                    shadowColor: '#111',
                    elevation: 2,
                    shadowOffset: { height: 4, width: 0 },
                }}>
                    <TouchableOpacity onPress={item => {
                        // AsyncStorage.setItem('  '+navigation.state.params.id, matche.toString())
                        socket.disconnect()
                        navigation.goBack()
                    }} style={{marginLeft: 5}}>
                        <Ionicons name="ios-arrow-back" size={30} color="#fff"  />
                    </TouchableOpacity>
                    
                    <Text style={{ color: '#fff', fontFamily: 'helvetica-bold', fontSize: 18, width: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                        Evento
                    </Text>
                </View>
                <ScrollView style={Platform.OS == 'android' ? {backgroundColor: '#eee'} : {backgroundColor: '#fff'}}>
                    {/* {
                    
                        condicoes == 'finalizado'  ? 
                        (
                            <View style={{height: 200, width: 200, backgroundColor: '#fff'}}/>
                        ) 
                        :
                        (
                            <LinearGradient
                              colors={['#4c669f', '#3b5998', '#192f6a']}
                              style={{ padding: 15, alignItems: 'center', borderRadius: 5 }}>
                              <Text
                                style={{
                                  backgroundColor: 'transparent',
                                  fontSize: 15,
                                  color: '#fff',
                                }}>
                                Sign in with Facebook
                              </Text>
                            </LinearGradient>
                        )
                    } */}

                    <View style={{alignItems: 'center'}}>
                        <Text style={{fontFamily: 'helvetica-normal', fontSize: 18, marginTop: 20,}}>ORGANIZADOR</Text>
                        <View style={{
                            shadowColor: '#ff1040',
                            shadowOpacity: 0.8,
                            borderWidth: 2,
                            borderColor: '#ff1040',
                            shadowRadius: 8,
                            elevation:2, 
                            borderRadius: 1000,
                            marginTop: 12,
                            shadowOffset: { height: 0, width: 0 }}}>
                            <Image style={{height: 100, width: 100, borderRadius: 1000
                            }} source={{uri: `http://${require('./ip').default}:3516/files/${uri}`}}/>
                        </View>
                        <Text style={{fontFamily: 'helvetica-normal', fontSize: 16, marginTop: 20}}>{organizador}</Text>
                        <View style={{borderWidth: 1, width: '85%', borderColor: '#808080', marginTop: 10, borderRadius: 500}}></View>
                        
                        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 20, width: '90%'}}>
                            
                            <TouchableOpacity onPress={handleLogin} disabled={(participando) ? true : false} style={{height: 50, width: 50, backgroundColor: '#f7eeee', paddingTop: 7, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 10}}>
                                {!participando ? 
                                <FontAwesome5 name="door-open" size={35} color="green" /> 
                                :
                                <FontAwesome5 name="door-closed" size={35} color="green" />}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleWinner} style={{height: 50, width: 50, backgroundColor: '#f7eeee', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 10}}>
                                <FontAwesome name="trophy" size={50} color="orange" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={item => setModalInfo(true)} style={{height: 50, width: 50, backgroundColor: '#f7eeee', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 10}}>
                                <Ionicons name="ios-information-circle-outline" size={50} color="blue" />
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={handleDelete} style={{height: 50, width: 50, backgroundColor: '#f7eeee', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 10}}>
                                <AntDesign name="close" size={50} color="red" />
                            </TouchableOpacity>
                        </View>

                        <Text style={{fontFamily: 'helvetica-bold', fontSize: 18, marginTop: 30}}>Partidas</Text>
                        <View style={{marginTop: 15}}/>
                        <View style={{width: '100%', position: 'relative'}}>
                            <View style={{width: '100%', opacity: finalizado ? 0.7 : 1}}>
                            
                        {
                            matches.map(item => 
                                {                                   
                                            
                            return(
                                
                            <>
                            <TouchableOpacity onPress={data => {
                                setColor(color+1);
                                setModalPartida({visible: true, item: item})
                                if(color+1 == 7){
                                    setColor(0)
                                }
                            }} 
                                disabled={finalizado || (item.partida != Number(matche) && dono == ID || (item.partida < matche) && dono == ID ) ? true : false}
                                >
                                <View style={[{
                                            width: '100%', 
                                            marginTop: 15,
                                            // borderWidth: 3,
                                            // borderColor: '#ff1040',
                                            shadowOpacity: 0.8,
                                            shadowRadius: 10,
                                            shadowColor: '#ff1040',
                                            elevation: 2,
                                            shadowOffset: { height: 4, width: 0 }, 
                                            },
                                            
                                            finalizado || dono != ID || (item.partida != Number(matche) || (item.partida < matche) ) ? {} : {borderWidth: 3, borderColor: '#fff'}
                                            ]}>
                                    <LinearGradient
                                            colors={['#111', '#ff1040', '#111']}
                                            start={[0, 0]}
                                            end={[1, 0]}                                 
                                            style={{ padding: 15, alignItems: 'center', width: '100%', height: 85,
                                                
                                            
                                            }}>

                                        <View style={{flexDirection: 'row', alignItems: 'center', width: '100%', height: '100%',}}>
                                            
                                            <Text style={{width: '10%', marginRight: -10, textAlign: 'center', alignItems: 'center', color: 'white', fontFamily: 'magneto', fontSize: 25}}>{item.partida}</Text>

                                            <Text style={{width: '8%'}}></Text>
                                            
                                            <Text 
                                                ajustaFontSizeToFit
                                                numberOfLines={1}
                                                style={[{ color: 'white', width: '30%', alignItems: 'center', fontFamily: 'helvetica-normal', fontSize: 17}, 
                                                item.pri_part == item.resultado || item.resultado == null ? {fontFamily: 'helvetica-bold'} : {opacity: 0.5}
                                                ]}>{item.primeiro.nome_time}</Text>

                                            <Text style={{ color: 'white', width: '16%', fontFamily: 'magneto', fontSize: 25}}>VS</Text>

                                            <Text 
                                                ajustaFontSizeToFit
                                                numberOfLines={1}
                                                style={[{textAlign: 'right', color: 'white', width: '30%', fontFamily: 'helvetica-normal', fontSize: 17}, 
                                                item.seg_part == item.resultado || item.resultado == null ? {fontFamily: 'helvetica-bold'} : {opacity: 0.5}
                                                ]}>{item.segundo.nome_time}</Text>

                                            <Text style={{width: '8%'}}></Text>
                                        
                                        </View>
                                    </LinearGradient>
                                </View>   
                            </TouchableOpacity>
                            </>
                            )})
                        }
                            { 
                                matches.length == 0 ? 
                                    <View style={{padding: 10}}>
                                        <Text style={{fontFamily: 'helvetica-light', textAlign: 'center'}}>Esperando participantes para o inicio do evento.</Text>
                                    </View>
                                
                                : <View/>
                            }
                                        
                            </View>
                            {
                                finalizado ?
                                    <Text style={{position: 'absolute', alignSelf: 'center', top: '45%', fontFamily: 'magneto', fontSize: 45}}>Finalizado</Text> 
                                : 
                                    <View/>
                            }
                            
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalWinner}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={{width: '100%', height: '100%', backgroundColor: '#111', opacity: 0.5, position: 'absolute'}}>
                </View>
                <View style={{width: '90%', height: '90%', backgroundColor: '#fff', left: '5%', top: '5%', borderRadius: 15, position: 'relative'}}>
                    
                    <Image style={{height: '35%', width: '100%', borderRadius: 15}} source={require('../../assets/win_end.png')}/>
                    <Text style={{height: '20%', fontFamily: 'helvetica-light', fontSize: 20, textAlign: 'center'}}>Parabens para o {modalidade.toUpperCase() == 'LUTA' ? 'jogador':'time'} <Text style={{borderWidth: 1, height: '20%', fontFamily: 'helvetica-bold', fontSize: 20, textAlign: 'center'}}>{vencedor}</Text> por vencer este evento.</Text>
                    <View style={{height: '28%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                        <Lottie  style={{ height: '100%', width: '100%'}} autoPlay source={require('../../assets/winLottie.json')} />
                    </View>
                    <Text style={{height: '17%', fontFamily: 'helvetica-light', fontSize: 18, textAlign: 'center'}}>Nós da EventCreator procuramos oferecer a melhor experiencia para nossos usuarios.</Text>
                    
                    <TouchableOpacity onPress={item => setModalWinner(false)} style={{position: 'absolute', height: 50, width: 50, justifyContent: 'center', alignItems: 'center', marginTop: 5, marginLeft: 5}}>
                        <Ionicons name="ios-arrow-back" size={40} color="#ff1040"  />
                    </TouchableOpacity>
                </View>
            </Modal>
            
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalInfo}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={{width: '100%', height: '100%', backgroundColor: '#111', opacity: 0.5, position: 'absolute'}}>
                </View>
                <View style={{width: '90%', height: '90%', backgroundColor: '#fff', justifyContent: 'space-evenly', left: '5%', top: '5%', borderRadius: 15, position: 'relative'}}>
                    
                    <Image style={{height: '45%', width: '100%', borderRadius: 15}} source={require('../../assets/content.png')}/>

                    <View style={{ flexDirection: 'row', width: '100%', height: 50, alignItems: 'center', justifyContent: 'space-around'}}>
                        
                        <TextInput value={modalidade} editable={false}
                            style={{ width: '30%', height: '100%', justifyContent: 'center', borderWidth: 1, borderRadius: 10, textAlign: 'center', fontFamily: 'helvetica-light', fontSize: 17}}
                        />

                        <TextInputMask
                            type={'datetime'}
                            options={{
                                format: 'DD/MM/YYYY'
                            }}
                            editable={false}
                            value={dataInicio.split('-')[2] + dataInicio.split('-')[1] + dataInicio.split('-')[0]}
                            style={{color: '#000', height: '100%', width: '60%', justifyContent: 'center', borderWidth: 1, borderRadius: 10, textAlign: 'center', fontFamily: 'helvetica-light', fontSize: 17}}
                        />

                    </View>

                    <View style={{flexDirection: 'row', width: '100%', height: 50,  justifyContent:'space-around', alignItems: 'center'}}>
                        

                        <TextInput value={
                            'Evento '+participantes/2+'x'+participantes/2
                                } 
                        editable={false}
                            ajustaFontSizeToFit
                            numberOfLines={2}
                            style={{ width: '60%', height: '100%', justifyContent: 'center', borderWidth: 1, borderRadius: 10, textAlign: 'center', fontFamily: 'helvetica-light', fontSize: 17}}
                        />
                        <TextInputMask
                            type={'custom'}
                            options={{
                                mask: '99:99'
                            }}
                            editable={false}
                            value={horario}
                            
                            style={{color: '#000', height: '100%', width: '30%', justifyContent: 'center', borderWidth: 1, borderRadius: 10, textAlign: 'center', fontFamily: 'helvetica-light', fontSize: 15}}
                        />

                    </View>
                    <View style={{flexDirection: 'row', width: '100%', height: 50, justifyContent:'space-around', alignItems: 'center'}}>
                        

                        <TextInput value={endereco} editable={false}
                            ajustaFontSizeToFit
                            numberOfLines={2}
                            style={{ width: '95%', height: '100%', justifyContent: 'center', borderWidth: 1, borderRadius: 10, textAlign: 'center', fontFamily: 'helvetica-light', fontSize: 14}}
                        />

                    </View>

                    <TouchableOpacity onPress={item => setModalInfo(false)} style={{height: 50, width: '90%', left: '5%', backgroundColor: '#ff1040', borderRadius: 15, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontFamily: 'helvetica-bold', color: 'white', fontSize: 18}}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalPartida.visible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={{width: '100%', height: '100%', backgroundColor: '#111', opacity: 0.5, position: 'absolute'}}>
                </View>
                <LinearGradient
                    colors={
                        // (color != 5) ? (color != 4) ? (color != 3) ? (color != 2) ? (color != 1) ? (color != 6) ? ['#111', 'purple', '#111'] : ['#111', 'pink', '#111'] : ['#111', '#ff1040', '#111']  : ['#111', 'orange', '#111'] : ['#111', 'green', '#111'] : ['#111', 'yellow', '#111'] :  ['#111', 'blue', '#111']
                        
                        ['#111', '#ff1040', '#111']
                    }
                    start={[1, 0]}
                    end={[0, 1]}      
                    style={{width: '94%', height: '90%', backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'flex-end', left: '3%', top: '5%', borderRadius: 10, position: 'relative', borderWidth: 2, borderColor: '#fff'}}>
                    
                    <View style={{height: '10%',right: '-40%', width: '100%', position: 'absolute', top: '45%'}}>
                        <Text style={{ color: 'white', width: '100%', textAlign: 'center', fontFamily: 'magneto', fontSize: 40, transform: [{ rotate: '90deg'}]}}>Partida {modalPartida.item.partida}</Text>
                    </View>

                    <View style={{height: '10%', justifyContent: 'center', alignItems: 'center', width: '100%', position: 'absolute', top: '45%'}}>
                        <Text style={{ color: 'white', width: '100%', textAlign: 'center', fontFamily: 'magneto', fontSize: 50, transform: [{ rotate: '90deg'}]}}>VS</Text>
                    </View>

                    <TouchableOpacity disabled={alerta.visible == 'flex' ||  dono != ID ? true : false} onPress={data => setAlerta({visible: 'flex', item: modalPartida.item, vencedor: modalPartida.item.pri_part, perdedor:modalPartida.item.seg_part})} style={{width: '100%', height: '50%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row-reverse'}}>
                       <Image style={{height: 100, width: 100, transform: [{ rotate: '90deg'}], borderRadius:600}} source={{uri: `http://${require('./ip').default}:3516/files/${modalPartida.item.primeiro.uri}`}}/>
                        <Text style={{transform: [{ rotate: '90deg'}], position: 'absolute', fontFamily: 'helvetica-bold', color: '#fff', fontSize: 17, right: '-15%', width: '70%', textAlign: 'center'}}>{modalPartida.item.primeiro.nome_time}</Text>
                    </TouchableOpacity>


                   <TouchableOpacity disabled={alerta.visible == 'flex' ||  dono != ID ? true : false} onPress={data => setAlerta({visible: 'flex', item: modalPartida.item, vencedor: modalPartida.item.seg_part, perdedor:modalPartida.item.pri_part})} style={{width: '100%', height: '50%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row-reverse'}}>
                       <Image style={{height: 100, width: 100, transform: [{ rotate: '90deg'}], borderRadius:600}} source={{uri: `http://${require('./ip').default}:3516/files/${modalPartida.item.segundo.uri}`}}/>
                       <Text style={{transform: [{ rotate: '90deg'}], position: 'absolute', fontFamily: 'helvetica-bold', color: '#fff', fontSize: 17, right: '-15%', width: '70%', textAlign: 'center'}}>{modalPartida.item.segundo.nome_time}</Text>
                    </TouchableOpacity>
                        
                    <TouchableOpacity onPress={item => {setAlerta({visible: 'none'}); setModalPartida({visible: false, item: {partida: 1, pri_part: 2, seg_part: 6, primeiro:{nome_time: 'conexao'},segundo: {nome_time: 'conexao'}}})}} style={{position: 'absolute', transform: [{ rotate: '90deg'}], width: 60, justifyContent: 'center', alignItems: 'center'}}>
                        <Ionicons name="ios-arrow-back" size={50} color="#fff"  />
                    </TouchableOpacity>
                    
                    <View style={{position: 'absolute', height: '50%', width: '40%', backgroundColor: '#fff', right: '25%', top: '25%', borderRadius: 10, opacity: 0.9, display: alerta.visible }}>

                    </View>
                    <View style={{position: 'absolute', height: '50%', width: '40%', right: '25%', top: '25%', borderRadius: 10, flexDirection: 'row-reverse', display: alerta.visible}}>
                        
                        <View style={{width: '70%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row-reverse'}}>
                            <Text style={{ width: 300, right: '-50%', transform: [{ rotate: '90deg'}],fontWeight: 'bold', fontFamily: 'helvetica-bold', fontSize: 20, textAlign: 'center'}}>Confirmação!</Text>
                            <Text style={{ width: 300, right: '55%', transform: [{ rotate: '90deg'}],fontWeight: 'bold', fontFamily: 'helvetica-normal', fontSize: 15, textAlign: 'center'}}>Deseja definir vencedor?</Text>
                        </View>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '100%', width: '30%'}}>
                            <TouchableOpacity onPress={data => setAlerta({visible: 'none'})} style={{borderWidth: 0.5, borderTopStartRadius: 10, width: '100%', height: '50%', justifyContent: 'center'}}>
                                <Text style={{transform: [{ rotate: '90deg'}],textAlign: "center", fontFamily: 'helvetica-normal', fontSize: 16, color: 'blue'}}>Não</Text>
                                {/* transform: [{ rotate: '90deg'}], */}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={data => {handlePartida(alerta.item, alerta.vencedor, alerta.perdedor)}} style={{borderWidth: 0.5, borderBottomStartRadius: 10, width: '100%', height: '50%', justifyContent: 'center'}}>
                                <Text style={{transform: [{ rotate: '90deg'}],textAlign: "center", fontFamily: 'helvetica-normal', fontSize: 16, color: 'blue'}}>Sim</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </Modal>

        </>
    );
}

const styles = StyleSheet.create({
    
  });


export default Event