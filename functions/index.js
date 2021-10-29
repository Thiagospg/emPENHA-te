const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

//Function to send notifications for new answers to the creator of a post
exports.sendPushNotification = functions.firestore.document('posts/{postId}/answers/{answerId}').onCreate(async (snap, context) => {
    const postId = context.params.postId
    const post = await db.collection("posts").doc(postId).get();

    const answerId = context.params.answerId
    const answer = await db.collection("posts").doc(postId).collection("answers").doc(answerId).get();
    
    if (post.exists && answer.exists) {  
        const postCreatedBy = post.data().createdBy;
        const answerCreatedBy = answer.data().createdBy;

        if (postCreatedBy !== answerCreatedBy) {
            try {
                const doc = await db.collection("tokens").doc(postCreatedBy).get();
                if (doc.exists) {
                    doc.data().tokens.forEach((token) => {
                        let messages = []
                        
                        messages.push({
                            "to": token,
                            "priority": "high",
                            "sound": "default",
                            "title": "Resposta publicada",
                            "data": { 
                                "id": postId,
                                "title": post.data().title, 
                                "description": post.data().description,
                                "date": post.data().createdWhen,
                                "creatorId": post.data().createdBy,
                                "score": post.data().score,
                            },
                            "channelId": "chat-messages",
                            "body": "Uma nova resposta foi publicada na sua postagem de título: " + post.data().title
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
        }
    } else {
            console.log("No such post document!");
        } 
});

//Function to update score count field from a post
exports.updatePostsScoreCount = functions.firestore.document('posts/{postId}').onUpdate(async (change, context) => {
    const data = change.after.data();
    const previousData = change.before.data();

    if (data.score.length == previousData.score.length) {
        return null;
    }

    return change.after.ref.update({
        score_count: data.score.length
    });
});

//Function to update when answer added count field from a post
exports.updatePostsAnswerAddedCount = functions.firestore.document('posts/{postId}/answers/{answerId}').onCreate(async (snap, context) => {
    const postId = context.params.postId
    const post = db.collection("posts").doc(postId);

    return post.update({
        answer_count: admin.firestore.FieldValue.increment(1)
    });
});

//Function to update when answer deleted count field from a post
exports.updatePostsAnswerDeletedCount = functions.firestore.document('posts/{postId}/answers/{answerId}').onDelete(async (snap, context) => {
    const postId = context.params.postId
    const post = db.collection("posts").doc(postId);

    return post.update({
        answer_count: admin.firestore.FieldValue.increment(-1)
    });
});