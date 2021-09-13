import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#f9fafd",
        paddingTop:20
        
    },
    buttonNewPost:{
        position: 'absolute',
        width: 60,
        height: 60,
        bottom: 30,
        right: 20,
        backgroundColor: '#E0972B',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    iconButton:{
        color: '#353236',
        fontSize: 25,
        fontWeight: 'bold',

    },
    posts:{
        alignItems: 'center',
        width: '100%',
        marginTop: 5,
    },
    postTitle:{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#E0972B',
        borderTopRightRadius: 55,
        borderTopLeftRadius: 0,
        width: '90%'
    },
    textPostTitle:{
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#353236'
    },
    postResume:{
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop:15,
        paddingBottom:15,
        backgroundColor: '#e0c59d',
        borderBottomRightRadius: 0,
        borderBottomLeftRadius: 55,
        width: '90%'
    },
    textPostResume:{
        fontSize: 14,
        textAlign: 'justify',
        color: '#000',
        
    },
    postFooter:{
        width: '90%',
        flexDirection: 'row',
        justifyContent:'flex-end'
    },
    postFooterDate:{
        marginLeft: 20,
        paddingRight: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textPostFooterDate:{
        fontSize: 13,
        fontWeight: 'bold'
    },
    postFooterScore:{
        flexDirection: 'row',
        marginRight: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textPostFooterScore:{
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5
    }
});

export default styles