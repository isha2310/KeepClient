import React, {useState, useEffect} from 'react'
import "react-responsive-modal/styles.css"
import { Modal } from "react-responsive-modal"
import {updateNote, removeNote} from '../../apiCalls/notes'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import { isAuthenticated } from '../../apiCalls/auth'
import './tile.scss'

const Tile = (props) => {

    const [title, setTitle] = useState('')
    const [note, setNote] = useState('')
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setTitle(props.keep.title)
        setNote(props.keep.note)
    },[props.keep.title, props.keep.note])

    const  onOpenModal = () => {
        setOpen(true)
    }

    const  onCloseModal = () => {
        setOpen(false)
    }

    const handleEdit = (e) => {
        e.preventDefault()
        if(window.sessionStorage.getItem('jwt') === null ){
            props.setOpen(true)
        } else{
            const {user, token} = isAuthenticated()
            const keep = {
                title,
                note,
                userId: user._id
            }
            updateNote(keep, user._id, props.keep._id, token )
            .then((res) => {
                onCloseModal()
                props.setFetching(true)
            })
            .catch((e) => console.log(e))
        }
    }

    const handleDelete = () => {
        if(window.sessionStorage.getItem('jwt') === null ){
            props.setOpen(true)
        } else{
            const {user, token} = isAuthenticated()
            removeNote(user._id, props.keep._id, token)
            .then((res) => {
                props.setFetching(true)
            })
            .catch((e) => console.log(e))
        }
    }

    return(
        <div>
            <div className="tile" >
                <h4>{props.keep.title}</h4>
                <p>{props.keep.note}</p>
                <span onClick={onOpenModal} className="s1" ><EditIcon /></span>
                <span onClick={handleDelete} className="s2" ><DeleteIcon /></span>
            </div> 
            <Modal open={open} onClose={onCloseModal} center styles={{ modal:{ borderRadius: '10px', padding: '1vh' }, closeIcon: {height: '2vh', padding: '0.5vh'}  }} >
                <div className="tile-note" >
                  <div>
                    <input 
                        value={title}
                        placeholder="Title"
                        maxLength="20"
                        className="title"
                        autoFocus
                        onChange={ (e) => setTitle(e.target.value) }
                    />
                  </div>
                  <div>
                    <textarea 
                        value={note}
                        placeholder="Your note."
                        maxLength="300"
                        cols="30"
                        rows="5"
                        className="note-body"
                       onChange={ (e) => setNote(e.target.value) }
                    ></textarea>
                  </div>
                  <button onClick={handleEdit} >Save </button>
                </div>
            </Modal>
        </div>
    )
}

export default Tile