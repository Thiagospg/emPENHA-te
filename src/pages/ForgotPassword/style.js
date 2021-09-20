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
        flex:0.6,
        justifyContent: 'center',
        
    },
    boxInputLogin:{
        flexDirection: "row",
        width: "90%",
        alignItems: "center",
        justifyContent: "center",    
            
    },
    input:{
        width: "100%",
        borderBottomWidth: 1,
        marginBottom: 18,
        borderBottomColor: "#622565",
        fontSize: 20,
        
    },
    boxButton:{
        width: "100%",
        alignItems: "center",
        
    },
    buttonRedefine:{
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
    viewHeader:{
        flexDirection:'row', 
        alignItems: 'center',
        backgroundColor: "#622565", 
        width:'100%', 
        flex:0.2,
    },
    viewFooter:{
        alignItems: 'center',
        justifyContent:'flex-end',
        backgroundColor: "#622565", 
        width:'100%', 
        flex:0.2,
    },
    boxRedefineError:{
        width:'80%',
        justifyContent:'center',
        alignItems:'center'
    },
    textRedefineError:{
        fontSize: 13,
        color: '#ff0800'
    }
});

export default styles