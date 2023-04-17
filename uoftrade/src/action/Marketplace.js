// environment configutations
import ENV from './../config.js'
const API_HOST = ENV.api_host

export const getAllItems  = (marketplace) => {
    const url = `${API_HOST}/items`

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
        marketplace.setState({allItems: json.items, items: json.items})
    }).catch(error => {
        console.log(error)
    });
}
export const filterCategory = (marketplace, category) => {
    if (category === 'All Categories'){
        marketplace.setState({
            items: marketplace.state.allItems
        })
        return
    }
    const filteredItems = marketplace.state.allItems.filter(i => {
        return i.item.tag === category
    })
    marketplace.setState(
        {items: filteredItems}
    )
}