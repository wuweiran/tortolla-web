import cookie from 'react-cookies';

export const loginUser = () => {
    return cookie.load('current-user');
};

export const loginUserToken = () => {
    return cookie.load('token');
};

export const saveLoginUserFromToken = (token, callback) => {
    fetch('/bloggers/get_from_token', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: token
        }),
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.status === 1) {
                console.error("bad token");
            } else {
                cookie.save("current-user", responseJson.resultBody);
            }
            callback();
        })
        .catch((error) => {
            console.error(error);
        });
}
 
export const isLogin = () => {
    const user = loginUser();
    return typeof (user) === 'object';
};
 
export const logout = () => {
    cookie.remove('current-user');
};
