import ENV from './../config.js'
const API_HOST = ENV.api_host

export const getAnnouncement = (dashboard) => {
    const url = `${API_HOST}/announcement`

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
        dashboard.setState({announcements: json.announcement})
    }).catch(error => {
        console.log(error)
    });
}

export const addAnnouncement = dashboard => {
    if (dashboard.state.announcementTitle !== '' && dashboard.state.announcementMessage !== '')
    {

        const request = new Request(`${API_HOST}/announcement`, {
            method: "post",
            body: JSON.stringify({
                title: dashboard.state.announcementTitle,
                content: dashboard.state.announcementMessage
            }),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
        });
    
    
        // Send the request with fetch()
        fetch(request)
            .then(res => {
                if (res.status === 400) {
                    throw new Error("Something is wrong")
                }
                if (res.status === 200) {
                    return res.json();
                }
            })
            .then(json => {
                getAnnouncement(dashboard)
            })
            .catch(error => {
                console.log(error)
            });
        
    }   
}

export const removeAnnouncement = (dashboard, announcementID) => {
    const request = new Request(`${API_HOST}/announcement/${announcementID}`, {
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
        getAnnouncement(dashboard)
    }).catch(error => {
        console.log(error)
    });
}

