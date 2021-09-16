import React, { useState } from 'react';
import firebase from '../../config/firebaseconfig';
import { View, Text, TouchableOpacity, TextInput, SafeAreaView, Alert } from 'react-native';
import styles from './style';

export default function NewPost({navigation}){
    const database = firebase.firestore();
    const [postDescription, setPostDescription] = useState('');
    const [postTitle, setPostTitle] = useState('');

    async function addPost(){
        if (postDescription && postTitle !== ''){
            await database.collection("posts").add({
                createdWhen: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: firebase.auth().currentUser.uid,
                description: postDescription,
                score: [],
                title: postTitle
            }).then(() => {
                navigation.navigate('PostHome');
                
            }).catch((error) => {
                console.error("Error add document: ", error);
            });
        } else {
            Alert.alert('Não foi possível criar a postagem','Por favor, preencha tanto o título quanto o conteúdo da postagem')
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
            onPress={() => addPost()}
            style={styles.buttonAdd}>
                 <View style={styles.boxButtonAdd}>
                    <Text style={styles.textButtonAdd}>Publicar</Text>
                </View>
            </TouchableOpacity>
            
        </SafeAreaView>
    )
}