import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#f9fafd",
        paddingTop: 30,
        alignItems: 'center'
    },
    boxInput:{
        alignItems: "center",
        width: "90%",
        borderWidth: 0.5,
        borderColor: "#622565",
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
        height: '80%',
        padding: 30,
        backgroundColor: '#fff'
        
    },
    boxInputTextTitle:{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        borderBottomWidth: 0.8,
        borderColor: "#622565",
        
    },
    inputTextTitle:{
        width: "100%",
        fontSize: 20,
        textAlign: 'center',
        color: '#622565',
        fontWeight: 'bold'
    },
    boxInputTextDescription:{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",  
    },
    inputTextDescription:{
        width: "100%",
        fontSize: 16,
        height: '90%',
        textAlignVertical:"top",
        color: '#000',
        
    },
    boxButtonAdd:{
        alignItems: "center",
        width: "100%",
        backgroundColor: '#622565',
        borderBottomRightRadius: 35,
        borderBottomLeftRadius: 35,
    },
    buttonAdd:{
        alignItems: 'center',
        justifyContent: 'center',
        width: '90%'
    },
    textButtonAdd:{
        padding: 18,
        fontWeight: "bold",
        fontSize: 18,
        color: '#f5cec6'
    },
});

export default styles