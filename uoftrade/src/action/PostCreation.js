// environment configutations
import ENV from './../config.js'
const API_HOST = ENV.api_host

export const createPost = (form, postCreationComp) => {
    
    // the URL for the request
    const url = `${API_HOST}/items/${postCreationComp.props.app.state.user}`; 
    const formData = new FormData(form);
    const request = new Request(url, {
        method: "post",
        body: formData,
    });
    
    if (postCreationComp.state.tag === 'All Categories'){
        postCreationComp.setState({
            message: {
                type: "error",
                body: 'Please select a category'
            }
        });
        return
    }
    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            // Usually check the error codes to see what happened.
            if (res.status === 200) {
                // If image was added successfully, tell the user.
                postCreationComp.setState({
                    message: {
                        body: '',
                        type: "success"
                    },
                    title: '',
                });
            } else {
                // If server couldn't add the image, tell the user.
                postCreationComp.setState({
                    message: {
                        body: '',
                        type: "error"
                    }
                });
            }
        })
        .catch(error => {
            console.log(error);
        });
};