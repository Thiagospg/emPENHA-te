import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#f9fafd",
        
    },
    boxButtonNewPost:{
        alignItems: 'center',
        padding:30
    },
    buttonNewPost:{
        width: 60,
        height: 60,
        backgroundColor: '#622565',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    iconButton:{
        color: '#f5cec6',
        fontSize: 25,
        fontWeight: 'bold',

    },
    posts:{
        alignItems: 'center',
        width: '100%',
        marginTop: 30,
    },
    postTitle:{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#622565',
        borderTopRightRadius: 55,
        borderTopLeftRadius: 5,
        width: '90%'
    },
    textPostTitle:{
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#f5cec6'
    },
    postResume:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor: '#e4aae9',
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 55,
        width: '90%'
    },
    textPostResume:{
        fontSize: 14,
        textAlign: 'left',
        color: '#000',
        
    },
    postFooter:{
        flex:1,
        width: '90%',
        flexDirection: 'row',
        justifyContent:'center',
        paddingTop: 5,
    },
    postFooterDate:{
        flex: 0.5,
        marginLeft: 5,
        paddingRight: 15,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    textPostFooterDate:{
        fontSize: 13,
    },
    postFooterScore:{
        flex:0.8,
        flexDirection: 'row',
        marginRight: 0,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    textPostFooterScore:{
        fontSize: 14,
        marginLeft: 5
    }
});

export default styles