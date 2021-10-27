import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, BackHandler, Alert, SafeAreaView } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import * as Notifications from 'expo-notifications';
import firebase from '../../config/firebaseconfig';
import { FontAwesome } from '@expo/vector-icons';
import Header from '../../components/Header';
import Constants from 'expo-constants';
import Modal from "react-native-modal";
import moment from "moment";
import styles from './style';

export default function PostHome( { route, navigation } ){

    const database = firebase.firestore();
    const [expoPushToken, setExpoPushToken] = useState(null);
    const [notification, setNotification] = useState(false);
    const [post, setPost] = useState([]);
    const [orderBy, setOrderBy] = useState('createdWhen');
    const [typeOrderBy, setTypeOrderBy] = useState('desc');
    const [isModalOrderByVisible, setIsModalOrderByVisible] = useState(false);
    const responseListener = useRef();
    const notificationListener = useRef();
    const flatListRef = React.useRef()
    

    const handleDeslogin = async () => {
        const userResponse = await AsyncAlert();
        
        if (userResponse === 'SIM') {
            
            await firebase.auth().signOut().then(() => {
                navigation.goBack()
            }).catch((error) => {
                let errorCode = error.code;
                let errorMessage = error.message;

                console.log(errorCode + ' ' + errorMessage);
            });
        }
    }

    const changeOrderList = (order) => {
        switch(order){
            case 'createdWhen':
                setOrderBy('createdWhen');
                setTypeOrderBy('desc');
            break;

            case 'score':
                setOrderBy('score');
                setTypeOrderBy('desc');
            break;

            case 'title':
                setOrderBy('title_insensitive');
                setTypeOrderBy('asc');
            break;
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
            const item = response.notification.request.content.data;
            
            navigation.navigate('PostDetails',
                    {
                        id: item.id,
                        title: item.title, 
                        description: item.description,
                        date: item.date,
                        creatorId: item.creatorId,
                        score: item.score,
                        liked: item.liked,
                        closed: item.closed
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
        database.collection('posts').orderBy(orderBy,typeOrderBy).onSnapshot({ includeMetadataChanges: true },(query)=>{
            const list = [];

            query.forEach((doc)=> {
                firebase.auth().currentUser !== null ? list.push({...doc.data(), id: doc.id, liked: doc.data().score.includes(firebase.auth().currentUser.uid) ? true : false}) : null;
            });
            if (!query.metadata.hasPendingWrites){
                setPost(list);
                flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
            }
        });
    },[orderBy]);

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

            <Header leftIcon={'filter'} rightIcon={'log-out'} title={'Publicações'} leftAction={() => setIsModalOrderByVisible(true)} rightAction={() => handleDeslogin()} />

            <Modal 
            coverScreen={false}
            backdropOpacity={0}
            style={{marginLeft:0}}
            isVisible={isModalOrderByVisible} 
            animationIn="fadeInLeft"
            animationOut="fadeOutLeft"
            onBackdropPress={() => setIsModalOrderByVisible(false)}
            onBackButtonPress={() => setIsModalOrderByVisible(false)}
            >
                <SafeAreaView style={{flex: 1, alignItems: 'flex-start'}}>
                    <View style={styles.modalMenuView}>
                        <TouchableOpacity onPressIn={() =>setIsModalOrderByVisible(false)} onPress={() => changeOrderList('createdWhen')}>
                            <Text style={styles.textOptionButton}>Recente</Text>
                        </TouchableOpacity>
                    
                        <TouchableOpacity onPressIn={() =>setIsModalOrderByVisible(false)} onPress={() => changeOrderList('score')}>
                            <Text style={styles.textOptionButton}>Like</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity onPressIn={() =>setIsModalOrderByVisible(false)} onPress={() => changeOrderList('title')}>
                            <Text style={styles.textOptionButton}>Título</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Modal> 

            <FlatList 
            keyExtractor={(item) => { return item.id; }}
            showsVerticalScrollIndicator={false}
            ref={flatListRef}
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
                            liked: item.liked,
                            closed: item.closed
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
                            <View style={styles.postFooterScore}>
                                <TouchableOpacity onPress={() => likeItem(item,'postagem')} style={styles.postFooterButton}>
                                    <FontAwesome name={item.liked === true ? "heart" : "heart-o"} size={25} color="#622565" />
                                    <Text style={styles.textPostFooterScore}>
                                        {item.score.length}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            
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
                onPress={() => navigation.navigate("NewPost",{operation:"add"})}
                >
                    <Text style={styles.iconButton}>+</Text>
                </TouchableOpacity>
                </View>
        </SafeAreaView>
    )
}