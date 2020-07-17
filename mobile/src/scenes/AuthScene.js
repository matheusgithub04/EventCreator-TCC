import React, {useState, useEffect} from "react";
import {StyleSheet, Text, View, Image, TouchableOpacity, Modal, ScrollView, KeyboardAvoidingView, StatusBar,Platform, AsyncStorage } from "react-native";
import InputTextField from "../../components/InputTextField";
//import Constants from 'expo-constants';
import * as LocalAuthentication from 'expo-local-authentication';
import successAnimationJson from '../../assets/success.json'
import failedAnimationJson from '../../assets/failed.json'
import Lottie from 'lottie-react-native'
import api from '../services/api'

export default function App({navigation}) {
    const [forgotPassword, setForgotPassword] = useState(false)
    const [ajuste, setAjuste] = useState({})
    const [cpf, setCpf] = useState('')
    const [senha, setSenha] = useState('')
    const [successAnimation, setSuccessAnimation] = useState({display: "none"})   
    const [failedAnimation, setFailedAnimation] = useState({display: "none"})   

    useEffect(() => {
        setSuccessAnimation({display: "none"})
        setFailedAnimation({display: "none"})
        AsyncStorage.getItem('cpf', (e, r) => {
            if(r){
                navigation.navigate('voice')
            }
        })
    }, [])

    const scanFingerPrint = async () => {
        try {
          let results = await LocalAuthentication.authenticateAsync();
          if (results.success) {
            this.setState({
              modalVisible: false,
              authenticated: true,
              failedCount: 0
            });
          } else {
            scanFingerPrint()
            this.setState({
              failedCount: this.state.failedCount + 1,
            });
          }
        } catch (e) {
        }
      };
      //Platform.OS === 'ios' ? scanFingerPrint() : '' 
      
        async function handleLogin(){
            
            setCpf(cpf.replace('.', '').replace('-', '').replace('.', ''))
            console.log(cpf)
            const {data} = await api.post('/auth', {
                cpf,
                senha
            })
            if(data.auth){
                let cpfs = String(data.Logins.cpf)
                let ids = String(data.Users.id_users)
                let uri = String(data.Users.uri)
                AsyncStorage.setItem('cpf', cpfs)
                AsyncStorage.setItem('id', ids)
                AsyncStorage.setItem('senha', senha)
                AsyncStorage.setItem('uri', uri)
                setSuccessAnimation({display: "flex"})
                setTimeout(() => {
                    setSuccessAnimation({display: "none"})
                    navigation.navigate('voice')
                }, 780);
            }else{
                setFailedAnimation({display: "flex"})
                setTimeout(() => {
                    setFailedAnimation({display: "none"})
                }, 780);
            }
        }

        return (
            <>
            <StatusBar barStyle='dark-content' backgroundColor='#16182F'/>
            <KeyboardAvoidingView style={styles.container} behavior='padding' enabled={true}>
                <ScrollView indicatorStyle='white' style={styles.containerScroll} showsVerticalScrollIndicator={false}>
                    <View>
                        <View style={{ marginTop: 20, alignItems: "center", justifyContent: "center" }}>
                            
                            <View style={{flexDirection: 'row', marginTop: 20}}>

                            <Image source={require("../../assets/logo-amazing-red.png")} />
                            
                            </View>
                            </View>
                        <View style={{ marginTop: 48, flexDirection: "row", justifyContent: "center" }}>
                            <TouchableOpacity>
                                <View style={styles.socialButton}>
                                    <Image source={require("../../assets/assets/facebook.png")} style={styles.socialLogo} />
                                    <Text style={styles.text}>Facebook</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.socialButton}>
                                <Image source={require("../../assets/assets/google.png")} style={styles.socialLogo} />
                                <Text style={styles.text}>Google</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.text, { color: "#aaa", fontSize: 15, textAlign: "center", marginVertical: 20 }]}>ou</Text>

                        <InputTextField title="CPF" cpf='2' setState={setCpf} state={cpf}/>
                        <InputTextField 
                            setState={setSenha}
                            states={senha}
                            style={{
                                marginTop: 32,
                                marginBottom: 8,
                            }}
                            title="Senha"
                            isSecure={true}
                            
                        />

                        <Text onPress={()=> {setForgotPassword(true)}} style={[styles.text, styles.link, { textAlign: "right" }]}>Esqueceu a sua senha?</Text>

                        <TouchableOpacity onPress={handleLogin} style={styles.submitContainer}>
                            <Text
                                style={[
                                    styles.text,
                                    {
                                        color: "#fff",
                                        fontWeight: "bold",
                                        fontSize: 18,
                                    }
                                ]}
                            >
                                LOGIN
                            </Text>
                        </TouchableOpacity>

                        <Text
                            style={[
                                styles.text,
                                {
                                    fontSize: 14,
                                    color: "#ABB4BD",
                                    textAlign: "center",
                                    marginTop: 24,
                                }
                            ]}
                        >
                          {//}  Não possui uma conta? <Text onPress={() => {navigation.navigate('register')}} style={[styles.text, styles.link]}>Registre-se agora!</Text>
                            }
                            <Text style={[styles.text, styles.link]}>Registre-se agora no site</Text>
                        </Text>
                        {failedAnimation.display == 'flex' ? <Lottie source={failedAnimationJson}   autoPlay loop/> : <View/>}
                        {successAnimation.display == 'flex' ? <Lottie source={successAnimationJson}  autoPlay loop/> : <View/>}
                        
                        
                    </View>
                </ScrollView>
                <Modal
                    transparent={true}
                    visible={forgotPassword}
                >
                    <KeyboardAvoidingView onLayout={() => {Platform.OS === 'android' ? setAjuste({marginBottom: '20%', marginTop: '10%'}): ''}} style={{flex: 1, backgroundColor: '#000000aa'}}   enabled={true}>

                        <View style={[styles.modal, {paddingTop: 40}, ajuste]}>
                            
                            <InputTextField colo={{color: '#111'}} bold={{borderWidth: 2}} style={[styles.inputTitle, {height: 100, color: '#111'}]} title="Email" />
                        
                        
                            <TouchableOpacity style={styles.submitContainerMod}>
                                <Text
                                    style={[
                                        styles.text,
                                        {
                                            color: '#fff',
                                            fontWeight: "600",
                                            fontSize: 11,
                                        }
                                    ]}
                                >
                                    Enviar
                                </Text>
                            </TouchableOpacity>
                        </View>

                        
                        <TouchableOpacity onPress={() => {setForgotPassword(false)}} style={[styles.submitContainer, {backgroundColor: '#fff'}]}>
                            <Text
                                style={[
                                    styles.text,
                                    {
                                        color: "#111",
                                        fontWeight: "bold",
                                        fontSize: 18
                                    }
                                ]}
                            >
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </Modal>
            </KeyboardAvoidingView>
        </>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    containerScroll: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 30
    },
    text: {
        color: "#111"
    },
    modal: {
        backgroundColor: '#fff', 
        marginTop: '50%', 
        borderRadius: 10, 
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 30,
        marginRight: 30,
        marginBottom: '40%'
    },
    textTitle: {
        color: "#fff"
    },
    socialButton: {
        flexDirection: "row",
        marginHorizontal: 12,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "rgba(171, 180, 189, 0.65)",
        borderRadius: 4,
        backgroundColor: "#fff",
        shadowColor: "rgba(171, 180, 189, 0.35)",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5
    },
    socialLogo: {
        width: 16,
        height: 16,
        marginRight: 8
    },
    link: {
        color: "#ff1040",
        fontSize: 14,
        fontWeight: "bold"
    },
    submitContainer: {
        backgroundColor: "#ff1040",
        fontSize: 16,
        borderRadius: 4,
        paddingVertical: 12,
        marginTop: 32,
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        shadowColor: "#ff1040",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 15,
        elevation: 5
    },
    submitContainerMod: {
        backgroundColor: "#111",
        fontSize: 16,
        width: '90%',
        borderRadius: 4,
        paddingVertical: 12,
        marginTop: 5,
        alignItems: "center",
        justifyContent: "center",
        color: "#FFF",
        shadowColor: "#111",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5,
        height: 50
    },
    inputTitle: {
        color: '#111',
        width: '90%'
    }
});
