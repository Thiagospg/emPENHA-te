import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f9fafd',
        padding: 8,    
    },
    modalContainer:{
        alignItems:'center',
        justifyContent:'center'
    },
    boxPostTitle:{
        marginTop:10,
        padding: 10,
        backgroundColor:'#f9fafd',
        width:'95%',  
    },
    textPostTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#622565'
    },
    boxPostContent:{
        marginBottom: 20,
        marginTop: 10,
        width:'95%',
        borderColor: '#622565',
    },
    textBorderContent:{
        margin:15,
        borderTopWidth:1, 
        borderTopColor: '#a1a1a1',
        width:'100%', 
        alignSelf:'center',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#a1a1a1'
    },
    textPostContent:{     
        textAlign: 'center',
        fontSize: 16,
        textAlign: 'justify',
        color: '#000',
        paddingHorizontal: 20,
        paddingTop:20,
    },
    footerAnswer:{
        flexDirection:'row',
        marginBottom:15,
    },
    boxAnswer:{
        padding:8,
        flex: 0.8,
    },
    textInformation:{
        paddingLeft:'5%',
        alignSelf:'flex-start',
        color: '#622565',
        fontSize:16
    },
    textAnswer:{
        paddingVertical:8,
        paddingHorizontal:'5%',
        borderWidth:0.8,
        width:'100%',
        alignSelf:'center',
        borderColor: '#622565',  
    },
    boxSendAnswer:{
        flex:0.2,
        padding:8,
        alignSelf:'center',
        marginHorizontal:15,
        backgroundColor:'green'
    },
    boxListAllAnswers:{
        width: '100%',
        flexDirection:'row',
        flex:1
    },
    boxListAnswer:{
        backgroundColor: '#e4aae9',
        padding:10,
        borderRadius: 10,
        flex: 1,
    },
    textListAnswer:{
        fontSize: 14,
        color: '#622565',
        textAlign: 'left'
    },
    boxListAnswerLike:{
        justifyContent:'center',
        alignItems:'center',
        margin: 5
    },
    textListAnswerScore:{
        fontSize: 9,
    },
    boxListAnswerDate:{
        width:'100%',
        paddingBottom:15,
       
    },
    textListAnswerDate:{
        paddingLeft:10,
        fontSize:10,
        borderBottomWidth:0.3,
        borderBottomColor: '#622565'
    }
});

export default styles;