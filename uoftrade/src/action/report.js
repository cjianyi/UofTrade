import ENV from './../config.js'
const API_HOST = ENV.api_host

export const getAllReportedItems  = (dashboard) => {
    const url = `${API_HOST}/reportedposts`
    
    fetch(url).then(res => {
        if (res.status === 200) {
            return res.json()
        }
        if (res.status === 500) {
            throw new Error("Internal Server Error")
        }
    }).then(json => {
        dashboard.setState({reportedItems: json.reportedPosts})
    }).catch(error => {
        console.log(error)
    });
}