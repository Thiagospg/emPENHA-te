import React, { useState } from 'react';
import firebase from '../../config/firebaseconfig';
import { View, Text, TouchableOpacity, TextInput, SafeAreaView, Alert } from 'react-native';
import styles from './style';
import filterText from '../../lib/filterText';

export default function NewPost({route, navigation}){
    const database = firebase.firestore();
    const [postDescription, setPostDescription] = useState(route.params.description ? route.params.description : '');
    const [postTitle, setPostTitle] = useState(route.params.title ? route.params.title : '');

    async function addPost(){
        if (postDescription.trim() && postTitle.trim() !== ''){
            if (!filterText.havePersonName(postDescription.trim()) && !filterText.havePersonName(postTitle.trim()) && !filterText.haveBadWord(postDescription.trim()) && !filterText.haveBadWord(postTitle.trim())) {
                await database.collection("posts").add({
                    createdWhen: firebase.firestore.FieldValue.serverTimestamp(),
                    createdBy: firebase.auth().currentUser.uid,
                    description: postDescription,
                    score: [],
                    title: postTitle,
                    title_insensitive: postTitle.toLowerCase(),
                    closed: false,
                    score_count: 0,
                    answer_count: 0
                }).then(() => {
                    navigation.navigate('PostHome');
                    
                }).catch((error) => {
                    console.error("Error add document: ", error);
                });
            } else {
                Alert.alert('Não foi possível criar a postagem','Não é possível criar postagens com palavras que firam o anonimato ou que sejam de baixo calão')
            }
        } else {
            Alert.alert('Não foi possível criar a postagem','Por favor, preencha tanto o título quanto o conteúdo da postagem')
        }
            
    }

    async function updPost(){
        if (postDescription.trim() && postTitle.trim() !== ''){
            if (!filterText.havePersonName(postDescription.trim()) && !filterText.havePersonName(postTitle.trim()) && !filterText.haveBadWord(postDescription.trim()) && !filterText.haveBadWord(postTitle.trim())) {
                await database.collection("posts").doc(route.params.id).update({
                    description: postDescription,
                    title: postTitle,
                    title_insensitive: postTitle.toLowerCase(),
                }).then(() => {
                    navigation.navigate('PostDetails', 
                    {
                        id: route.params.id,
                        title: postTitle, 
                        description: postDescription,
                        date: route.params.date,
                        creatorId: route.params.creatorId,
                        score: route.params.score,
                        liked: route.params.liked,
                        closed: route.params.closed,
                        score_count: route.params.score_count,
                        answer_count: route.params.answer_count
                    });
                    
                }).catch((error) => {
                    console.error("Error add document: ", error);
                });
            } else {
                Alert.alert('Não foi possível criar a postagem','Não é possível criar postagens com palavras que firam o anonimato ou que sejam de baixo calão')
            }
        } else {
            Alert.alert('Não foi possível editar a postagem','Por favor, preencha tanto o título quanto o conteúdo da postagem')
        }
            
    }

    return(
        <SafeAreaView style={styles.container}>
            <View  style={styles.boxInput}> 
                <View removeClippedSubviews={true} style={styles.boxInputTextTitle}>
                    <TextInput
                    contextMenuHidden={true}
                    style={styles.inputTextTitle}
                    placeholder='Informe o título da postagem'
                    onChangeText={setPostTitle}
                    value={postTitle}
                    maxLength={100}
                    />
                </View>

                <View removeClippedSubviews={true} style={styles.boxInputTextDescription}>
                    <TextInput
                    contextMenuHidden={true}
                    style={styles.inputTextDescription}
                    placeholder='Informe o conteúdo da postagem'
                    onChangeText={setPostDescription}
                    value={postDescription}
                    multiline={true}
                    maxLength={1000}
                    />
                </View>
            </View>

            <TouchableOpacity 
            onPress={() => route.params.operation === 'add' ? addPost() : updPost()}
            style={styles.buttonAdd}>
                 <View style={styles.boxButtonAdd}>
                    <Text style={styles.textButtonAdd}>Publicar</Text>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    )
}