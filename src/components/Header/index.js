import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import firebase from '../../config/firebaseconfig';
import { Feather } from '@expo/vector-icons';

export default function Header(props, { navigation }){

    return(
        <View style={styles.viewHeader}>
            <View style={{justifyContent:'center', paddingLeft:15, marginTop:3}}>
                <TouchableOpacity activeOpacity={0.6} onPress={props.leftAction}> 
                    <Feather name={props.leftIcon} size={24} color="#f5cec6" />    
                </TouchableOpacity>
            </View>

            <View style={styles.boxTextHeader}>
                <Text style={styles.textHeader}>{props.title}</Text>
            </View>

            <View style={{justifyContent:'center', paddingRight:15, marginTop:3}}>
                <TouchableOpacity activeOpacity={0.6} onPress={props.rightAction}> 
                    <Feather name={props.rightIcon} size={24} color="#f5cec6" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewHeader:{
        alignItems: 'center',
        backgroundColor: "#622565", 
        height:60,
        alignItems:'center',
        flexDirection: 'row',
    },
    boxTextHeader:{
        width: '80%',
    
    },
    textHeader:{
        textAlign:'center',
        fontSize: 22,
        fontWeight: 'bold',
        color: '#f5cec6',
    },
});