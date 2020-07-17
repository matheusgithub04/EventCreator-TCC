import React, {useEffect, useState} from 'react'
import { AsyncStorage, Image, StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity, Alert, SafeAreaView, StatusBar, Modal} from 'react-native'
import { MaterialCommunityIcons, AntDesign, Ionicons, FontAwesome } from '@expo/vector-icons';
import api from '../services/api'
import {TextInputMask} from 'react-native-masked-text';
import { TextInput } from 'react-native-gesture-handler';
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import socketio from 'socket.io-client'

function MyTeam({navigation}) {
    const [modalUser, setModalUser] = useState({})
    const [modalSearch, setModalSearch] = useState(false)
    const [timeouts, setTimeouts] = useState(null)

    const [newParticipants, setNewParticipants] = useState([])
    const [addParticipant, setAddParticipant] = useState(new Array())

    const [participantes, setParticipantes] = useState([])
    const [info, setInfo] = useState({id_part: null, id_team: null, user: {}})  

    const [valueOfRequest, setValueOfRequest] = useState('')
    const [ID, setID] = useState(1)    
    const [organizador, setOrganizador] = useState('')   
    const [uriTeam, setUriTeam] = useState('')    
    const [nomeTime, setNomeTime] = useState('')  
    const [IdEvento, setIdEvento] = useState(1)  
    const [wins, setWins] = useState(0)  
    const [socket, setSocket] = useState(1)  

    const [dono, setDono] = useState(false)  

    useEffect(() => {
        // setModalSearch(false)
        // setModalUser(false)
        
        AsyncStorage.getItem('id', async (e, id) => {
            setID(id)
            const {data} = await api.get(`/searchTeam/${id}`)
            if(data.erro) {
                alert(data.erro)
                return navigation.goBack()
            }
            var socketi = socketio(`http://${require('./ip').default}:3516`)
            
            socketi.on(data.Teams.id_time, async socketData => {
                if(socketData.length != 0){
                    if(socketData.type == 'destroy'){
                        let org = data.Participants.filter(item => item.id_part == ID);
                        if(!org) {
                            return navigation.goBack()
                        }
                        setParticipantes(socketData.Participants)
                    }else if(socketData.type == 'store'){
                        setParticipantes(socketData.Participants)
                    }else if(socketData.type == 'passLeader'){
                        setParticipantes(socketData.Participants)
                        setNomeTime(socketData.Teams.nome_time)
                        setUriTeam(socketData.Teams.uri)
                        if(socketData.Teams.id_part != id){
                            setDono(true)
                        }else{
                            setDono(false)
                        }
                        const org = socketData.Participants.filter(item => item.id_part == socketData.Teams.id_part);
                        setOrganizador(org[0].user)
                        setWins(socketData.Teams.wins)
                    }
                }
            })
            setWins(data.Teams.wins)
            setSocket(socketi)

            setIdEvento(data.Teams.id_time)
            setParticipantes(data.Participants)
            setNomeTime(data.Teams.nome_time)
            setUriTeam(data.Teams.uri)
            if(data.Teams.id_part != id){
                setDono(true)
            }else{
                setDono(false)
            }
            const org = data.Participants.filter(item => item.id_part == data.Teams.id_part);
            setOrganizador(org[0].user)
        })
        // setModalPesquisa(false)
    }, [])
    
    async function imagePickerCall() {
        if (Constants.platform.ios) {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    
          if (status !== "granted") {
            alert("Nós precisamos dessa permissão.");
            return;
          }
        }
    
        const data = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images
        });
    
        if (data.cancelled) {
          return;
        }
    
        if (!data.uri) {
          return;
        }
        const json = Object.assign(data, {test: true})
        uploadImage(json)
    }

    async function uploadImage(json) {
        const dataa = new FormData();
        
        dataa.append('file', {
            uri : json.uri,
            type: json.type,
            name: 'perfil',

        });
        // AsyncStorage.getItem('cpf', (e,r) => {
        //     dataa.append('cpf', r)
        // })
        dataa.append('id_time', IdEvento)

        const {data} = await api.post('/images/time', dataa).catch((e)=>{
            alert(e)
        })

        if(data.uri){
            setUriTeam(data.uri)
        }
    }

    function handleAddParticipant(item){
        if(!addParticipant.includes(item.id_users)){
            var newArray = new Array()
            if(addParticipant.length != 0){
                addParticipant.map(data => {
                    newArray.push(data)
                })
                newArray.push(item.id_users)
    
                setAddParticipant(newArray)
            }else if(addParticipant.length == 0){
                setAddParticipant([item.id_users])
            }

        }else if(addParticipant.includes(item.id_users)){
            var newArray = new Array()

            addParticipant.map(data => {
                if(data != item.id_users){
                    newArray.push(data)
                }
            })
            setAddParticipant(newArray)
        }
    }


    async function handleSearchUsers(){
        if(String(Number(valueOfRequest[0])) === 'NaN') {
            const {data} = await api.post('/listParticipants', {
                type: 'name',
                query: valueOfRequest
            })
            if(data.length != 0){
                setNewParticipants(data)
            }else if(data.length == 0){
                setNewParticipants([])
            }
        }else{
            const {data} = await api.post('/listParticipants', {
                type: 'CPF',
                query: valueOfRequest
            })
            if(data.length != 0){
                setNewParticipants(data)
            }else if(data.length == 0){
                setNewParticipants([])
            }
        }
    }


    async function handleSubmitParticipant(){
        if(addParticipant.length == 0){
            return alert('Selecione algum usuario.')
        }
        const {data} = await api.post('/cadParticipant', {
            participantes: addParticipant,
            id_team: IdEvento //MUDAR
        })
        
        if(data.length != 0){
            setAddParticipant(new Array())
            handleSearchUsers()
            setValueOfRequest('')
            if(data.erro){
                return alert(data.erro)
            }
            setModalSearch(false)
            setParticipantes(data)
        }
    }


    async function handlePassLeader(){
        const {data} = await api.post('/pass/leader', {
        id_part: info.id_part,
        id_team: info.id_team,
        })

        if(data.length != 0) {
            setModalUser(false)
            setIdEvento(data.Teams.id_time)
            setParticipantes(data.Participants)
            setNomeTime(data.Teams.nome_time)
            setUriTeam(data.Teams.uri)
            if(data.Teams.id_part != ID){
                setDono(true)
            }else{
                setDono(false)
            }
            const org = data.Participants.filter(item => item.id_part == data.Teams.id_part);
            setOrganizador(org[0].user)
        }
    }

    async function handleDelete(){
        const {data} = await api.post('/delete/participante', {
            id_part: info.id_part,
            id_team: info.id_team,
        })
        if(data.length != 0) {
            console.log(data)
            setInfo({id_part: '', id_team: '', user: {
                id_users: 3,
                cpf: "80908578091",
                nome: "Fabricio",
                telefone: "19981413209",
                logradouro: "sei la ",
                numero: "54",
                bairro: "teste",
                complemento: null,
                cidade: "jaguariuna",
                estado: "SP",
                uri: "PeixeOTP.png"
            }}) 
            setModalUser(false)
            setParticipantes(data)
        }
    }

    function handleAlert(type){
        if(type == 1) {
            Alert.alert(
              'Time',
              `Deseja passar líder para ${info.user.nome}?`,
              [
                {
                  text: 'Cancelar',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel'
                },
                { text: 'OK', onPress: () =>  {handlePassLeader()}}
              ],
              { cancelable: false }
            );
  
        }else{
            Alert.alert(
              'Time',
              `Deseja remover ${info.user.nome} do time?`,
              [
                {
                  text: 'Cancelar',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel'
                },
                { text: 'Sim', onPress: () =>  {handleDelete()}}
              ],
              { cancelable: false }
            );
            
        }
    }

    return (   
        <>     
            <StatusBar backgroundColor="#ff1040"  barStyle="light-content"/>
            <SafeAreaView style={{backgroundColor: '#ff1040', height:'100%'}}>
                <View style={{flexDirection: 'row', backgroundColor: '#ff1040' ,alignItems: 'center', padding: 8,
                    borderBottomWidth: 0.6,
                    borderBottomColor: '#999',
                    shadowOpacity: 0.8,
                    shadowRadius: 3,
                    shadowColor: '#111',
                    elevation: 1,
                    shadowOffset: { height: 3, width: 0 },
                }}>
                    <TouchableOpacity onPress={item => {
                        // AsyncStorage.setItem('  '+navigation.state.params.id, matche.toString())
                        socket.disconnect()
                        navigation.goBack()
                    }} style={{marginLeft: 5}}>
                        <Ionicons name="ios-arrow-back" size={30} color="#fff"  />
                    </TouchableOpacity>
                    
                    <Text style={{ color: '#fff', fontFamily: 'helvetica-bold', fontSize: 18, width: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                        Time
                    </Text>
                </View>
                <View style={{alignItems: 'center'}}>
                    <Text style={{fontFamily: 'helvetica-normal', fontSize: 18, marginTop: 20, color: 'white'}}>{nomeTime}</Text>
                    <View style={{flexDirection: 'row', justifyContent: 'space-evenly', width: '100%'}}>
                        <TouchableOpacity disabled={dono} onPress={imagePickerCall}>
                            <View style={{
                                shadowColor: '#fff',
                                shadowOpacity: 0.8,
                                borderWidth: 2,
                                borderColor: '#fff',
                                shadowRadius: 8,
                                elevation:2, 
                                borderRadius: 1000,
                                marginTop: 12,
                                shadowOffset: { height: 0, width: 0 }}}>
                                <Image style={{height: 100, width: 100, borderRadius: 1000
                                }} source={{uri: `http://${require('./ip').default}:3516/files/${uriTeam}`}}/>
                            </View>
                        </TouchableOpacity>
                        <View>
                            <View style={{
                                shadowColor: '#fff',
                                shadowOpacity: 0.8,
                                borderWidth: 2,
                                borderColor: '#fff',
                                shadowRadius: 8,
                                elevation:2, 
                                borderRadius: 1000,
                                marginTop: 12,
                                shadowOffset: { height: 0, width: 0 }}}>
                                <View style={{height: 100, width: 100, borderRadius: 1000, backgroundColor: '#ff1040', justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={{color: '#fff', fontFamily: 'magneto', fontSize: 26}}>{wins}</Text>
                                    <Text style={{color: '#fff', fontFamily: 'helvetica-normal', fontSize: 18}}>{'Vitórias'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <Text style={{fontFamily: 'helvetica-normal', fontSize: 16, marginTop: 20,  color: 'white'}}>{organizador.nome}</Text>
                    <View style={{borderWidth: 1, width: '90%', borderColor: '#fff', marginTop: 10, borderRadius: 500}}></View>
                </View>
                <ScrollView >
                    <View style={{width: '100%', flexWrap: 'wrap-reverse', flexDirection: 'row-reverse', justifyContent: 'space-around', padding: 10}}>
                        {participantes.map(data => (
                            
                            <TouchableOpacity onPress={item => {setInfo(data); setModalUser(true)}} style={[{height: 90, width: 90, borderWidth: 1, marginTop: 15, borderRadius: 15, borderColor: 'white'}, organizador.id_users == data.id_part ? {borderColor: '#800', borderWidth: 3}:'']}>
                                <Image source={{uri: `http://${require('./ip').default}:3516/files/${data.user.uri}`}} style={{height: '100%', width: '100%', borderRadius: 15}}/>
                            </TouchableOpacity>
                        ))}
                        
                        <TouchableOpacity disabled={dono} onPress={item => setModalSearch(true)} style={{height: 90, width: 90, borderWidth: 1, marginTop: 15, borderRadius: 15, justifyContent: 'center', alignItems: 'center', borderColor: 'white'}} >
                            <AntDesign name="pluscircleo" size={'50%'} color="white" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalUser}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={{width: '100%', height: '100%', backgroundColor: '#111', opacity: 0.5, position: 'absolute'}}>
                </View>
                <View style={{width: '94%', position: 'relative', height: '75%', backgroundColor: '#fff', justifyContent: 'flex-start', alignItems: 'center', left: '3%', top: '15%', borderRadius: 10, borderWidth: 2, borderColor: '#fff'}}>
                    
                    <View style={{
                        shadowColor: '#FF1040',
                        shadowOpacity: 0.8,
                        borderWidth: 2,
                        borderColor: '#FF1040',
                        shadowRadius: 8,
                        elevation:2, 
                        borderRadius: 1000,
                        marginTop: 12,
                        shadowOffset: { height: 0, width: 0 }}}>
                        <Image style={{height: 100, width: 100, borderRadius: 1000
                        }} source={{uri: `http://${require('./ip').default}:3516/files/${info.user.uri}`}}/>
                    </View>
                    <Text style={{fontFamily: 'helvetica-normal', fontSize: 18, marginTop: 16,  color: 'black', marginRight: 20}}>{info.user.nome}</Text>
                    <View style={{borderWidth: 1, width: '90%', borderColor: '#111', marginTop: 10, borderRadius: 500}}></View>
                    {
                        organizador.id_users != info.id_part && ID == organizador.id_users ? 
                        (
                        <>
                            <View style={{flexDirection: 'row', justifyContent: 'space-evenly', width: '100%'}}>
                                <TouchableOpacity onPress={type => handleAlert(1)} style={{height: 50, width: 50, backgroundColor: '#f7eeee', paddingTop: 2, paddingLeft: 2, justifyContent: 'center', alignItems: 'center', marginTop: 5, borderWidth: 1, borderRadius: 10}}>
                                    <AntDesign name="flag" size={45} color="blue" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={type => handleAlert(2)} style={{height: 50, width: 50, backgroundColor: '#f7eeee', justifyContent: 'center', alignItems: 'center', marginTop: 5, borderWidth: 1, borderRadius: 10}}>
                                    <AntDesign name="close" size={50} color="red" />
                                </TouchableOpacity>
                            </View>
                            <View style={{borderWidth: 1, width: '90%', borderColor: '#111', marginTop: 5, borderRadius: 500}}></View>
                        </>
                        )
                        :
                        <View/>
                    }
                    <ScrollView indicatorStyle='white' style={[styles.containerScroll, {paddingTop: 10}]} showsVerticalScrollIndicator={true}>
                    

                    <View style={styles.flexBox}>
                        <View style={styles.flexCPF}>
                            {/* <Text style={[{color: '#fff', fontSize: 15}, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}>{cpf}</Text> */}
                            <TextInputMask
                                type={'cpf'}
                                editable={false}
                                value={info.user.cpf}
                                style={[{color: '#fff', fontSize: 15}, {fontFamily: 'helvetica-bold'}]}
                                />
                        </View>
                        <View style={styles.flexPhone}>
                            {/* <Text style={[{color: '#fff', fontSize: 15}, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}>{telefone}</Text> */}
                        
                            <TextInputMask
                                type={'cel-phone'}
                                placeholder="Telefone"
                                placeholderTextColor="#fff"
                                editable={false}
                                options={{
                                maskType: 'BRL',
                                withDDD: true,
                                dddMask: '(99) ',
                                }}
                                style={[{color: '#fff', fontSize: 15},{fontFamily: 'helvetica-bold'} ]}
                                value={info.user.telefone}
                            />
                        </View>
                    </View>

                    <View style={styles.flexBox}>
                        <View style={styles.flexAddress}>
                            <Text style={[{color: '#fff', fontSize: 15},{fontFamily: 'helvetica-bold'}]}>{info.user.logradouro}</Text>
                        </View>
                        <View style={styles.flexNumber}>
                            <Text style={[{color: '#fff', fontSize: 15}, {fontFamily: 'helvetica-bold'}]}>{info.user.numero}</Text>
                        </View>
                    </View>

                    <View style={styles.flexBox}>
                        <View style={styles.flexCity}>
                            <Text style={[{color: '#fff', fontSize: 15}, {fontFamily: 'helvetica-bold'}]}>{info.user.cidade}</Text>
                        </View>
                        <View style={styles.flexState}>
                            <Text style={[{color: '#fff', fontSize: 15}, {fontFamily: 'helvetica-bold'} ]}>{info.user.estado}</Text>
                        </View>
                    </View>
                </ScrollView>
                </View>
                <SafeAreaView style={{position: 'absolute'}}>
                    <TouchableOpacity  onPress={item => setModalUser(false)} style={{marginLeft: 10, marginTop: 10, opacity: 0.9, width: 50, height: 50, borderRadius: 100, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'}}>
                        <Ionicons name="ios-arrow-back" size={50} color="#ff1040"  />
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
                    
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalSearch}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View onTouchStart={item => setModalSearch(false)} style={{width: '100%', height: '100%', backgroundColor: '#111', opacity: 0.5, position: 'absolute'}} />
                <View style={{width: '94%', height: '60%', backgroundColor: '#fff', justifyContent: 'space-between', alignItems: 'center', left: '3%', top: '20%', borderRadius: 10, position: 'relative', borderWidth: 2, borderColor: '#fff'}}>
                   
                    
                        {/* {console.log(String(Number(valueOfRequest[0]))) } */}
                        <TextInputMask
                            type={'custom'}
                            options={String(Number(valueOfRequest[0])) === 'NaN' ? {
                              /**
                               * mask: (String | required | default '')
                               * the mask pattern
                               * 9 - accept digit.
                               * A - accept alpha.
                               * S - accept alphanumeric.
                               * * - accept all, EXCEPT white space.
                              */
                              mask: '**********************************************'
                            } : {mask: '999.999.999-99'}}
                            value={valueOfRequest}
                            onChangeText={setValueOfRequest}
                                onKeyPress={item => {
                                    clearTimeout(timeouts);
                                    setTimeouts(null)
                                    
                                    if (valueOfRequest.length === 0) {
                                        return;
                                    }
                                    setTimeouts(
                                        setTimeout(() => {
                                            handleSearchUsers()
                                        }, 400)
                                    )
                                }}
                            style={{width: '90%', height: 50, textAlign: 'center', borderBottomColor: '#ff1040', borderBottomWidth: 3, backgroundColor: '#eee', marginTop: 20, marginBottom: 15}}/>
                        
                        {// <TextInput 
                        //     value={valueOfRequest}
                        //     onChangeText={setValueOfRequest}
                        //     onKeyPress={item => {
                        //         clearTimeout(timeouts);
                        //         setTimeouts(null)
                        //         if (valueOfRequest.length === 0) {
                        //             return;
                        //         }
                        //         setTimeouts(
                        //             setTimeout(() => {
                        //                 handleSearchUsers()
                        //             }, 400)
                        //         )
                        //     }}
                        //     style={{width: '90%', height: 50, textAlign: 'center', borderBottomColor: '#ff1040', borderBottomWidth: 3, backgroundColor: '#eee', marginTop: 20, marginBottom: 15}}/>
                        }

                    <ScrollView style={{width: '100%'}}>
                        {
                            newParticipants.map(item => (
                                <TouchableOpacity onPress={data => handleAddParticipant(item)}  style={[{ left: '5%',  width: '90%', borderRadius: 10, borderWidth: 1, marginTop: 10}, addParticipant.includes(item.id_users) ? {borderColor: '#0f0', borderWidth: 2} : {borderColor: '#aaa'}]}> 
                                    <View style={{height: 50, flexDirection: 'row', borderRadius: 10}}>
                                        <Image source={{uri: `http://${require('./ip').default}:3516/files/${item.uri}`}} style={{height: '100%', width: '20%', borderTopLeftRadius: 10, borderBottomLeftRadius: 10}}/>
                                        <View style={{ width: '80%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                            <Text>{item.cpf}</Text>
                                            <Text>{item.nome}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }


                    </ScrollView>

                    <TouchableOpacity onPress={handleSubmitParticipant} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#ff1040', height: 50, width: '90%', marginBottom: 15, borderWidth: 1, marginTop: 15, borderRadius: 10, borderColor: 'white'}}>
                        <Text style={{textAlign: 'center', color: '#fff', fontFamily: 'helvetica-bold', fontSize: 16}}>Adicionar participante</Text>
                    </TouchableOpacity>
                </View>
                <SafeAreaView style={{position: 'absolute'}}>
                    <TouchableOpacity  onPress={item => setModalSearch(false)} style={{marginLeft: 10, marginTop: 10, opacity: 0.9, width: 50, height: 50, borderRadius: 100, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center'}}>
                        <Ionicons name="ios-arrow-back" size={50} color="#ff1040"  />
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
        </>
    );
}
const styles = StyleSheet.create({
    containerScroll: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: '5%',
    },
    flexName: {
        backgroundColor: '#ff1040', 
        borderRadius: 10,
        height: 50, 
        width: '100%', 
        justifyContent: 'center',
        alignItems: 'center'
    },
    flexCPF: {
        backgroundColor: '#ff1040', 
        borderRadius: 10,
        height: 50, 
        width: '45%', 
        justifyContent: 'center',
        alignItems: 'center'
    },
    flexPhone: {
        marginLeft: '5%',
        backgroundColor: '#ff1040', 
        borderRadius: 10,
        height: 50, 
        width: '50%', 
        justifyContent: 'center',
        alignItems: 'center'
    },
    flexAddress: {
        backgroundColor: '#ff1040', 
        borderRadius: 10,
        height: 50, 
        width: '65%', 
        justifyContent: 'center',
        alignItems: 'center'
    },
    flexNumber: {
        marginLeft: '5%',
        backgroundColor: '#ff1040', 
        borderRadius: 10,
        height: 50, 
        width: '30%', 
        justifyContent: 'center',
        alignItems: 'center'
    },
    flexCity: {
        backgroundColor: '#ff1040', 
        borderRadius: 10,
        height: 50, 
        width: '65%', 
        justifyContent: 'center',
        alignItems: 'center'
    },
    flexState: {
        marginLeft: '5%',
        backgroundColor: '#ff1040', 
        borderRadius: 10,
        height: 50, 
        width: '30%', 
        justifyContent: 'center',
        alignItems: 'center'
    },
    flexButtonSave: {
        backgroundColor: '#00aa00', 
        borderRadius: 10,
        height: 50, 
        width: '100%', 
        justifyContent: 'center',
        alignItems: 'center'
    },
    flexBox: {
        width: '100%', 
        marginTop: '2%',
        flexDirection: 'row',
    },
    safeContainer: {
        backgroundColor: '#ff1040',
        position: 'absolute', 
        zIndex: 5 , 
        left: '-10%',
        height: '35%', 
        width: '120%', 
        paddingLeft: 0,
        shadowColor: "#444",
        shadowOffset: { width: 0, height: 0},
        shadowOpacity: 1,
        elevation: 5,
        shadowRadius: 20
    },
    safeHeader: {
        marginTop: 5,
        marginLeft: '12%',
        width: '80%',
        flexDirection: 'row'
    },
    safeBack: {
        height: '50%',
        width: '10%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeBody: {
        marginTop: -20,
        marginLeft: '12%',
        width: '75%',
        justifyContent: "center",
        alignItems: 'center',
    },
    safeImage: {
        height: 80, 
        width: 80,
        borderRadius: 40
    },
    safeNick: {
        color: '#fff',
        marginTop: 5,
        fontSize: 18
    }
})


export default MyTeam