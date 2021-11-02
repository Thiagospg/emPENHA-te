import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f9fafd',
    },
    modalContainer:{
        alignItems:'center',
        justifyContent:'center',
        margin:0
        
    },
    modalView:{
        backgroundColor: '#e4aae9',
        borderRadius: 15,
        width: '90%',
        padding: 15,
        height: '40%'
    },  
    modalTextTitle:{
        fontSize:15,
        fontWeight: 'bold',
        color: '#622565',
        marginTop:3,
        width:'90%'
    },
    modalText:{
        marginVertical:20
    },
    modalReportButton:{
        padding: 15,
        borderRadius: 15,
        width:'100%',
        alignSelf: 'center',
        backgroundColor: '#622565'
    },
    modalReportButtonText:{
        fontWeight: 'bold',
        fontSize:16,
        textAlign: 'center',
        color: '#f5cec6'
    },
    boxPostTitle:{
        marginTop:10,
        padding: 10,
        backgroundColor:'#f9fafd',
        width:'100%',  
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
        width:'100%',
        borderColor: '#622565',
        paddingHorizontal: 15
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
        paddingHorizontal:10
    },
    boxAnswer:{
        padding:8,
        flex: 0.8,
        
    },
    textInformation:{
        paddingHorizontal:18,
        color: '#622565',
        fontSize:16
    },
    textClosedPost:{
        textAlign:'center', 
        marginBottom: 15, 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: '#a1a1a1',
        paddingHorizontal:18
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
        marginHorizontal:8,
        backgroundColor:'#622565',
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    boxListAllAnswers:{
        width: '100%',
        flexDirection:'row',
        flex:1,
    },
    boxListAnswer:{
        backgroundColor: '#e4aae9',
        padding:10,
        borderRadius: 10,
        flex: 0.9,

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
        textAlign:'center'
    },
    boxListAnswerDate:{
        width:'100%',
        paddingBottom:15,
    },
    textListAnswerDate:{
        paddingHorizontal:10,
        fontSize:12,
    },
    textAnswerError:{
        fontSize: 13,
        color: '#ff0800',
        textAlign: 'center',
        marginBottom:5,
    },
    modalMenuView:{
        height:80,
        width:120,
        backgroundColor: '#622565',
        borderRadius: 2,
        shadowColor: 'rgba(0,0,0,1)',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 10,
    },
    buttonPostLike:{
        width:50, 
        alignSelf:'center', 
        marginTop: 35,
        borderRadius: 5,
        alignItems:'center', 
        padding:4,
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    textOptionButton:{
        fontWeight: 'bold',
        fontSize:16,
        textAlign: 'center',
        color: '#f5cec6',
        padding: 8
    },
    buttonToTop:{
        bottom: 30,
        marginHorizontal: 10,
        position: 'absolute',
        width: 40,
        height: 40,
        backgroundColor: '#622565',
        borderRadius: 50,
       
    }
});

export default styles;