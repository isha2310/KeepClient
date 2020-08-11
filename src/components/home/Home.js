import React, {useState, useEffect} from 'react'
import {Login, Signup, authenticate, isAuthenticated } from '../../apiCalls/auth'
import {getAllNotes, createNote} from '../../apiCalls/notes'
import Avatar from './assets/Avatar.svg'
import LoginPic from './assets/Login.svg'
import '../../../node_modules/react-responsive-modal/styles.css'
import { Modal } from "react-responsive-modal"
import {PropagateLoader} from "react-spinners"
import EmojiObjectsTwoToneIcon from '@material-ui/icons/EmojiObjectsTwoTone'
import { css } from "@emotion/core"
import {Alert} from '@material-ui/lab'
import Skeleton from '@material-ui/lab/Skeleton'
import './home.scss'
import Tile from '../tile/Tile'
import Navbar from '../navbar/Navbar'

const Home = () => {

    const override = css`
    display: block;
    margin-left:50%;
   `;

    const [open, setOpen] = useState(false)
    const [existingUser, setExistingUser] = useState('')
    const [password, setPassword] = useState('')
    const [title, setTitle] = useState('')
    const [note, setNote] = useState('')
    const [visible, setVisible] = useState(false)
    const [error, setError] = useState('')
    const [fetching, setFetching] = useState(false)
    const [keeps, setKeeps] = useState([])
    const [newUser, setNewUser] = useState(true)
    const [username, setUsername] = useState('')
    const [loading, setLoading] = useState(false)
    const [noteError, setNoteError] = useState(false)
 
    useEffect(() => {
        setOpen(true)
        if(localStorage.getItem('username') !== null) {
            setExistingUser(JSON.parse(localStorage.getItem('username')))
        }   
    },[])

    useEffect(() => {
        if(fetching) {
            const {user,token} = isAuthenticated()
            if(token){
                getAllNotes(user._id, token)
                .then((notes) => {
                    setKeeps(notes)
                    setFetching(false)
                })
                .catch((err) => console.log(err))
            }
        }
    },[fetching])
    
    const onCloseModal = () => {
        setOpen(false)
    }

    const handleSave = (e) => {
        e.preventDefault()
        const {user, token} = isAuthenticated()
        if(!token  || !user ){
            return setOpen(true)
        } else {
            setLoading(true)
            const notes = {
                title,
                note,
                userId: user._id
            }
            createNote(notes, user._id, token)
            .then((res) => {
                setLoading(false)
                setFetching(true)
                setTitle('')
                setNote('')
            })
            .catch((e) => {
                console.log(e)
            })
        }
    }

    const handleLogin = (e) => {
        e.preventDefault()
        setError(false)
        setLoading(true)
        if(localStorage.getItem('username') === null) {
            setExistingUser('')
        }  else {
            const user = {
                name: existingUser,
                password: password
            }
            console.log(user)
            Login(user).then((data) => {
                if(data.errors){
                    setError(data.errors)
                    setLoading(false)
                    console.log(error)
                } else {
                    authenticate((data), () => {
                        console.log(data)
                        setLoading(false)
                        setOpen(false)
                        setFetching(true)
                    })
                }
            })
            .catch((e) => console.log(e))
        }
    }

    const handleNewLogin = (e) => {
        e.preventDefault()
        setError(false)
        setLoading(true)
        const user = {
            name: username ,
            password: password
        }
        console.log(user)
        Login(user).then((data) => {
            console.log(data)
            if(data.errors){
                setError(data.errors)
                setLoading(false)
                console.log(error)
            } else {
                localStorage.setItem('userId', JSON.stringify(data.user._id ))
                localStorage.setItem('username', JSON.stringify(data.user.name))
                authenticate((data), () => {
                    console.log(data)
                    setLoading(false)
                    setOpen(false)
                    setFetching(true)
                    setExistingUser(data.user.name)
                })
            }
        })
        .catch((e) => console.log(e))
    }

    const handleSignup = (e) => {
        e.preventDefault()
        setError(false)
        setLoading(true)
        const user = {
            name: username ,
            password: password
        }
        console.log(user)
        Signup(user).then((data) => {
            console.log(data)
            if(data.errors){
                setError(data.errors)
                setLoading(false)
                console.log(error)
            } else {
                localStorage.setItem('userId', JSON.stringify(data.user._id ))
                localStorage.setItem('username', JSON.stringify(data.user.name))
                authenticate((data), () => {
                    setLoading(false)
                    setOpen(false)
                    setFetching(true)
                    setExistingUser(data.user.name)
                })
            }
        })
        .catch((e) => console.log(e))
    }

    const Flash = () => {
        if(error){
            return  <Alert severity="error"><span className="flash">{error}</span></Alert>
        }
        if(loading === true){
            return <PropagateLoader
            css={override}
            size={12}
            color={"#bf2742"}
            loading={loading}
          />
        }
    }

    const FlashNote = () => {
        if(noteError){
            return  <Alert severity="error"><span className="flash">{noteError}</span></Alert>
        }
        if(loading === true){
            return <PropagateLoader
            css={override}
            size={12}
            color={"#bf2742"}
            loading={loading}
          />
        }
    }

    return (
        <div>
            <Navbar setOpen={setOpen} setKeeps={setKeeps} />
            <div className="note-container" >
                <div className="note" >
                    <div>
                        <input 
                            placeholder="Title"
                            maxLength="20"
                            cols="10"
                            className="title"
                            autoFocus
                            onChange={ (e) => setTitle(e.target.value) }
                        />
                    </div>
                    <div>
                        <textarea 
                            placeholder="Your note."
                            maxLength="300"
                            cols="30"
                            rows="5"
                            className="note-body"
                           onChange={ (e) => setNote(e.target.value) }
                        ></textarea>
                    </div>
                    {FlashNote()}
                    <button onClick={handleSave} className="btn" >Save </button>
                </div>
            </div>

            {
                keeps.length === 0 ?
                    <div className="no-keep" >
                        <EmojiObjectsTwoToneIcon style={{fontSize:150}} className="no-notes-icon"/>
                        <p>Your notes appear here.</p>
                        <p>A handy and easy to use app to manage your notes.</p>
                        <p></p>
                    </div>
                  :
                    <div>
                        {
                            fetching?
                              <div style={{width: '50vw'}} className="loading"  >
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                              </div>
                              :
                                keeps.map((keep, index) => {
                                    return <Tile keep={keep} setFetching={setFetching} setOpen={setOpen} key={index} />
                                })
                        }
                    </div>
            }

            <Modal open={open} onClose={onCloseModal} center >
                { existingUser ? 
                    <div className="modal" >
                        <h3>Tap on image to login</h3>
                        <img 
                          src={LoginPic} 
                          alt="" 
                          className="avatar2" 
                          onClick={ (e) => setVisible(true) } />
                          {Flash()}
                        {visible &&
                            <div>
                                <input 
                                  placeholder="5 digit password." 
                                  onChange={ (e) => setPassword(e.target.value)} 
                                  type="password" /><br/>
                                <button className="home-btn" onClick={handleLogin} >Login</button>
                            </div>
                        }
                        <p onClick = {(e) => setExistingUser(false)} >New User?<span>Signup!</span></p>
                    </div>
                    :
                    newUser? 
                      <div className="modal" >
                      <h3>An easy two step signup</h3>
                        <img src={Avatar} alt="" className="avatar" />
                        {Flash()}
                        <div>
                            <input 
                              placeholder="Username" 
                              onChange={(e) => setUsername(e.target.value)} /><br />
                            <input 
                              placeholder="5 digit password." 
                              onChange={ (e) => setPassword(e.target.value)} 
                              type="password" /><br/>
                            <button className="home-btn" onClick={handleSignup} >Signup</button>
                        </div>
                        <p onClick = {(e) => setNewUser(false)} >Already a user? <span>Sign in</span></p>
                      </div>
                      :
                      <div className="modal" >
                        <img src={Avatar} alt="" className="avatar" />
                        {Flash()}
                        <h3>Login</h3>
                        <div>
                            <input 
                              placeholder="Username" 
                              onChange={(e) => setUsername(e.target.value)} /><br />
                            <input 
                              placeholder="5 digit password." 
                              onChange={ (e) => setPassword(e.target.value)} type="password" /><br/>
                            <button className="home-btn" onClick={handleNewLogin} >Login</button>
                        </div>
                        <p onClick = {(e) => setNewUser(true)} >New User?<span>Signup!</span></p>
                      </div>
                }
            </Modal>
        </div>
    )
}

export default Home