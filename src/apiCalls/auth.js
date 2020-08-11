import {API} from '../api'

export const Signup = (user) => {
    return fetch (`${API}/signup`, {
        method: 'POST',
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then((res) => res.json() )
    .catch((err) => console.log(err))
}

export const Login = (user) => {
    return fetch(`${API}/signin`,{
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then((res) => {
        return res.json()
    })
    .catch((err) => console.log(err))
}

export const getAuthUser = (userId, token) => {
    return fetch(`${API}/user/${userId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

export const authenticate = (data,next) => {
    if (typeof window !== 'undefined'){
        window.sessionStorage.setItem('jwt', JSON.stringify(data))
        next()
    }
}
export const signout = () => {
    if(typeof window !== 'undefined'){
        window.sessionStorage.removeItem('jwt')
        return fetch(`${API}/signout`, {
            method: 'GET'
        })
        .then((res) => console.log('Logout successful'))
        .catch((err) => console.log(err))
    }
}
export const isAuthenticated = () => {
    if(typeof window !== 'undefined'){
        if(window.sessionStorage.getItem('jwt')){
            return JSON.parse(window.sessionStorage.getItem('jwt'))
        }
        else{
            return false
        }
    }
    return false
}
