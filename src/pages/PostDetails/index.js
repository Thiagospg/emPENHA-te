import  React, { useState, useEffect } from 'react';
import { View, Text, TextInput, SafeAreaView, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import styles from './style';
import firebase from '../../config/firebaseconfig';
import moment from "moment";
import { FontAwesome } from '@expo/vector-icons';
import Modal from "react-native-modal";

export default function PostDetails({route, navigation}){
    const database = firebase.firestore();
    const [answer, setAnswer] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    useEffect(() =>{
        database.collection('posts').doc(route.params.id).collection('answers').orderBy('createdWhen','desc').onSnapshot((query)=>{
            const list = [];

            query.forEach((doc)=> {
                list.push({...doc.data(), id: doc.id});
            });
            if (!query.metadata.hasPendingWrites){
                setAnswer(list);
            }
        });
    },[]);

    return(
        <SafeAreaView style={styles.container}>

            <Modal 
            style={styles.modalContainer}
            isVisible={isModalVisible} 
            onBackdropPress={() => setModalVisible(false)}
            >
                <View style={{ backgroundColor: '#e4aae9' }}>
                <Text>Hello!</Text>

                <TouchableOpacity onPress={toggleModal}><Text>Hide modal</Text></TouchableOpacity> 
                </View>
            </Modal>


            <View style={styles.boxPostTitle}> 
                <Text style={styles.textPostTitle}>{route.params.title}</Text>
            </View>

            <ScrollView style={styles.boxPostContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.textPostContent}>{route.params.description}</Text>
                { answer.length === 0 
                    ? 
                    <Text style={styles.textBorderContent}>Nenhuma resposta ainda. Deixe a sua ;)</Text>
                    :
                    <Text style={styles.textBorderContent}>Respostas</Text>
                }
                
                
                {answer.map((item, index) => (
                    <View key={index}>
                        <View style={styles.boxListAllAnswers}>
                            <TouchableOpacity style={styles.boxListAnswer} onLongPress={toggleModal}>
                                <Text style={styles.textListAnswer}>{item.description}</Text>
                            </TouchableOpacity>
                            
                            <View style={styles.boxListAnswerLike}>
                                <FontAwesome name="heart-o" size={20} color="#e4aae9" />
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
                ))}
            </ScrollView>

            <Text style={styles.textInformation}>Deixe uma resposta</Text>
            <View style={styles.footerAnswer}>
            
                <View style={styles.boxAnswer}>
                    <TextInput style={styles.textAnswer}/>
                </View>
                <View style={styles.boxSendAnswer}>
                    <Text>Enviar</Text>
                </View>

            </View>
        </SafeAreaView>
    )
}