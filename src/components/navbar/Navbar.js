import React from 'react'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import EmojiObjectsTwoToneIcon from '@material-ui/icons/EmojiObjectsTwoTone'
import {signout} from '../../apiCalls/auth'
import './navbar.scss'

const Navbar = (props) => {

    const handleSignout = () => {
        signout().then((res) => {
            console.log('success')
            props.setKeeps([])
            props.setOpen(true)
        })
        .catch((e) => console.log(e))
    }

    return(
        <div className="nav" >
            <span className="nav-title" >
                <EmojiObjectsTwoToneIcon style={{fontSize:"36"}} />
                <p >Keep</p>
            </span>
            <div className="logout" onClick={handleSignout}  >
                <ExitToAppIcon style={{fontSize:"36"}} />
            </div>
        </div>
    )
}

export default Navbar