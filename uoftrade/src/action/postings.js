import {getAllItems} from './Marketplace'
import ENV from './../config.js'
import {getAllReportedItems} from './report'
const API_HOST = ENV.api_host


export const removePost = (items, post, type) => {
    // delete post first
    const request = new Request(`${API_HOST}/items/${post.owner}/${post.item._id}`, {
        method: "delete"
    });
    fetch(request)
        .then(res => {
            if (res.status === 400) {
                throw new Error("can't find resource")
            }
            else{
                return res.json()
            }
    }).then(json => {
        if (type === 'marketplace'){
            getAllItems(items)
        }
        else if (type === 'reportedPost'){
            getAllReportedItems(items)
            getCurrentPostings(items, items.props.app.state.user)
        }
        else{
            // currentListings
            getCurrentPostings(items, post.owner)
            getAllReportedItems(items)
        }
    }).catch(error => {
        console.log(error)
    });
}

export const getCurrentPostings = (dashboard, userid) => {
    const url = `${API_HOST}/items/${userid}`
    const request = new Request(url, {
        method: "get"
    });
    

    fetch(request).then(res => {
        if (res.status === 200) {
            return res.json()
        }
        if (res.status === 500) {
            throw new Error("Internal Server Error")
        }
        else {
            alert('You are not logged in!')
        }
    }).then(json => {
        dashboard.setState({items: json.items})
    }).catch(error => {
        console.log(error)
    });
}