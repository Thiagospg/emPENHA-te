import React, { useState, useEffect, useRef} from 'react';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import firebase from '../../config/firebaseconfig';
import { View, Text } from 'react-native';

export default function PostHome( { route, navigation } ){

    const database = firebase.firestore()
    const [expoPushToken, setExpoPushToken] = useState(null);
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

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
        alert('Must use physical device for Push Notifications');
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
        
        addUserDocument(route.params.userId);
        addUserDocumentToken(route.params.userId);
    },[expoPushToken]) 

    return(
        <View>
            <Text>PostHome</Text>
            <Text>{route.params.userId}</Text>
        </View>
    )
}