import ENV from './../config.js'
const API_HOST = ENV.api_host

export const getProfile = (userProfile, userID) =>{
    const url = `${API_HOST}/MyProfile/${userID}`
    fetch(url).then(res => {
        if (res.status === 200){
            return res.json()
        }
        if (res.status === 404){
            throw new Error("Wrong credentials")
        }
        else{
            alert("Could not find profile")
        }
    }).then(json => {
        userProfile.setState({
            profile: json, name: json.name, bio: json.bio
        });
        if (json.image){
            userProfile.setState({profile_pic: json.image})
        }
    }).catch(error =>{
        console.log(error)
    });
}

export const updateProfile = (userProfile, userID) => {
    const request = new Request(`${API_HOST}/MyProfile/${userID}`, {
        method: "post",
        body: JSON.stringify({
            name: userProfile.state.name,
            bio: userProfile.state.bio,}),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });

    fetch(request).then(res => {
        if (res.status === 500) {
            throw new Error("Internal Server Error")
        }
        if (res.status === 200) {
            return res.json();
        }
    }).then(json => {
        if (json !== undefined) {
            userProfile.setState( {profile: json, name: json.name, bio: json.bio, updateInfo: true})
        }
    }).catch(error => {
        console.log(error)
    })
    // userProfile.props.app.state.user is the user id
}



export const changeProfilePicture = (userProfile, userID, form) => {
    const formData = new FormData(form);
    const request = new Request(`${API_HOST}/myprofile/images/${userID}`, {
        method: "post",
        body: formData
    });

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
            userProfile.setState({profile_pic: json.user.profile_picture})
        })
        .catch(error => {
            console.log(error)
        });
    
}
    



