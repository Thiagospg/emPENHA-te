import React, { useState } from 'react';
import styles from './style';
import firebase from '../../config/firebaseconfig';
import { Feather } from '@expo/vector-icons';
import * as Google from 'expo-google-app-auth';
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

    //Sign in using a simple account created in the app
    const handleLogin = (login, password) => {
        firebase.auth().signInWithEmailAndPassword(login, password)
        .then((userCredential) => {
            
            let user = userCredential.user;
            console.log(user.uid)
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

    //Sign in using a Google account
    async function signInWithGoogleAsync() {
        let iosId = '369592394902-nt7e25ru5ibvsr4fcsf5j1apqo1pkqq7.apps.googleusercontent.com';
        let androidId = '369592394902-pat534vgljl6eddjatd66ktnishku7dm.apps.googleusercontent.com'
        try {
          const result = await Google.logInAsync({
            behaviour:'web',
            androidClientId: androidId,
            iosClientId: iosId,
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
            const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken)   
        
            firebase.auth().signInWithCredential(credential).then(() => {
                navigation.navigate("PostHome", {userId: firebase.auth().currentUser.uid})
            });
            //return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          return { error: true };
        }
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
                style={styles.buttonLogin}>
                    <Text style={styles.textButton}>Entrar</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.boxButton}>
                <TouchableOpacity 
                onPress={() => signInWithGoogleAsync()}
                style={styles.buttonGoogle}>
                    <Text style={styles.textButton}>GOOGLE</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}