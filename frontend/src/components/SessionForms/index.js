import { useState } from "react";
import LoginForm from "./LoginForm";
import { Modal } from "../../context/Modal";
import SignupForm from "./SignupForm";
import styles from './SessionForm.module.css'


const LoginFormModal = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <div id='login-modal'>
            <button id={styles.login} onClick= { () => setShowLoginModal(true) }>Login</button>
            {showLoginModal && <Modal onClose={ () => setShowLoginModal(false) } ><LoginForm/></Modal>}
        </div>
    )
}

export const SignupFormModal = () => {
    const [showSignupModal, setShowSignupModal] = useState(false);

    return (
        <div id='signup-modal'>
            <button id={styles.signUp} onClick={() => setShowSignupModal(true)}>Sign Up</button>
            {showSignupModal && <Modal onClose={() => setShowSignupModal(false)} ><SignupForm /></Modal>}
        </div>
    )

}


export default LoginFormModal;