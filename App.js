import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Register from './src/pages/Register';
import Login from './src/pages/Login';
import AboutUS from './src/pages/AboutUS';
import NewPost from './src/pages/NewPost';
import PostDetails from './src/pages/PostDetails';
import PostHome from './src/pages/PostHome';
import ForgotPassword from './src/pages/ForgotPassword';

export default function App() {

  const Stack = createStackNavigator();
  const config = {
    animation: 'spring',
    config: {
      stiffness: 400,
      damping: 100,
      mass: 10,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Register"
          component={Register}
          options={{
            animationTypeForReplace:'pop',
            transitionSpec:{
              open: config,
              close:config
            },
            headerShown: false,
            headerTitle: 'Crie uma conta',
            headerTitleAlign: 'center',
            headerTintColor: '#f5cec6',
            headerStyle:{
              backgroundColor:'#622565',
            },
            headerTitleStyle:{
              fontSize: 22,
            },
          }
        }
        />
        <Stack.Screen 
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            animationTypeForReplace:'pop',
            transitionSpec:{
              open: config,
              close:config
            },
            headerShown: false,
            headerTitle: 'Redefina a senha',
            headerTitleAlign: 'center',
            headerTintColor: '#f5cec6',
            headerStyle:{
              backgroundColor:'#622565',
            },
            headerTitleStyle:{
              fontSize: 22,
            },
          }
        }
        />
        <Stack.Screen 
          name="Login"
          component={Login}
          options={{
            animationTypeForReplace:'pop',
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
            headerTitle: 'Criação de postagem',
            headerTitleAlign: 'center',
            headerTintColor: '#f5cec6',
            headerStyle:{
              backgroundColor:'#622565',
            },
            headerTitleStyle:{
              fontSize: 22
            },
          }}
        />
        <Stack.Screen 
          name="PostDetails"
          component={PostDetails}
          options={{
            headerTitle: 'Postagem',
            headerTitleAlign: 'center',
            headerTintColor: '#f5cec6',
            headerStyle:{
              backgroundColor:'#622565',
            },
            headerTitleStyle:{
              fontSize: 22
            },
          }}
        />
        <Stack.Screen 
          name="PostHome"
          component={PostHome}
          options={{
            headerTitle: 'Postagens',
            headerTitleAlign: 'center',
            headerTintColor: '#f5cec6',
            headerStyle:{
              backgroundColor:'#622565',
            },
            headerTitleStyle:{
              fontSize: 22
            },
            headerLeft: null,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}