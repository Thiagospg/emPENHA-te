import React, { useState, useEffect } from 'react';
import firebase from '../../config/firebaseconfig';
import { Feather } from '@expo/vector-icons';
import styles from './style';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, Animated } from 'react-native';

export default function Register({ navigation }){
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [radiusAnimated] = useState(new Animated.Value(0))
    const [opacity] = useState(new Animated.Value(0))
    const [registerError, setRegisterError] = useState(null)

    const AsyncAlert = () => {
        return new Promise((resolve, reject) => {
            Alert.alert(
                'Conta criada',
                'A conta informada foi criada com sucesso. Verifique a caixa de entrada para ativá-la',
                [
                    {text: 'OK', onPress: () => resolve('OK') },
                ],
                { cancelable: true }
            )
        })
    }    

    const handleRegister = (email, password) => {

        if (password !== repeatPassword) {
            setRegisterError('*As senhas não conferem. Digite novamente')
            return
        } 

        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(async (userCredential) => {
        
            var user = userCredential.user;
            console.log('Registered')
            user.sendEmailVerification();
            navigation.navigate("Login")
            const userResponse = await AsyncAlert()
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode + ' ' + errorMessage)
            
            switch(errorCode){
                case 'auth/invalid-email':
                    setRegisterError('*O email está incorreto')
                    break;
                case 'auth/email-already-in-use':
                    setRegisterError('*O email informado já está cadastrado. Use-o para fazer o login ou informe outro')
                    break;
                case 'auth/weak-password':
                    setRegisterError('*A senha deve conter no mínimo 6 caracteres')
                    break;
                }

        });
    }

    useEffect(() => {
        Animated.parallel([
         Animated.timing(
             radiusAnimated,
             {
                 toValue: 150,
                 duration: 1500,
                 useNativeDriver: true
             },
         ),
 
         Animated.timing(
             opacity,
             {
                 toValue: 1,
                 duration: 2500,
                 useNativeDriver: true
             },
         )
        ]).start(); 
       }, []);
    
    return(
        <SafeAreaView style={styles.container}>
            <Animated.View style={[styles.viewHeader, {borderBottomEndRadius:radiusAnimated}]}> 
                    <View style={{flex:0.3}}>
                        <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
                            <Feather style={{marginLeft:20}} name="arrow-left" size={25} color='#f5cec6' />
                        </TouchableOpacity>
                    </View>

                    <View style={{flex:0.7}}>
                        <Text style={{fontSize:22,color:'#f5cec6'}}>Crie uma conta</Text>
                    </View>
            </Animated.View>

            <Animated.View style={[styles.boxInput,{opacity:opacity}]}> 
                <View style={styles.boxInputLogin}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={(val) => setEmail(val)}
                    />
                </View>
                <View style={styles.boxInputPassword}>
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(val) => setPassword(val)}
                    />
                </View>
                <View style={styles.boxInputPassword}>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite a senha novamente"
                        secureTextEntry={true}
                        value={repeatPassword}
                        onChangeText={(val) => setRepeatPassword(val)}
                    />
                </View>

                <View style={styles.boxButton}>
                    <TouchableOpacity 
                    onPress={() => handleRegister(email, password)}
                    style={styles.buttonRegister}>
                        <Text style={styles.textButton}>Cadastrar</Text>
                    </TouchableOpacity>
                </View>

                {registerError !== null ?
                    <View style={styles.boxRegisterError}>
                        <Text style={styles.textRegisterError}>{registerError}</Text>
                    </View>
                : null}

            </Animated.View>
            <Animated.View style={[styles.viewFooter,{borderTopStartRadius:radiusAnimated}]} /> 
        </SafeAreaView>
    );
}