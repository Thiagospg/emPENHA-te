import  React, { useState, useEffect } from 'react';
import { View, Text, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import styles from './style';
import firebase from '../../config/firebaseconfig';
import moment from "moment";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Modal from "react-native-modal";

export default function PostDetails({route, navigation}){
    const database = firebase.firestore();
    const [answerText, setAnswerText] = useState('');
    const [answer, setAnswer] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [answerItem, setAnswerItem] = useState({});
    const [itemType, setItemType] = useState('');
    const [alreadyReported, setAlreadyReported] = useState(false);
    const [marginAnimated] = useState(new Animated.Value(0))
    const [answerError, setAnswerError] = useState(null)

    //Opening modal
    const openModal = async (item,itemType) => {
        setItemType(itemType);
        setAnswerItem(item);

        await database.collection("posts").doc(route.params.id).collection('answers').doc(item.id).collection('reports').doc(firebase.auth().currentUser.uid).get()
            .then(function(querySnapshot) {
                if (querySnapshot.data() !== undefined) {
                    setAlreadyReported(true)
                } else {
                    setAlreadyReported(false) 
                }
        });
        
        setModalVisible(!isModalVisible);     
    };

    function animateSendButton(){
        Animated.sequence([
            Animated.timing(
                marginAnimated,
                {
                    toValue: 20,
                    duration: 200,
                    useNativeDriver: true
                },
            ),
    
            Animated.timing(
                marginAnimated,
                {
                    toValue: -10,
                    duration:200,
                    useNativeDriver: true
                },
            ),

            Animated.timing(
                marginAnimated,
                {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true
                },
            )
           ]).start(); 
    }


    async function addAnswer(){
        if (answerText.trim() !== ''){
            await database.collection("posts").doc(route.params.id).collection('answers').add({
                createdWhen: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: firebase.auth().currentUser.uid,
                description: answerText,
                score: []
            }).then(() => {
                setAnswerText('');
                setAnswerError(null);
            }).catch((error) => {
                console.error("Error add document: ", error);
            });
        } else {
           setAnswerError('Por favor, digite a sua resposta')
        }      
    }

    //Report a post or answer
    async function reportItem(){
        if (itemType === 'postagem') {
            await database.collection("posts").doc(route.params.id).collection('reports').doc(firebase.auth().currentUser.uid).set({
                reportedWhen: firebase.firestore.FieldValue.serverTimestamp(),
            }).then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        } else {
            await database.collection("posts").doc(route.params.id).collection('answers').doc(answerItem.id).collection('reports').doc(firebase.auth().currentUser.uid).set({
                reportedWhen: firebase.firestore.FieldValue.serverTimestamp(),
            }).then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        }    
        setModalVisible(false);
    }

    //Like a post or answer
    async function likeItem(item, itemType){
        if (itemType === 'postagem') {
            
        } else {
            if (item.liked) {
                await database.collection("posts").doc(route.params.id).collection('answers').doc(item.id).update({
                    score: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
                })
                .then(() => {
                    console.log("Document successfully removed!");
                })
                .catch((error) => {
                    console.error("Error removing document: ", error);
                });
            }else {
                await database.collection("posts").doc(route.params.id).collection('answers').doc(item.id).update({
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
    }

    //Loading answers
    useEffect(() =>{
        database.collection('posts').doc(route.params.id).collection('answers').orderBy('createdWhen','desc').onSnapshot({ includeMetadataChanges: true },(query)=>{
            const list = [];
            
            query.forEach((doc)=> {
                list.push({...doc.data(), id: doc.id, liked: doc.data().score.includes(firebase.auth().currentUser.uid) ? true : false});
            });
            if (!query.metadata.hasPendingWrites){
                setAnswer(list);
            }
        });
    },[]);

    return(
        <SafeAreaView style={styles.container}>
           
            <Modal 
            coverScreen={false}
            style={styles.modalContainer}
            isVisible={isModalVisible} 
            animationIn="wobble"
            animationOut="zoomOut"
            onBackdropPress={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                   <View>
                        <TouchableOpacity style={{position:'absolute', alignSelf:'flex-end'}} onPress={() => setModalVisible(false)}>
                            <FontAwesome name="window-close" size={28} color="#622565" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.modalTextTitle}>Deseja denunciar a {itemType} abaixo?</Text>
                    <ScrollView>
                        <Text style={styles.modalText}>{itemType === 'postagem' ? route.params.title : answerItem.description}</Text>
                    </ScrollView>
                    <TouchableOpacity style={styles.modalReportButton} disabled={alreadyReported} onPress={reportItem}>
                        <Text style={styles.modalReportButtonText}>{alreadyReported ? 'Já denunciada' : 'Denunciar'}</Text>
                    </TouchableOpacity> 
                </View>
            </Modal>
           

            <View style={styles.boxPostTitle}> 
                <Text style={styles.textPostTitle}>{route.params.title}</Text>
            </View>

            <ScrollView style={styles.boxPostContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.textPostContent}>{route.params.description}</Text>
                { 
                    answer.length === 0 
                    ? 
                    <Text style={styles.textBorderContent}>Nenhuma resposta ainda. Deixe a sua ;)</Text>
                    :
                    <Text style={styles.textBorderContent}>Respostas</Text> 
                }
                
                
                { 
                    answer.map((item, index) => (
                        <View key={index}>
                            <View style={styles.boxListAllAnswers}>
                                <TouchableOpacity style={styles.boxListAnswer} onLongPress={()=>openModal(item,'resposta')}>
                                    <Text style={styles.textListAnswer}>{item.description}</Text>
                                </TouchableOpacity>

                                <View style={styles.boxListAnswerLike}>
                                    <TouchableOpacity activeOpacity={0.6} onPress={() => likeItem(item,'resposta')}>
                                        <FontAwesome name={item.liked === true ? "heart" : "heart-o"} size={22} color="#622565" />
                                    </TouchableOpacity>
                                    
                                    <Text style={styles.textListAnswerScore}>
                                        {item.score.length}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.boxListAnswerDate}>
                                <Text style={styles.textListAnswerDate}>
                                    {moment.unix(item.createdWhen.seconds).format("DD/MM/YYYY HH:mm")}
                                </Text>
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
            
            <Text style={styles.textInformation}>Deixe uma resposta</Text>
    
            <View style={styles.footerAnswer}>
            
                <View style={styles.boxAnswer}>
                    <TextInput 
                        style={styles.textAnswer}
                        placeholder='Informe a resposta'
                        onChangeText={setAnswerText}
                        value={answerText}
                        multiline={true}
                        maxLength={350}
                        returnKeyType='send'
                        blurOnSubmit = {true}
                        onSubmitEditing={() => addAnswer()}
                    />
                </View>
                
                <TouchableOpacity 
                    style={styles.boxSendAnswer} 
                    activeOpacity={0.8}
                    onPress={() => addAnswer()} 
                    onPressOut={() => animateSendButton()}
                >   
                   <Animated.View style={{transform:[{translateX:marginAnimated}]}}>
                        <Ionicons name="send" size={18} color="#f5cec6" />
                    </Animated.View>
                </TouchableOpacity>

                
            </View>
            {answerError !== null ?
                <Text style={styles.textAnswerError}>{answerError}</Text>
            : null}
        </SafeAreaView>
    )
}