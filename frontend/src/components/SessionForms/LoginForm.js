import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './SessionForm.module.css';
import { login, clearSessionErrors } from '../../store/session';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const errors = useSelector(state => state.errors.session);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(clearSessionErrors());
        };
    }, [dispatch]);

    const update = (field) => {
        const setState = field === 'email' ? setEmail : setPassword;
        return e => setState(e.currentTarget.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    }

    const loginDemoUser = (e) => {
        e.preventDefault();
        dispatch(login({ email: 'demo1@user.io', password: 'password' }));
    }

    return (
        <div className='login-page'>
            <form className={styles.sessionForm} onSubmit={handleSubmit}>
                <h2 id={styles.header}>Log In Form</h2>
                <div className="errors">{errors?.email}</div>
                <label>
                    <input 
                        className={styles.inputFields}
                        type="text"
                        value={email}
                        onChange={update('email')}
                        placeholder="Email"
                    />
                </label>
                <div className="errors">{errors?.password}</div>
                <label>
                    <input
                        className={styles.inputFields} 
                        type="password"
                        value={password}
                        onChange={update('password')}
                        placeholder="Password"
                    />
                </label>
                <br />
                <input
                    className={styles.sessionStartButton}
                    type="submit"
                    value="Log In"
                    disabled={!email || !password}
                />
            </form>
            <br />
            <button  className={styles.sessionStartButton} onClick={ loginDemoUser }>Demo User</button>
        </div>
    );
}

export default LoginForm;