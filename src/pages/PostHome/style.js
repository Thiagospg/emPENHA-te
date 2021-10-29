import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: "#f9fafd",
        
    },
    boxButtonNewPost:{
        alignItems: 'center',
        padding:10,
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
        marginVertical: 15,
    },
    postTitle:{
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        backgroundColor: '#622565',
        borderTopRightRadius: 55,
        borderTopLeftRadius: 5,
        width: '90%'
    },
    textPostTitle:{
        fontSize: 16,
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
        paddingBottom: 10, 
        marginBottom:15,
        borderBottomWidth: 0.2,
        alignSelf:'center',
    },
    postFooterAnswers:{
        flex: 0.2,
        justifyContent: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center'
    },
    postFooterDate:{
        flex: 0.5,
        paddingRight: 15,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    textPostFooterDate:{
        fontSize: 13,
    },
    postFooterScore:{
        flex:0.5,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    postFooterButton:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    textPostFooterScore:{
        fontSize: 14,
        marginLeft: 5
    },
    modalMenuView:{
        height:160,
        width:120,
        backgroundColor: '#622565',
        borderRadius: 2,
        shadowColor: 'rgba(0,0,0,1)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 10,
    },
    textOptionButton:{
        fontSize:16,
        textAlign: 'left',
        color: '#f5cec6',
        padding: 8
    }
    
});

export default styles