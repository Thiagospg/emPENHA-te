import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import Register from '../pages/Register';
import Login from '../pages/Login';
import AboutUS from '../pages/AboutUS';
import NewPost from '../pages/NewPost';
import PostDetails from '../pages/PostDetails';
import PostHome from '../pages/PostHome';
import ForgotPassword from '../pages/ForgotPassword';

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

function StackRoutes(){
    return(
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
                headerShown: false,
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
                headerShown:false,
                headerTitle: 'Postagens',
                headerTitleAlign: 'center',
                headerTintColor: '#f5cec6',
                headerStyle:{
                    backgroundColor:'#622565',
                },
                headerTitleStyle:{
                    fontSize: 22
                }
                }}
            />
        </Stack.Navigator>
    )
}

export default StackRoutes;