import React from 'react';
import { View, Text, TextInput, SafeAreaView, ScrollView } from 'react-native';
import styles from './style';

export default function PostDetails({route, navigation}){
    return(
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.listContainer}>
                <Text>{route.params.description}</Text>
            </ScrollView>
        </SafeAreaView>
    )
}