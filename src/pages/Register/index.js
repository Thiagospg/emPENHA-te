import React, { useState } from 'react';
import firebase from '../../config/firebaseconfig';
import { Feather } from '@expo/vector-icons';
import styles from './style';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';

export default function Register({ navigation }){
    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')

    const handleRegister = (email, password) => {
        if (password === repeatPassword) {
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
            
                var user = userCredential.user;
                console.log('Registered')
                user.sendEmailVerification();
                Alert.alert('Conta criada com sucesso', 'Por favor, verifique a sua caixa de entrada do email para ativar esta conta.')

                navigation.navigate("Login")
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode + ' ' + errorMessage)
                
                switch(errorCode){
                    case 'auth/invalid-email':
                        Alert.alert('Não foi possível realizar o cadastro', 'O email está incorreto')
                        break;
                    case 'auth/email-already-in-use':
                        Alert.alert('Não foi possível realizar o cadastro','O email informado já está cadastrado. Use-o para fazer o login ou informe outro.')
                        break;
                    case 'auth/weak-password':
                        Alert.alert('Não foi possível realizar o cadastro', 'A senha deve conter no mínimo 6 caracteres')
                        break;
                    }

            });
        } else {
            Alert.alert('Não foi possível realizar o cadastro','As senhas não são iguais. Digite novamente!')
        }
    }
    

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.boxInput}> 
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
            </View>
        </SafeAreaView>
    );
}