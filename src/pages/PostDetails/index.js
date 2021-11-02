import  React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, SafeAreaView, ScrollView, TouchableOpacity, Alert, Animated, ActivityIndicator } from 'react-native';
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome, Ionicons, AntDesign } from '@expo/vector-icons';
import firebase from '../../config/firebaseconfig';
import filterText from '../../lib/filterText';
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
    const [likeCount, setLikeCount] = useState(route.params.score.length);
    const isFocused = useIsFocused();
    const [currentUser, setCurrentUser] = useState(firebase.auth().currentUser.uid);
    const [isLoading, setIsLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const scrollListRef = useRef();
    const [isButtonToEndVisible,setIsButtonToEndVisible] = useState(true);
    const [isButtonToBeginVisible,setIsButtonToBeginVisible] = useState(false);

    //Opening modal report
    const openModalReport = async (item,itemType) => {
        if (item.createdBy === currentUser) return;
        
        setItemType(itemType);
        setItem(item);

        if (itemType === 'resposta') {
            await database.collection("posts").doc(route.params.id).collection('answers').doc(item.id).collection('reports').doc(currentUser).get()
            .then(function(querySnapshot) {
                if (querySnapshot.data() !== undefined) {
                    setAlreadyReported(true)
                } else {
                    setAlreadyReported(false)
                }
            });
        } else {
            setIsModalMenuVisible(false)
            await database.collection("posts").doc(item.id).collection('reports').doc(currentUser).get()
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

    async function checkForBadWord(text){
        if(!filterText.haveBadWord(text) && !await filterText.havePersonName(text))
            return false;
        else    
            return true;
    }

    async function addAnswer(){
        let isClosed = false;

        await database.collection('posts').doc(route.params.id).get().then((querySnapshot) => {
            querySnapshot
                isClosed = querySnapshot.data().closed;
        });

        if(!isClosed) {
            if (answerText.trim() !== ''){
                if (!await checkForBadWord(answerText.trim())) {
                    await database.collection("posts").doc(route.params.id).collection('answers').add({
                        createdWhen: firebase.firestore.FieldValue.serverTimestamp(),
                        createdBy: currentUser,
                        description: answerText,
                        score: []
                    }).then(() => {
                        setAnswerText('');
                        setAnswerError(null);
                        animateSendButton();
                        scrollListRef.current.scrollTo({x:0, y:0,animated:true});
                    }).catch((error) => {
                        console.error("Error add document: ", error);
                    });
                } else {
                    Alert.alert('Não foi possível publicar a resposta','Não é possível criar respostas com palavras que firam o anonimato ou que sejam de baixo calão')
                }
            } else {
            setAnswerError('Por favor, digite a sua resposta')
            } 
        } else {
            Alert.alert('Não foi possível publicar a resposta','A postagem foi trancada');
        }    
    }

    //Report a post or answer
    async function reportItem(){
        if (itemType === 'postagem') {
            await database.collection("posts").doc(route.params.id).collection('reports').doc(currentUser).set({
                reportedWhen: firebase.firestore.FieldValue.serverTimestamp(),
            }).then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        } else {
            await database.collection("posts").doc(route.params.id).collection('answers').doc(item.id).collection('reports').doc(currentUser).set({
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
                    score: firebase.firestore.FieldValue.arrayRemove(currentUser)
                })
                .then(() => {
                    let indexArray = postScore.indexOf(currentUser);
                    if (indexArray > -1) {
                        postScore.splice(indexArray, 1);
                    }
                    setPostLiked(false);
                    setLikeCount(likeCount - 1)
                    console.log("Document successfully removed!");
                })
                .catch((error) => {
                    console.error("Error removing document: ", error);
                });
            }else {
                await database.collection("posts").doc(route.params.id).update({
                    score: firebase.firestore.FieldValue.arrayUnion(currentUser)
                })
                .then(() => {
                    postScore.push(currentUser);
                    setPostLiked(true);
                    setLikeCount(likeCount + 1)
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });
            }
        } else {
            if (item.liked) {
                await database.collection("posts").doc(route.params.id).collection('answers').doc(item.id).update({
                    score: firebase.firestore.FieldValue.arrayRemove(currentUser)
                })
                .then(() => {
                    console.log("Document successfully removed!");
                })
                .catch((error) => {
                    console.error("Error removing document: ", error);
                });
            }else {
                await database.collection("posts").doc(route.params.id).collection('answers').doc(item.id).update({
                    score: firebase.firestore.FieldValue.arrayUnion(currentUser)
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

    //Check if scroll is close to bottom
    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom;
    }

    //Check if scroll is close to top
    const isCloseToTop = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToTop = 20;
        return contentOffset.y <=
        paddingToTop;
    }

    //Loading answers
    useEffect(() =>{
        setIsLoading(true);
        setLoaded(false);

        database.collection('posts').doc(route.params.id).collection('answers').orderBy('createdWhen','asc').onSnapshot({ includeMetadataChanges: true },(query)=>{
            const list = [];
        
            query.forEach((doc)=> {
                list.push({...doc.data(), id: doc.id, liked: doc.data().score.includes(currentUser) ? true : false});
            });
            if (!query.metadata.hasPendingWrites){
                setAnswer(list);
                setIsLoading(false);
                setLoaded(true);
            }
        });
    },[]);

    //Updating score in real time
    useEffect(() => { 
        database.collection('posts').doc(route.params.id).get().then((querySnapshot) => {
            querySnapshot
                setLikeCount(querySnapshot.data().score_count);
        });
    }, [ isFocused]);

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
                            route.params.creatorId === currentUser
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
                            route.params.creatorId === currentUser
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
                                        closed: route.params.closed,
                                        score_count: route.params.score_count,
                                        answer_count: route.params.answer_count
                                    })}>
                                    <Text style={styles.textOptionButton}>Editar</Text>
                                </TouchableOpacity>
                            : 
                            null
                        }

                        { //Report the post
                            route.params.creatorId !== currentUser
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

            
            <ScrollView 
                onScroll={(event) => { 
                    if (!isCloseToBottom(event.nativeEvent)) {
                        setIsButtonToEndVisible(true);
                    } else {
                        setIsButtonToEndVisible(false);
                    }

                    if (!isCloseToTop(event.nativeEvent)) {
                        setIsButtonToBeginVisible(true);
                    } else {
                        setIsButtonToBeginVisible(false);
                    }
                }} 
                ref={scrollListRef} style={styles.boxPostContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.textPostContent}>{route.params.description}</Text>

                <TouchableOpacity activeOpacity={0.6} onPress={() => likeItem(route.params,'postagem')} style={styles.buttonPostLike}>
                    <FontAwesome name={postLiked === true ? "heart" : "heart-o"} size={25} color="#622565" style={{alignSelf:'flex-start'}} />
                    <Text>{likeCount}</Text>
                 </TouchableOpacity>

                { 
                    isLoading
                    ?
                        <Text style={styles.textBorderContent}></Text>
                    :
                        loaded
                        ?
                            answer.length === 0
                            ? 
                                <Text style={styles.textBorderContent}>Nenhuma resposta ainda. Deixe a sua ;)</Text>
                            :
                                <Text style={styles.textBorderContent}>Respostas</Text> 
                        :
                            <Text style={styles.textBorderContent}></Text>
                }
                
                { 
                    answer.map((item, index) => (
                        <View key={index}>
                            <View style={[styles.boxListAllAnswers, {justifyContent:item.createdBy === currentUser ? 'flex-end' : 'flex-start'}]}>
                                {
                                    item.createdBy === currentUser
                                    ?
                                        null
                                    :
                                    <TouchableOpacity style={styles.boxListAnswer} onPress={()=> openModalReport(item,'resposta')}>
                                        <Text style={styles.textListAnswer}>{item.description}</Text>
                                    </TouchableOpacity>
                                }
                                
                                <View style={styles.boxListAnswerLike}>
                                    <TouchableOpacity activeOpacity={0.6} onPress={() => likeItem(item,'resposta')}>
                                        <FontAwesome name={item.liked === true ? "heart" : "heart-o"} size={25} color="#622565" />
                                        <Text style={styles.textListAnswerScore}>
                                            {item.score.length}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            
                                {
                                    item.createdBy === currentUser
                                    ?
                                    <TouchableOpacity style={styles.boxListAnswer} onPress={()=>openModalReport(item,'resposta')}>
                                        <Text style={styles.textListAnswer}>{item.description}</Text>
                                    </TouchableOpacity>
                                    :
                                        null
                                }
                            
                            </View>
                            <View style={styles.boxListAnswerDate}>
                                <Text style={[styles.textListAnswerDate, {textAlign: item.createdBy === firebase.auth().currentUser.uid ? 'right' : 'left'}]}>
                                    {moment.unix(item.createdWhen.seconds).format("DD/MM/YYYY HH:mm")}
                                </Text>
                            </View>
                        </View>
                    ))
                }
            </ScrollView>
            
            <View style={{flexDirection:'row', maxHeight:35}}>
            {
                isButtonToBeginVisible
                ?
                    <View style={{flex:0.5, marginLeft: 18, paddingBottom:10, alignItems:'flex-start'}}>
                        <FontAwesome style={{paddingHorizontal:6,backgroundColor:'#e4aae9',width:30, height:30, borderRadius:10}} onPress={() => scrollListRef.current.scrollTo({x:0, y:0,animated:true})} name="angle-double-up" size={28} color="#622565" /> 
                    </View>
                :
                    <View style={{flex:0.5, marginLeft: 18, paddingBottom:10, alignItems:'flex-start'}}/>
            }

            {
                isButtonToEndVisible
                ?
                    <View style={{flex:0.5, marginRight: 18, paddingBottom:10, alignItems:'flex-end'}}>
                        <FontAwesome style={{paddingHorizontal:6,backgroundColor:'#e4aae9',width:30, height:30, borderRadius:10}} onPress={() => scrollListRef.current.scrollToEnd({animated:true})} name="angle-double-down" size={28} color="#622565" /> 
                    </View>
                :
                    <View style={{flex:0.5, marginRight: 18, paddingBottom:10, alignItems:'flex-end'}}/>
            }

            
            </View>

            {
                isLoading 
                ?
                    <ActivityIndicator animating={isLoading} color="#622565" />
                :
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
                    <View removeClippedSubviews={true} style={styles.boxAnswer}>
                        <TextInput 
                            contextMenuHidden={true}
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