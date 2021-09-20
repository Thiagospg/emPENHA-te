import React, { useState, useEffect } from 'react';
import firebase from '../../config/firebaseconfig';
import { Feather } from '@expo/vector-icons';
import styles from './style';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, Animated } from 'react-native';

export default function ForgotPassword({ navigation }){
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [radiusAnimated] = useState(new Animated.Value(0))
    const [opacity] = useState(new Animated.Value(0))
    const [redefineError, setRedefineError] = useState(null)

    const handlePasswordRedefinition = (email) => {

        firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            console.log('Redefined')
          
            Alert.alert('Redefinição de senha','Um email foi enviado para o endereço informado. Por favor, verifique a sua caixa de entrada')
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode + ' ' + errorMessage)
            
            switch(errorCode){
                case 'auth/invalid-email':
                    setRedefineError('*Preencha o email corretamente')
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
                        <Text style={{fontSize:22,color:'#f5cec6'}}>Redefina a senha</Text>
                    </View>
            </Animated.View>

            <Animated.View style={[styles.boxInput,{opacity:opacity}]}> 
                <View style={styles.boxInputLogin}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email a redefinir a senha"
                        value={email}
                        onChangeText={(val) => setEmail(val)}
                    />
                </View>

                <View style={styles.boxButton}>
                    <TouchableOpacity 
                    onPress={() => handlePasswordRedefinition(email)}
                    style={styles.buttonRedefine}>
                        <Text style={styles.textButton}>Redefinir</Text>
                    </TouchableOpacity>
                </View>

                {redefineError !== null ?
                    <View style={styles.boxRedefineError}>
                        <Text style={styles.textRedefineError}>{redefineError}</Text>
                    </View>
                : null}

            </Animated.View>
            <Animated.View style={[styles.viewFooter,{borderTopStartRadius:radiusAnimated}]} /> 
        </SafeAreaView>
    );
}