import  React, { useState, useEffect } from 'react';
import { View, Text, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { FontAwesome, Ionicons, Feather } from '@expo/vector-icons';
import firebase from '../../config/firebaseconfig';
import Header from '../../components/Header';
import Modal from "react-native-modal";
import moment from "moment";
import styles from './style';

export default function PostDetails({route, navigation}){
    const database = firebase.firestore();
    const [answerText, setAnswerText] = useState('');
    const [answer, setAnswer] = useState([]);
    const [isModalReportVisible, setIsModalReportVisible] = useState(false);
    const [isModalMenuVisible, setIsModalMenuVisible] = useState(false);
    const [item, setItem] = useState({});
    const [itemType, setItemType] = useState('');
    const [alreadyReported, setAlreadyReported] = useState(false);
    const [marginAnimated] = useState(new Animated.Value(0));
    const [answerError, setAnswerError] = useState(null);
    const [postLiked, setPostLiked] = useState(route.params.liked);
    const [postScore] = useState(route.params.score);
    const [postClosed, setPostClosed] = useState(route.params.closed);

    //Opening modal report
    const openModalReport = async (item,itemType) => {
        setItemType(itemType);
        setItem(item);

        if (itemType === 'resposta') {
            await database.collection("posts").doc(route.params.id).collection('answers').doc(item.id).collection('reports').doc(firebase.auth().currentUser.uid).get()
            .then(function(querySnapshot) {
                if (querySnapshot.data() !== undefined) {
                    setAlreadyReported(true)
                } else {
                    setAlreadyReported(false)
                }
            });
        } else {
            setIsModalMenuVisible(false)
            await database.collection("posts").doc(item.id).collection('reports').doc(firebase.auth().currentUser.uid).get()
            .then(function(querySnapshot) {
                if (querySnapshot.data() !== undefined) {
                    setAlreadyReported(true)
                } else {
                    setAlreadyReported(false) 
                }
            });
        }

        setIsModalReportVisible(!isModalReportVisible);     
    };

    //Opening modal menu
    const openModalMenu = () => {
        setIsModalMenuVisible(!isModalMenuVisible);     
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
                animateSendButton();
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
            await database.collection("posts").doc(route.params.id).collection('answers').doc(item.id).collection('reports').doc(firebase.auth().currentUser.uid).set({
                reportedWhen: firebase.firestore.FieldValue.serverTimestamp(),
            }).then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        }    
        setIsModalReportVisible(false);
    }

    //Like a post or answer
    async function likeItem(item, itemType){
        if (itemType === 'postagem') {
            if (postLiked) {
                await database.collection("posts").doc(route.params.id).update({
                    score: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
                })
                .then(() => {
                    let indexArray = postScore.indexOf(firebase.auth().currentUser.uid);
                    if (indexArray > -1) {
                        postScore.splice(indexArray, 1);
                    }
                    setPostLiked(false);
                    console.log("Document successfully removed!");
                })
                .catch((error) => {
                    console.error("Error removing document: ", error);
                });
            }else {
                await database.collection("posts").doc(route.params.id).update({
                    score: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
                })
                .then(() => {
                    postScore.push(firebase.auth().currentUser.uid);
                    setPostLiked(true);
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            }
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

    const AsyncAlert = (title, description) => {
        return new Promise((resolve, reject) => {
            Alert.alert(
                title,
                description,
                [
                    {text: 'NÃO', onPress: () => resolve('NÃO') },
                    {text: 'SIM', onPress: () => resolve('SIM') },
                ],
                { cancelable: true }
                
            )
        })
    }

    // Close a post
    async function closePost(){
        setIsModalMenuVisible(false);
        const userResponse = await AsyncAlert('Trancar postagem', 'Deseja trancar a postagem?');
        
        if (userResponse === 'SIM') {
            await database.collection("posts").doc(route.params.id).update({
                closed: true,
            }).then(() => {
                setPostClosed(true);
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        }  
    }

    // Open a post
    async function openPost(){
        setIsModalMenuVisible(false);
        const userResponse = await AsyncAlert('Destrancar postagem', 'Deseja destrancar a postagem?');
        
        if (userResponse === 'SIM') {
            await database.collection("posts").doc(route.params.id).update({
                closed: false,
            }).then(() => {
                setPostClosed(false);
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        }  
    }

    // Delete a post
    async function deletePost(){
        setIsModalMenuVisible(false);
        const userResponse = await AsyncAlert('Deletar postagem', 'Deseja deletar a postagem?');
        
        if (userResponse === 'SIM') {
            await database.collection("posts").doc(route.params.id).delete().then(() => {
                setPostClosed(false);
                navigation.goBack();
                console.log("Document successfully deleted!");
            })
            .catch((error) => {
                console.error("Error deleting document: ", error);
            });
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
           
           <Header leftIcon={'arrow-left'} rightIcon={'more-vertical'} title={'Publicação'} leftAction={() => navigation.goBack()} rightAction={()=>openModalMenu()} />

            <Modal 
            coverScreen={false}
            style={styles.modalContainer}
            isVisible={isModalReportVisible} 
            animationIn="wobble"
            animationOut="zoomOut"
            onBackdropPress={() => setIsModalReportVisible(false)}
            onBackButtonPress={() => setIsModalReportVisible(false)}
            >
                <View style={styles.modalView}>
                   <View>
                        <TouchableOpacity style={{position:'absolute', alignSelf:'flex-end'}} onPress={() => setIsModalReportVisible(false)}>
                            <FontAwesome name="window-close" size={28} color="#622565" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.modalTextTitle}>Deseja denunciar a {itemType} abaixo?</Text>
                    <ScrollView>
                        <Text style={styles.modalText}>{itemType === 'postagem' ? route.params.title : item.description}</Text>
                    </ScrollView>
                    <TouchableOpacity style={styles.modalReportButton} disabled={alreadyReported} onPress={reportItem}>
                        <Text style={styles.modalReportButtonText}>{alreadyReported ? 'Já denunciada' : 'Denunciar'}</Text>
                    </TouchableOpacity> 
                </View>
            </Modal>

            <Modal 
            coverScreen={false}
            backdropOpacity={0}
            style={{marginRight:0}}
            isVisible={isModalMenuVisible} 
            animationIn="fadeInRight"
            animationOut="fadeOutRight"
            onBackdropPress={() => setIsModalMenuVisible(false)}
            onBackButtonPress={() => setIsModalMenuVisible(false)}
            >
                <SafeAreaView style={{flex: 1, alignItems: 'flex-end'}}>
                    <View style={styles.modalMenuView}>
                        { //Delete or close the post
                            route.params.creatorId === firebase.auth().currentUser.uid
                            ?
                                answer.length === 0 
                                ?
                                <TouchableOpacity onPress={() => deletePost()}>
                                    <Text style={styles.textOptionButton}>Excluir</Text>
                                </TouchableOpacity>
                                :
                                    postClosed
                                    ?
                                    <TouchableOpacity onPress={() => openPost()}>
                                        <Text style={styles.textOptionButton}>Destrancar</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => closePost()}>
                                        <Text style={styles.textOptionButton}>Trancar</Text>
                                    </TouchableOpacity>
                            : 
                            null
                        }

                        { //Edit the post
                            route.params.creatorId === firebase.auth().currentUser.uid
                            ?
                                <TouchableOpacity onPressIn={() =>setIsModalMenuVisible(false)} onPress={() => navigation.navigate("NewPost",{
                                        operation:"upd", 
                                        id: route.params.id,
                                        title: route.params.title, 
                                        description: route.params.description,
                                        date: route.params.date,
                                        creatorId: route.params.creatorId,
                                        score: route.params.score,
                                        liked: route.params.liked,
                                        closed: route.params.closed
                                    })}>
                                    <Text style={styles.textOptionButton}>Editar</Text>
                                </TouchableOpacity>
                            : 
                            null
                        }

                        { //Report the post
                            route.params.creatorId !== firebase.auth().currentUser.uid
                            ?
                                <TouchableOpacity style={{flex:1, justifyContent:'center'}} onPress={()=>openModalReport(route.params,'postagem')}>
                                    <Text style={styles.textOptionButton}>Denunciar</Text>
                                </TouchableOpacity>
                            : 
                            null
                        }
                    </View>
                </SafeAreaView>
            </Modal>

            <View style={styles.boxPostTitle}> 
                <Text style={styles.textPostTitle}>{route.params.title}</Text>
            </View>

            <ScrollView style={styles.boxPostContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.textPostContent}>{route.params.description}</Text>

                <TouchableOpacity activeOpacity={0.6} onPress={() => likeItem(route.params,'postagem')} style={styles.buttonPostLike}>
                    <FontAwesome name={postLiked === true ? "heart" : "heart-o"} size={25} color="#622565" style={{alignSelf:'flex-start'}} />
                    <Text>{postScore.length}</Text>
                 </TouchableOpacity>
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
                                <TouchableOpacity style={styles.boxListAnswer} onPress={()=>openModalReport(item,'resposta')}>
                                    <Text style={styles.textListAnswer}>{item.description}</Text>
                                </TouchableOpacity>

                                <View style={styles.boxListAnswerLike}>
                                    <TouchableOpacity activeOpacity={0.6} onPress={() => likeItem(item,'resposta')}>
                                        <FontAwesome name={item.liked === true ? "heart" : "heart-o"} size={25} color="#622565" />
                                        <Text style={styles.textListAnswerScore}>
                                            {item.score.length}
                                        </Text>
                                    </TouchableOpacity>
                                    
                                    
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
            
            {
                postClosed 
                ?
                <Text style={styles.textClosedPost}>Postagem trancada</Text>
                :
                <Text style={styles.textInformation}>Deixe uma resposta</Text>
            }

            {
                postClosed 
                ?
                null
                :
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
                    >   
                    <Animated.View style={{transform:[{translateX:marginAnimated}]}}>
                            <Ionicons name="send" size={18} color="#f5cec6" />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            }
            
            {answerError !== null ?
                <Text style={styles.textAnswerError}>{answerError}</Text>
            : null}
        </SafeAreaView>
    )
}