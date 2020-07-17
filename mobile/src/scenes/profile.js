import React, {useEffect, useState} from 'react'
import { AsyncStorage, Image, StyleSheet, View, TextInput, Text, ScrollView, TouchableOpacity, Keyboard, SafeAreaView, StatusBar} from 'react-native'
import { requestPermissionsAsync,  getCurrentPositionAsync} from 'expo-location'
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';

import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import api from '../services/api'
import {TextInputMask} from 'react-native-masked-text';

function Profile({navigation}) {
    const [fontLoaded, setFontLoaded] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const [avatar, setAvatar] = useState({test: false});
    
    const [nome, setNome] = useState('');
    const [cpf, setCPF] = useState('');
    const [cidade, setCidade] = useState('');
    const [numero, setNumero] = useState('');
    const [logradouro, setLogradouro] = useState('');
    const [telefone, setTelefone] = useState('');
    const [estado, setEstado] = useState('');
    const [senha, setSenha] = useState('');

    useEffect(()=> {
        
        AsyncStorage.getItem('cpf', (e, f) => {
            setCPF(f)
            console.log(cpf)
            AsyncStorage.getItem('senha', (e, r) => {
                setSenha(r)
                bioLoading(f, r)
            })
        })


    }, [])
    
    async function bioLoading(cpfs, senhas){
        const {data} = await api.post('/auth', {cpf: cpfs, senha: senhas})
        console.log(data)
        setNome(data.Users.nome)
        setTelefone(data.Users.telefone)
        setLogradouro(data.Users.logradouro)
        setNumero(data.Users.numero)
        setEstado(data.Users.estado)
        setCidade(data.Users.cidade)
        AsyncStorage.setItem('uri', data.Users.uri)
        
        setAvatar({uri: `http://${require('./ip').default}:3516/files/`+data.Users.uri})
    }

    async function fontLoading(){
        await Font.loadAsync({
            'helvetica-bold': require('./Fonts/Helvetica/Helvetica-Bold.ttf'),
        });
    
        setFontLoaded(true)
    }

    function handleBack(){
        navigation.goBack()
    }

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
        setAvatar(json)
        setUploaded(true)
    }
    
    async function uploadImage() {
        const dataa = new FormData();
        
        dataa.append('file', {
            uri : avatar.uri,
            type: avatar.type,
            name: 'perfil',

        });
        // AsyncStorage.getItem('cpf', (e,r) => {
        //     dataa.append('cpf', r)
        // })
        dataa.append('cpf', cpf)
        console.log(cpf)

        const {data} = await api.post('/images', dataa).catch((e)=>{
            alert(e)
        })
        console.log(data)
        AsyncStorage.setItem('uri', String(data.uri))
        setUploaded(false)
    }

    fontLoading()
    return (   
        <>     
            <StatusBar backgroundColor="#ff1040"  barStyle="light-content"/>
            <SafeAreaView style={{backgroundColor: '#111', flex: 2}}>
                <ScrollView indicatorStyle='white' style={styles.containerScroll} showsVerticalScrollIndicator={false}>
                    
                    <View style={styles.flexName}>
                        <Text style={[{color: '#fff', fontSize: 15}, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}>{nome}</Text>
                    </View>

                    <View style={styles.flexBox}>
                        <View style={styles.flexCPF}>
                            {/* <Text style={[{color: '#fff', fontSize: 15}, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}>{cpf}</Text> */}
                            <TextInputMask
                                type={'cpf'}
                                editable={false}
                                value={cpf}
                                onChangeText={text => setCPF(text)}
                                style={[{color: '#fff', fontSize: 15}, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}
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
                                style={[{color: '#fff', fontSize: 15}, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}
                                value={telefone}
                                onChangeText={text => {
                                setTelefone(text);
                                }}
                            />
                        </View>
                    </View>

                    <View style={styles.flexBox}>
                        <View style={styles.flexAddress}>
                            <Text style={[{color: '#fff', fontSize: 15}, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}>{logradouro}</Text>
                        </View>
                        <View style={styles.flexNumber}>
                            <Text style={[{color: '#fff', fontSize: 15}, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}>{numero}</Text>
                        </View>
                    </View>

                    <View style={styles.flexBox}>
                        <View style={styles.flexCity}>
                            <Text style={[{color: '#fff', fontSize: 15}, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}>{cidade}</Text>
                        </View>
                        <View style={styles.flexState}>
                            <Text style={[{color: '#fff', fontSize: 15}, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}>{estado}</Text>
                        </View>
                    </View>
                    {uploaded === true ? (
                        <TouchableOpacity onPress={uploadImage} style={styles.flexBox}>
                            <View style={styles.flexButtonSave}>
                                <Text style={[{color: '#fff', fontSize: 20}, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}>Salvar</Text>
                            </View>
                        </TouchableOpacity>
                        ) 
                    : <View/>}
                </ScrollView>
            </SafeAreaView>
            
            <SafeAreaView style={[styles.safeContainer, Platform.OS == 'ios' ? {
                borderBottomStartRadius: '200%',
                borderBottomEndRadius: '200%',
                shadowRadius: '35%'} : '']}>

                <View style={styles.safeHeader}>
                    <Text style={[{color: '#fff', fontSize: 30, width: '85%'}, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}>Perfil</Text>
                    <TouchableOpacity onPress={handleBack} style={[styles.safeBack, Platform.OS == 'ios' ? {borderRadius: '50%'} : '']}>
                        <Ionicons name="ios-arrow-forward" size={30} color="#fff"  />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={imagePickerCall} style={[styles.safeBody]}>
                    <Image style={styles.safeImage} source={{uri: avatar.test ? avatar.uri : avatar.uri}} />
            <Text style={[styles.safeNick, fontLoaded == true ? {fontFamily: 'helvetica-bold'} : '']}>{nome}</Text>
                </TouchableOpacity>
            </SafeAreaView>
            
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
    flexName: {
        backgroundColor: '#ff1040', 
        borderRadius: 10,
        height: 50, 
        width: '100%', 
        marginTop: '5%',
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
        marginTop: '5%',
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


export default Profile