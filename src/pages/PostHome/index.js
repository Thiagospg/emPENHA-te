import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, BackHandler, Alert, SafeAreaView } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import * as Notifications from 'expo-notifications';
import firebase from '../../config/firebaseconfig';
import { FontAwesome } from '@expo/vector-icons';
import Header from '../../components/Header';
import Constants from 'expo-constants';
import moment from "moment";
import styles from './style';

export default function PostHome( { route, navigation } ){

    const database = firebase.firestore();
    const [expoPushToken, setExpoPushToken] = useState(null);
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const [post, setPost] = useState([]);

    const handleDeslogin = async () => {
        const userResponse = await AsyncAlert();
        
        if (userResponse === 'SIM') {
            firebase.auth().signOut().then(() => {
                navigation.navigate("Login")
              }).catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;
    
                console.log(errorCode + ' ' + errorMessage);
              });
        }
    }

    async function addUserDocument(userId){
        await database.collection("tokens").doc(userId).set({},{merge:true})
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }

    async function addUserDocumentToken(userId){
        await database.collection("tokens").doc(userId).update({
            tokens: firebase.firestore.FieldValue.arrayUnion(expoPushToken)
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
    }

    async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        console.log(finalStatus)
        if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
        return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        });
    }

    return token;
    }

    const AsyncAlert = () => {
        return new Promise((resolve, reject) => {
            Alert.alert(
                'Logout',
                'Deseja sair da conta?',
                [
                    {text: 'NÃO', onPress: () => resolve('NÃO') },
                    {text: 'SIM', onPress: () => resolve('SIM') },
                ],
                { cancelable: true }
                
            )
        })
    }

    //Like a post or answer
    async function likeItem(item){
        if (item.liked) {
            await database.collection("posts").doc(item.id).update({
                score: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
            })
            .then(() => {
                console.log("Document successfully removed!");
            })
            .catch((error) => {
                console.error("Error removing document: ", error);
            });
        }else {
            await database.collection("posts").doc(item.id).update({
                score: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        }
    }

    //Notifications
    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            }),
        });

        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            //console.log(response.notification.request.content.data); 
            const item = response.notification.request.content.data;
            
            navigation.navigate('PostDetails',
                    {
                        id: item.id,
                        title: item.title, 
                        description: item.description,
                        date: item.date,
                        creatorId: item.creatorId,
                        score: item.score,
                    });
        });

        return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);
    
    useEffect(() => {
        if (expoPushToken === null) return;
        
        addUserDocument(route.params.userId);
        addUserDocumentToken(route.params.userId);
    },[expoPushToken]) 

    //Getting posts
    useEffect(() =>{
        database.collection('posts').orderBy('createdWhen','desc').onSnapshot({ includeMetadataChanges: true },(query)=>{
            const list = [];

            query.forEach((doc)=> {
                list.push({...doc.data(), id: doc.id, liked: doc.data().score.includes(firebase.auth().currentUser.uid) ? true : false});
            });
            if (!query.metadata.hasPendingWrites){
                setPost(list);
            }
        });
    },[]);

    //BackButton exit app
    useFocusEffect(
        useCallback(() => {
          const onBackPress = () => {
            Alert.alert("", "Deseja fechar o app?", [
              {
                text: "Não",
                onPress: () => null,
                style: "cancel"
              },
              { text: "Sim", onPress: () => BackHandler.exitApp() }
            ]);
            return true;
          };
        
          BackHandler.addEventListener("hardwareBackPress", onBackPress);
        
          return () =>
            BackHandler.removeEventListener("hardwareBackPress", onBackPress); 
    }, []));

    return(
        <SafeAreaView style={styles.container}>

            <Header leftIcon={'filter'} rightIcon={'log-out'} title={'Publicações'} leftAction={null} rightAction={() => handleDeslogin()} />

            <FlatList 
            keyExtractor={(item) => { return item.id; }}
            showsVerticalScrollIndicator={false}
            data={post}
            renderItem={( {item} ) => {
                return(
                    <View>
                        <TouchableOpacity
                        style={styles.posts}
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('PostDetails',
                        {id: item.id,
                            title: item.title, 
                            description: item.description,
                            date: item.createdWhen,
                            creatorId: item.createdBy,
                            score: item.score,
                            liked: item.liked
                        })}
                        >
                            <View style={styles.postTitle}>
                                <Text style={styles.textPostTitle}>
                                    {item.title}
                                </Text>
                            </View>

                            <View style={styles.postResume}>
                                <Text numberOfLines={10} ellipsizeMode="tail" style={styles.textPostResume}>
                                    {item.description}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        
                        <View style={styles.postFooter}>
                            <TouchableOpacity onPress={() => likeItem(item,'postagem')} style={styles.postFooterScore}>
                                <FontAwesome name={item.liked === true ? "heart" : "heart-o"} size={25} color="#622565" />
                                <Text style={styles.textPostFooterScore}>
                                    {item.score.length}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.postFooterDate}>
                                <Text style={styles.textPostFooterDate}>
                                    {moment.unix(item.createdWhen.seconds).format("DD/MM/YYYY HH:mm")}
                                </Text>
                            </View>
                        </View>
                        
                    </View>
                )
            }}
            />

            <View style={styles.boxButtonNewPost}>
                <TouchableOpacity 
                activeOpacity={0.8}
                style={styles.buttonNewPost}
                onPress={() => navigation.navigate("NewPost")}>
                    <Text style={styles.iconButton}>+</Text>
                </TouchableOpacity>
                </View>
        </SafeAreaView>
    )
}