import { useState } from "react";
import LoginForm from "./LoginForm";
import { Modal } from "../../context/Modal";
import SignupForm from "./SignupForm";


const LoginFormModal = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);

    return (
        <div>
            <button onClick= { () => setShowLoginModal(true) }>Login</button>
            {showLoginModal && <Modal onClose={ () => setShowLoginModal(false) } ><LoginForm/></Modal>}
        </div>
    )
}

export const SignupFormModal = () => {
    const [showSignupModal, setShowSignupModal] = useState(false);

    return (
        <div>
            <button onClick={() => setShowSignupModal(true)}>Sign Up</button>
            {showSignupModal && <Modal onClose={() => setShowSignupModal(false)} ><SignupForm /></Modal>}
        </div>
    )

}


export default LoginFormModal;