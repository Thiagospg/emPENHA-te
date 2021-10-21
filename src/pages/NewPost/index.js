import React, { useState } from 'react';
import firebase from '../../config/firebaseconfig';
import { View, Text, TouchableOpacity, TextInput, SafeAreaView, Alert } from 'react-native';
import styles from './style';
import nlp from 'compromise/compromise';

export default function NewPost({route, navigation}){
    const database = firebase.firestore();
    const [postDescription, setPostDescription] = useState(route.params.description ? route.params.description : '');
    const [postTitle, setPostTitle] = useState(route.params.title ? route.params.title : '');

    async function addPost(){
      //TO DO
        /*  let doc = nlp('john');
        let people = doc.match('#FirstName');

        if(people.text() === ''){
            console.log(doc)
            console.log("não tem nome")
        } else {
            console.log(doc)
            console.log("tem nome")
        }
        */
        if (postDescription && postTitle !== ''){
            await database.collection("posts").add({
                createdWhen: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: firebase.auth().currentUser.uid,
                description: postDescription,
                score: [],
                title: postTitle,
                closed: false
            }).then(() => {
                navigation.navigate('PostHome');
                
            }).catch((error) => {
                console.error("Error add document: ", error);
            });
        } else {
            Alert.alert('Não foi possível criar a postagem','Por favor, preencha tanto o título quanto o conteúdo da postagem')
        }
            
    }

    async function updPost(){
        if (postDescription && postTitle !== ''){
            await database.collection("posts").doc(route.params.id).update({
                description: postDescription,
                title: postTitle,
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
                    closed: route.params.closed
                });
                
            }).catch((error) => {
                console.error("Error add document: ", error);
            });
        } else {
            Alert.alert('Não foi possível editar a postagem','Por favor, preencha tanto o título quanto o conteúdo da postagem')
        }
            
    }

    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.boxInput}> 
                <View style={styles.boxInputTextTitle}>
                    <TextInput
                    style={styles.inputTextTitle}
                    placeholder='Informe o título da postagem'
                    onChangeText={setPostTitle}
                    value={postTitle}
                    maxLength={100}
                    />
                </View>

                <View style={styles.boxInputTextDescription}>
                    <TextInput
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