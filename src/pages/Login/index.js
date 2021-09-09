import React, { useState } from 'react';
import styles from './style';
import firebase from '../../config/firebaseconfig';
import { Feather } from '@expo/vector-icons';
import { View, 
         Text, 
         SafeAreaView,
         TextInput,
         Image,
         TouchableOpacity
        } from 'react-native';

export default function Login({ navigation }){

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(true);

    const handleLogin = (login, password) => {
        firebase.auth().signInWithEmailAndPassword(login, password)
        .then((userCredential) => {
            
            let user = userCredential.user;
            
            navigation.navigate("PostHome", {userId: user.uid})

        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            
            if (errorCode === 'auth/invalid-email'){
                alert('E-mail ou senha incorreto')
            }else {
                console.log(errorCode + ' ' + errorMessage);
            }
            
        });
    }

    const handleDeslogin = () => {
        firebase.auth().signOut().then(() => {
            alert('Deslogado com sucesso')
          }).catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;

            console.log(errorCode + ' ' + errorMessage);
          });
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.boxLogo}>
                <Image 
                    style={styles.imageLogo}
                    source={require('../../../assets/logo.png')}
                />
            </View>
              
            <View style={styles.boxInput}> 
                <View style={styles.boxInputLogin}>
                    <TextInput
                        style={styles.input}
                        placeholder="Login"
                        value={login}
                        onChangeText={(val) => setLogin(val)}
                    />
                </View>
                <View style={styles.boxInputPassword}>
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        secureTextEntry={passwordVisible}
                        value={password}
                        onChangeText={(val) => setPassword(val)}
                    />
                   
                   <TouchableOpacity 
                    style={styles.iconPasswordView} 
                    onPress={() => setPasswordVisible(passwordVisible === true ? false : true)}>
                        <Text>
                            <Feather 
                                name={passwordVisible === true ? "eye-off" : "eye"} size={24} 
                                color="#e0972b"
                            />
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.boxButton}>
                <TouchableOpacity 
                onPress={() => handleLogin(login, password)}
                style={styles.button}>
                    <Text style={styles.textButton}>Entrar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}