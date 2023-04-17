// environment configutations
import ENV from './../config.js'
const API_HOST = ENV.api_host


export const getProductInfo = (productComp) => {
    const ownerID = productComp.props.match.params.ownerid
    const itemID = productComp.props.match.params.id

    const url = `${API_HOST}/items/${ownerID}/${itemID}`
    fetch(url).then(res => {
        if (res.status === 200) {
            return res.json()
        }
        if (res.status === 500) {
            throw new Error("Internal Server Error")
        }
        else {
            alert("Could not find your messages")
        }
    }).then(json => {
        productComp.setState({item: json.item, title:json.item.title, price: json.item.price, description: json.item.description})
    }).catch(error => {
        console.log(error)
    });

}

export const getOwner = (productComp) => {

    const ownerID = productComp.props.match.params.ownerid

    const url = `${API_HOST}/MyProfile/${ownerID}`
    fetch(url).then(res => {
        if (res.status === 200) {
            return res.json()
        }
        if (res.status === 500) {
            throw new Error("Internal Server Error")
        }
    }).then(json => {
        productComp.setState({owner: json})
    }).catch(error => {
        console.log(error)
    });
}

export const report = (productComp, currUser, owner, item) => {
    const request = new Request(`${API_HOST}/report/${currUser}/${owner}/${item}`, {
        method: "post",
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
        if (res.status === 403) {
            throw new Error("You already reported this post. Please wait while our admin review the post")
        }
    })
    .then(json => {
        if (json !== undefined) {
            productComp.setState({ showPopup: !productComp.state.showPopup, popText: "Thank you for reporting the post. Our admins will review your request" });
        }
    })
    .catch(error => {
        console.log(error)
        productComp.setState({ showPopup: !productComp.state.showPopup, popText: error.message });
    });
}

export const editPost = (productComp, owner, item) => {
    const request = new Request(`${API_HOST}/items/${owner}/${item}`, {
        method: "post",
        body: JSON.stringify({
            title: productComp.state.title,
            price: productComp.state.price, 
            description: productComp.state.description}),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    fetch(request)
    .then(res => {
        if (res.status === 500) {
            throw new Error("Internal Server Error")
        }
        if (res.status === 200) {
            return res.json();
        }
    })
    .then(json => {
        if (json !== undefined) {
            productComp.setState({ item: json.item, title: '', price: '', description: '', savedPost: true});
        }
    })
    .catch(error => {
        console.log(error)
    });
}