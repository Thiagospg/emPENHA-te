import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
       
        backgroundColor: "#f9fafd",
        justifyContent: 'center'
        
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
        borderBottomColor: "#E0972B",
        fontSize: 20,
        
    },
    iconPasswordView:{
        position: "absolute",
    },
    boxButton:{
        width: "100%",
        alignItems: "center",
        
    },
    buttonRegister:{
        backgroundColor: "#E0972B",
        width: "91%",
        alignItems: "center",
        borderRadius: 10,
        marginBottom: '5%'
    },
    textButton:{
        padding: 12,
        fontWeight: "bold",
        fontSize: 20,
        
    },
});

export default styles