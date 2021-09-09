const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

//Function para enviar notificação de push ao inserir uma postagem
exports.sendPushNotification = functions.firestore.document('postagens/{postagemId}/answers/{answerId}').onCreate(async (snap, context) => {
    const postId = context.params.postagemId

    const post = await db.collection("postagens").doc(postId).get();

    if (post.exists) {  
        const uidCriador = post.data().uidCriador;

        try {
            const doc = await db.collection("tokens").doc(uidCriador).get();
            if (doc.exists) {
                doc.data().tokens.forEach((token) => {
                    let messages = []
                    
                    messages.push({
                        "to": token,
                        "body": "New Note Added"
                    });

                    fetch('https://exp.host/--/api/v2/push/send', {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(messages)
                    });
                });
            } else {
                console.log("No such token document!");
                }
        } catch (error) {
            functions.logger.log("Error getting token document:", error);
        } 
    } else {
            console.log("No such post document!");
        } 
});
    