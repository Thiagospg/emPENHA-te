import React, { useState, useEffect } from 'react';
import styles from './style';
import firebase from '../../config/firebaseconfig';
import { Feather } from '@expo/vector-icons';
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';
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
    const [loginError, setLoginError] = useState(null)

    //Sign in using a simple account created in the app
    const handleLogin = (email, password) => {
        if (email === null || email === '' || password === null || password === ''){
            setLoginError('*Preencha os campos corretamente')
            return
        }
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            let user = userCredential.user;

            if (!user.emailVerified) {
                setLoginError('*O email ainda não foi ativado. Por favor, verifique sua caixa de email para ativar esta conta')
                return
            } 
            navigation.navigate("PostHome", {userId: user.uid})
        })
        .catch((error) => {
            let errorCode = error.code;
            let errorMessage = error.message;
            
            console.log(errorCode + ' ' + errorMessage);
            
            switch(errorCode){
                case 'auth/invalid-email':
                    setLoginError('*O email está incorreto')
                    break;
                case 'auth/wrong-password':
                    setLoginError('*A senha está incorreta')
                    break;
                case 'auth/user-not-found':
                    setLoginError('*Email não cadastrado')
                    break;
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
        //ExpoGo Id's
        //let iosId = '369592394902-nt7e25ru5ibvsr4fcsf5j1apqo1pkqq7.apps.googleusercontent.com';
        //let androidId = '369592394902-pat534vgljl6eddjatd66ktnishku7dm.apps.googleusercontent.com'
        
        let androidIdStandalone = '369592394902-1asbl1j2060bjjg1q2g6skv068ggqefp.apps.googleusercontent.com'
        let iosIdStandalone = '369592394902-hcsd3lm5tuid9lhki53jd7ndcfie1iam.apps.googleusercontent.com'
        try {
          const result = await Google.logInAsync({
            //androidClientId: androidId,
            //iosClientId: iosId,
            behaviour:'web',
            androidStandaloneAppClientId: androidIdStandalone,
            iosStandaloneAppClientId: iosIdStandalone,
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
            const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken)   
        
            firebase.auth().signInWithCredential(credential).then(() => {
                navigation.navigate("PostHome", {userId: firebase.auth().currentUser.uid})
            });
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          return { error: true };
        }
      }
      
      const signUpFacebook = async () => {
        try {
          await Facebook.initializeAsync({
              appId:"215114547266039",
          });
          const { type, token } = await Facebook.logInWithReadPermissionsAsync({
            permissions: ["public_profile", "email"],
          });
          if (type === "success") {       
            const credential = firebase.auth.FacebookAuthProvider.credential(token)

            firebase.auth().signInWithCredential(credential).then(() => {
                navigation.navigate("PostHome", {userId: firebase.auth().currentUser.uid})
            }).catch((error) => {
                var errorCode = error.code;
                console.log(errorCode)

            });
          } else {
            return { cancelled: true };
          }
        } catch (e) {
            return { error: true };
        }
      };
    

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
                                color="#622565"
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

            {loginError !== null ?
                <View style={styles.boxLoginError}>
                    <Text style={styles.textLoginError}>{loginError}</Text>
                </View>
            : null}

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
                onPress={() => signUpFacebook()}
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