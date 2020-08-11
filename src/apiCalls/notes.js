import {API} from '../api'

export const createNote = (note, userId, token) => {
    return fetch(`${API}/createNote/${userId}`, {
        method: 'POST',
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(note)
    })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

export const getAllNotes = (userId, token) => {
    return fetch(`${API}/getNotes/${userId}`,{
        method: 'GET',
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

export const updateNote = (note, userId, noteId, token) => {
    return fetch(`${API}/updateNote/${userId}/${noteId}`, {
        method: 'PATCH',
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(note)
    })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}

export const removeNote = (userId, noteId, token) => {
    return fetch(`${API}/removeNote/${userId}/${noteId}`, {
        method: 'DELETE',
        headers:{
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    .then((res) => res.json())
    .catch((err) => console.log(err))
}