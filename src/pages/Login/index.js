import React, { useState, useEffect } from 'react';
import styles from './style';
import firebase from '../../config/firebaseconfig';
import { Feather } from '@expo/vector-icons';
import * as Google from 'expo-google-app-auth';
import { FontAwesome } from '@expo/vector-icons'; 
import { View, 
         Text, 
         SafeAreaView,
         TextInput,
         Image,
         TouchableOpacity,
         Alert
        } from 'react-native';

export default function Login({ route, navigation }){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(true);

    //Sign in using a simple account created in the app
    const handleLogin = (email, password) => {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;

            if (user.emailVerified) {
                navigation.navigate("PostHome", {userId: user.uid})
            } else {
                Alert.alert('Não foi possível entrar', 'O email ainda não foi ativado. Por favor, verifique sua caixa de email para ativar esta conta.')
            }
            
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            
            console.log(errorCode + ' ' + errorMessage);
            
            switch(errorCode){
                case 'auth/invalid-email':
                    Alert.alert('Não foi possível entrar','O email está incorreto');
                case 'auth/wrong-password':
                    Alert.alert('Não foi possível entrar','A senha está incorreta');
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
                        placeholder="Email"
                        value={email}
                        onChangeText={(val) => setEmail(val)}
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
                onPress={() => handleLogin(email, password)}
                style={styles.buttonLogin}>
                    <Text style={styles.textButton}>Entrar</Text>
                </TouchableOpacity>
            </View>

            
            <View style={styles.boxButton}>
                <TouchableOpacity 
                onPress={() => signInWithGoogleAsync()}
                style={styles.buttonGoogle}>
                    <View style={styles.boxButtonGoogle}>
                        <View style={styles.boxGoogleButtonIcon}>
                            <FontAwesome name="google" size={22} color="#EA4335"/>
                        </View>
                        <View style={styles.boxButtonGoogleText}>
                            <Text style={styles.textButtonGoogle}>Entrar com Google</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.boxButton}>
                <TouchableOpacity 
                onPress={() => signInWithGoogleAsync()}
                style={styles.buttonFacebook}>
                    <View style={styles.boxButtonFacebook}>
                        <View style={styles.boxFacebookButtonIcon}>
                            <FontAwesome name="facebook" size={22} color="#097EEB"/>
                        </View>
                        <View style={styles.boxButtonFacebookText}>
                            <Text style={styles.textButtonFacebook}>Entrar com Facebook</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.boxRegister}>
                <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                    <Text style={styles.textRegister}>Não tem uma conta? Crie uma clicando aqui!</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}