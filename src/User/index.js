import cookie from 'react-cookies';

const cookieOptions = { path: '/', sameSite: 'lax', secure: false };

export const loginUser = () => {
    return cookie.load('current-user');
};

export const loadLoginUserToken = () => {
    return cookie.load('token');
};

export const saveLoginUserToken = (token) => {
    return cookie.save('token', token, cookieOptions);
};

export const saveLoginUserFromToken = (token, callback) => {
    fetch('/bloggers?token=' + token, {
        method: 'GET'
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.status === 1) {
                console.error("bad token");
            } else {
                cookie.save("current-user", responseJson.resultBody, cookieOptions);
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
    cookie.remove('current-user', cookieOptions);
    cookie.remove('token', cookieOptions);
};
