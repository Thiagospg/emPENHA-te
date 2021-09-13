import React, { useState, useEffect, useRef} from 'react';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import firebase from '../../config/firebaseconfig';
import moment from "moment";
import { FontAwesome } from '@expo/vector-icons';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from './style';

export default function PostHome( { route, navigation } ){

    const database = firebase.firestore()
    const [expoPushToken, setExpoPushToken] = useState(null);
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const [post, setPost] = useState([]);

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
        alert(response);
        });

        return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);
    
    useEffect(() => {
        if (expoPushToken === null) return;
        
        //addUserDocument(route.params.userId);
        //addUserDocumentToken(route.params.userId);
    },[expoPushToken]) 

    useEffect(() =>{
        database.collection('posts').onSnapshot((query)=>{
            const list = [];

            query.forEach((doc)=> {
                list.push({...doc.data(), id: doc.id});
            });
            setPost(list);
            console.log(list)
        });
    },[]);

//<Text>{route.params.userId}</Text>
    return(
        <View style={styles.container}>
            <FlatList 
            showsVerticalScrollIndicator={false}
            data={post}
            renderItem={( {item} ) => {
                return(
                    
                    <TouchableOpacity
                    style={styles.posts}
                    onPress={() => navigation.navigate('PostDetails',
                    {id: item.id,
                        title: item.title, 
                        description: item.description,
                        date: item.createdWhen,
                        creatorId: item.createdBy,
                        score: item.score,
                    })}
                    >
                        <View style={styles.postTitle}>
                            <Text style={styles.textPostTitle}>
                                {item.title}
                            </Text>
                        </View>

                        <View style={styles.postResume}>
                            <Text numberOfLines={2} ellipsizeMode="tail" style={styles.textPostResume}>
                                {item.description}
                            </Text>
                        </View>

                        <View style={styles.postFooter}>
                            <View style={styles.postFooterScore}>
                                <FontAwesome name="heart" size={18} color="red" />
                                <Text style={styles.textPostFooterScore}>
                                    {item.score.length}
                                </Text>
                            </View>

                            <View style={styles.postFooterDate}>
                                <Text style={styles.textPostFooterDate}>
                                    {moment.unix(item.createdWhen.seconds).format("DD/MM/YYYY")}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
         
                )
            }}
            />

            <TouchableOpacity 
            style={styles.buttonNewPost}
            onPress={() => navigation.navigate("NewPost")}>
                <Text style={styles.iconButton}>+</Text>
            </TouchableOpacity>
        </View>
    )
}