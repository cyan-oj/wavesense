import { useState, useEffect } from 'react';
import styles from './NavBar.module.css';
import githubIcon from './icons8-github-480.png'
import linkedInIcon from './icons8-linkedin-512.png'

const DeveloperMenu = () => {
    const [showDeveloperMenu, setShowDeveloperMenu] = useState(false);

    const openDeveloperMenu = () => {
        if (showDeveloperMenu) return;
        setShowDeveloperMenu(true);
    };

    useEffect(() => {
        if (!showDeveloperMenu) return;
        
        const closeDeveloperMenu = () => {
            setShowDeveloperMenu(false);
        };

        document.addEventListener('click', closeDeveloperMenu);

        return () => document.removeEventListener('click', closeDeveloperMenu);
    }, [showDeveloperMenu]);

    const developerLinks = (
        <ul id={styles.developerLinks}>
            <li>Kat Smith
                <a href="https://github.com/cyan-oj">
                    <img className={styles.githubLink} src={githubIcon} alt="github-logo" />
                </a>
                <a href="https://github.com/cyan-oj">
                    <img className={styles.linkedinLink} src={linkedInIcon} alt="linkedin-logo" />
                </a>
            </li>
            <li>Will Pierson
                <a href="https://github.com/willcpierson">
                    <img className={styles.githubLink} src={githubIcon} alt="github-logo" />
                </a>
                <a href="https://www.linkedin.com/in/will-pierson-63a86318a/">
                    <img className={styles.linkedinLink} src={linkedInIcon} alt="linkedin-logo" />
                </a>
            </li>
            <li>Brian Lam
                <a href="https://github.com/cb299792458">
                    <img className={styles.githubLink} src={githubIcon} alt="github-logo" />
                </a>
                <a href="https://www.linkedin.com/in/brian-lam-962ba833/">
                    <img className={styles.linkedinLink} src={linkedInIcon} alt="linkedin-logo" />
                </a>
            </li>
            <li> May Wu 
                <a href="https://github.com/maywu4">
                    <img className={styles.githubLink} src={githubIcon} alt="github-logo" />
                </a>
                <a href="https://www.linkedin.com/in/maywu4">
                    <img className={styles.linkedinLink} src={linkedInIcon} alt="linkedin-logo" />
                </a>
            </li>
        </ul>
    )

    return (
            <div>
            <button id={styles.aboutDevelopers} onClick={ openDeveloperMenu }>
                    <p>About the Developers</p>
                </button>
                { showDeveloperMenu && developerLinks }
            </div>
    )
}

export default DeveloperMenu;