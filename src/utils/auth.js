import Cookie from 'js-cookie';//js-cookie是一个简单的，轻量级的处理cookies的js API

const Token = 'token';

export function getToken(){
    return Cookie.get(Token);
}

export function setToken(token){
    return Cookie.set(Token,token)
}

export function removeToken(){
    return Cookie.remove(Token)
}