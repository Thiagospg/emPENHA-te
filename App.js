import React from 'react';
import { Text, View, Button, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Register from './src/pages/Register';
import Login from './src/pages/Login';
import AboutUS from './src/pages/AboutUS';
import NewPost from './src/pages/NewPost';
import PostDetails from './src/pages/PostDetails';
import PostHome from './src/pages/PostHome';

export default function App() {
  
  

  const Stack = createStackNavigator();
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Register"
          component={Register}
          options={{
            headerShown: true,
            headerTitle: 'Crie uma conta',
            headerTitleAlign: 'center',
            headerStyle:{
              backgroundColor:'#E0972B',
            },
            headerTitleStyle:{
              fontSize: 22
            },
          }
        }
        />
        <Stack.Screen 
          name="Login"
          component={Login}
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen 
          name="AboutUS"
          component={AboutUS}
          options={{
            headerTintColor: "red"
          }}
        />
        <Stack.Screen 
          name="NewPost"
          component={NewPost}
          options={{
            headerTintColor: "red"
          }}
        />
        <Stack.Screen 
          name="PostDetails"
          component={PostDetails}
          options={{
            headerTintColor: "red"
          }}
        />
        <Stack.Screen 
          name="PostHome"
          component={PostHome}
          options={{
            headerTintColor: "red",
            headerLeft: null
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}