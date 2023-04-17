// environment configutations
import ENV from './../config.js'
const API_HOST = ENV.api_host

export const getUserMessages = (userMessages, userID) => {
    const url = `${API_HOST}/conversation/${userID}`

    fetch(url).then(res => {
        if (res.status === 200) {
            return res.json()
        }
        if (res.status === 404) {
            throw new Error("Wrong credentials")
        }
        else {
            alert("Could not find your messages")
        }
    }).then(json => {
        userMessages.setState({allConversations: json.conversations})
    }).catch(error => {
        console.log(error)
    });
}

export const getUsers = (messagesComp, userID) => {
    const url = `${API_HOST}/conversation/users/${userID}`
    fetch(url).then(res => {
        if (res.status === 200) {
            return res.json()
        }
        else {
            alert("Could not find your messages")
        }
    }).then(json => {
        messagesComp.setState({allUsers: json.users})
    }).catch(error => {
        console.log(error)
    })
}

export const sendNewMessage = (senderID, receiverID, messagesComp, convID) => {
    const request = new Request(`${API_HOST}/conversation/${convID}`, {
        method: "post",
        body: JSON.stringify({
            sender: senderID,
            receiver: receiverID, 
            message: messagesComp.state.newMessage}),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    fetch(request)
        .then(res => {
            if (res.status === 500) {
                throw new Error("Wrong credentials")
            }
            if (res.status === 200) {
                return res.json();
            }
        })
        .then(json => {
            if (json !== undefined) {
                getUserMessages(messagesComp, messagesComp.props.app.state.user)
            }
        })
        .catch(error => {
            console.log(error)
        });

}