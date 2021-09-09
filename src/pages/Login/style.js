import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingTop: "30%",
        backgroundColor: "#fff",
    },
    boxLogo:{
        alignItems: "center",
        marginBottom: "10%",
    },
    imageLogo:{
        width: "75%", 
        resizeMode: "contain",
    },
    boxInput:{
        alignItems: "center",
        width: "100%",
    },
    boxInputLogin:{
        flexDirection: "row",
        width: "70%",
        alignItems: "center",
        justifyContent: "center",    
            
    },
    boxInputPassword:{
        flexDirection: "row",
        width: "70%",
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
    buttonLogin:{
        backgroundColor: "#E0972B",
        width: "72%",
        alignItems: "center",
        borderRadius: 50
    },
    textButton:{
        padding: 12,
        fontWeight: "bold",
        fontSize: 20
    },
    buttonGoogle:{
        backgroundColor: "#E0972B",
        width: "72%",
        alignItems: "center",
        borderRadius: 50
    },
});

export default styles