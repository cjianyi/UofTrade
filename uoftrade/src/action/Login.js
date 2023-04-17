// environment configutations
import ENV from './../config.js'
const API_HOST = ENV.api_host

export const login = (loginComp, app) => {
    // Create our request constructor with all the parameters we need
    const request = new Request(`${API_HOST}/users/login`, {
        method: "post",
        body: JSON.stringify(loginComp.state),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        }
    });


    // Send the request with fetch()
    fetch(request)
        .then(res => {
            if (res.status === 400) {
                loginComp.setState({loginFailed: true})
                throw new Error("Wrong credentials")
            }
            if (res.status === 200) {
                return res.json();
            }
        })
        .then(json => {
            if (json !== undefined) {
                app.setState({ user: json.user, userType: json.userType });
                loginComp.props.history.push("/main")
            }
        })
        .catch(error => {
            console.log(error)
        });
};

export const register = (registerComp, app) => {
    // Create our request constructor with all the parameters we need
    const request = new Request(`${API_HOST}/users`, {
        method: "post",
        body: JSON.stringify({email: registerComp.state.email,
            password: registerComp.state.password, 
            type: 'user', 
            bio: registerComp.state.bio,
            name: registerComp.state.name}),
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
            else{
                alert('Email already in use. Please login or use a different email!')
            }
        })
        .then(json => {
            if (json !== undefined) {
                app.setState({ user: json._id, userType: json.type });
                registerComp.props.history.push("/main")
            }
        })
        .catch(error => {
            console.log(error)
        });
};

