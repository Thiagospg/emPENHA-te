import React from 'react';
import { View, Text } from 'react-native';

export default function PostDetails({route, navigation}){
    return(
        <View>
            <Text>{route.params.score}</Text>
        </View>
    )
}