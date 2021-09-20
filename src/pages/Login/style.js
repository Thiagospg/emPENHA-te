import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#f9fafd",
        paddingTop:50
        
    },
    boxLogo:{
        width: '100%',
        alignItems: 'center',
        marginBottom: "3%",
    },
    imageLogo:{
        width: '78%',
        resizeMode: 'contain',
    },
    boxInput:{
        alignItems: "center",
        width: "100%",
    },
    boxInputLogin:{
        flexDirection: "row",
        width: "90%",
        alignItems: "center",
        justifyContent: "center",    
            
    },
    boxInputPassword:{
        flexDirection: "row",
        width: "90%",
        justifyContent: "flex-end",
    },
    input:{
        width: "100%",
        borderBottomWidth: 1,
        marginBottom: 18,
        borderBottomColor: "#622565",
        fontSize: 20,
    },
    iconPasswordView:{
        position: "absolute",
    },
    boxButton:{
        width: "100%",
        alignItems: "center",
        
    },
    buttonLogin:{
        backgroundColor: "#622565",
        width: "91%",
        alignItems: "center",
        borderRadius: 10,
        marginBottom: '5%'
    },
    textButton:{
        padding: 12,
        fontWeight: "bold",
        fontSize: 16,
        color: '#f5cec6'
        
    },
    buttonGoogle:{
        backgroundColor: "#DDCED2",
        width: "60%",
        alignItems: "center",
        borderRadius: 10,
        margin: '3%',
        flexDirection: "row",
    },
    textButtonGoogle:{
        padding: 5,
        //fontWeight: "bold",
        fontSize: 16,
        color: '#EA4335'
    },
    boxButtonGoogle:{
        flexDirection: 'row', 
        alignItems: 'center', 
        flex: 1,
        
    },
    boxGoogleButtonIcon:{
        paddingLeft:'5%',
        flex: 0.2
    },
    boxButtonGoogleText:{
        flex: 0.8
        
    },
    buttonFacebook:{
        backgroundColor: "#DBDDE9",
        width: "60%",
        alignItems: "center",
        borderRadius: 10,
        margin: 0,
        flexDirection: "row",
    },
    boxButtonFacebook:{
        flexDirection: 'row', 
        alignItems: 'center', 
        flex: 1,
        
    },
    boxFacebookButtonIcon:{
        paddingLeft:'5%',
        flex: 0.2
    },
    boxButtonFacebookText:{
        flex: 0.8
        
    },
    textButtonFacebook:{
        padding: 5,
        //fontWeight: "bold",
        fontSize: 16,
        color: '#097EEB'
    },
    boxRegister:{
        marginTop: '2%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxForgotPassword:{
        marginTop: '8%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textLink:{
        fontSize: 16,
        color: '#139ef8'
    },
    boxLoginError:{
        width:'80%',
        justifyContent:'center',
        alignItems:'center',
        marginBottom:15
    },
    textLoginError:{
        fontSize: 13,
        color: '#ff0800'
    }
});

export default styles