const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

//Function to send notifications for new answers to the creator of a post
exports.sendPushNotification = functions.firestore.document('posts/{postId}/answers/{answerId}').onCreate(async (snap, context) => {
    const postId = context.params.postId

    const post = await db.collection("posts").doc(postId).get();

    if (post.exists) {  
        const createdBy = post.data().createdBy;

        try {
            const doc = await db.collection("tokens").doc(createdBy).get();
            if (doc.exists) {
                doc.data().tokens.forEach((token) => {
                    let messages = []
                    
                    messages.push({
                        "to": token,
                        "body": "Nova resposta publicada na sua postagem: " + post.data().title
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
    