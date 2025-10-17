import React from 'react';
import { useState, useEffect, useRef } from 'react';
import styles from './homepage.module.css';
import ReactMarkdown from 'react-markdown';


export default function homepage() {
    const [profile, setProfile] = useState(null);
    const [readmeContent, setReadmeContent] = useState('');
    const [messages, setMessages] = useState([
        { author: 'bot', text: "Hi! I'm Fredrick. Ask me about Brittany's projects." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // State for GitHub profile
    const [profileLoading, setProfileLoading] = useState(true);
    const [profileError, setProfileError] = useState(null);

    // State for GitHub repos
    const [repos, setRepos] = useState([]);
    const [reposLoading, setReposLoading] = useState(true);
    const [reposError, setReposError] = useState(null);

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        async function fetchGitHubProfile() {
            const username = 'Brittany-Potato';
            try {
                const [profileResponse, readmeResponse] = await Promise.all([
                    fetch(`https://api.github.com/users/${username}`),
                    fetch(`https://api.github.com/repos/${username}/${username}/readme`)
                ]);

                if (!profileResponse.ok) throw new Error('Failed to fetch GitHub profile.');
                if (!readmeResponse.ok) throw new Error('Failed to fetch GitHub README.');

                const profileData = await profileResponse.json();
                const readmeData = await readmeResponse.json();
                const decodedReadme = b64_to_utf8(readmeData.content);

                setProfile(profileData);
                setReadmeContent(decodedReadme);

            } catch (err) {
                setProfileError(err.message);
            } finally {
                setProfileLoading(false);
            }
        }

        fetchGitHubProfile();
    }, []);

    useEffect(() => {
        const fetchRepos = async () => {
            const GITHUB_USERNAME = "brittany-potato";
            try {
                const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setRepos(data);
            } catch (err) {
                setReposError(err);
            } finally {
                setReposLoading(false);
            }
        };
        fetchRepos();
    }, []);

    function b64_to_utf8(str) {
        try {
            const decoded = decodeURIComponent(
                atob(str).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                    .join('')
            );
            return decoded;
        } catch (e) {
            console.error("Failed to decode Base64 string", e.message);
            return atob(str);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { author: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/fredrick', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const botMessage = { author: 'bot', text: data.reply };
            setMessages(prev => [...prev, botMessage]);

        } catch (err) {
            console.error("Error generating response from Gemini.", err);
            const errorMessage = { author: 'bot', text: "Sorry, I'm having a little trouble thinking right now." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className={styles.titleDiv}>
                <h2 className={styles.title}>BrittanyIT - Tato Codes</h2>
                <a className={styles.sendButtonCV} href="/documents/cv.pdf" download="cv.pdf" target="_blank" rel="noopner noreferrer">Resume Download</a>
            </div>
            <div className={styles.cardParent}>
                <div className={styles.cardOneDiv}>
                    <h3 className={styles.titleTechStack}>Tech Stack</h3>
                    <div className={styles.techstackListDiv}>
                        <ul>
                            <p>Languages</p>
                            <li>JavaScript</li>
                            <li>Python</li>
                            <li>Html</li>
                            <li>CSS</li>
                        </ul>
                    </div>
                    <div className={styles.techstackListDiv}>
                        <ul>
                            <p>Frontend & Backend Libraries</p>
                            <li>React.js</li>
                            <li>Node.js</li>
                        </ul>
                    </div>
                    <div className={styles.techstackListDiv}>
                        <ul>
                            <p>Databases</p>
                            <li>NoSQL: MongoDB</li>
                            <li>SQL: MySQL</li>
                            <li>Familiar with Vector Databases</li>
                        </ul>
                    </div>
                    <div className={styles.techstackListDiv}>
                        <ul>
                            <p>AI & Bot Development</p>
                            <li>Discord.js</li>
                            <li>Tmi.js</li>
                            <li>Gemini SDK</li>
                        </ul>
                    </div>
                    <div className={styles.techstackListDiv}>
                        <ul>
                            <p>Cloud & AI platforms</p>
                            <li>Microsoft Azure</li>
                        </ul>
                    </div>
                    <div className={styles.techstackListDiv}>
                        <ul>
                            <p>Version Control</p>
                            <li>Git</li>
                            <li>Github</li>
                        </ul>
                    </div>
                    <div className={styles.techstackListDiv}>
                        <ul>
                            <p>Developer Tools</p>
                            <li>Postman</li>
                        </ul>
                    </div>
                </div>
                <div className={styles.cardTwo}>
                    <div className={styles.cardTwoInsdeDiv}>
                        {profileLoading && <p>Loading GitHub Profile...</p>}
                        {profileError && <p>Error: {profileError}</p>}
                        {!profileLoading && !profileError && profile && (
                            <div className={styles.githubContentContainer}>
                                <div className={styles.profileHeader}>
                                    <img
                                        src={profile.avatar_url}
                                        alt="GitHub Avatar"
                                        className={styles.profileAvatar}
                                    />
                                    <div className={styles.profileInfo}>
                                        <h1 className={styles.profileName}>{profile.name}</h1>
                                        <p className={styles.profileLogin}>@{profile.login}</p>
                                        <p className={styles.profileBio}>{profile.bio}</p>
                                    </div>
                                </div>
                                <hr className={styles.divider} />
                                <div className={styles.readmeContainer}>
                                    <ReactMarkdown>{readmeContent}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.fredrickCard}>
                    <div className={styles.titleDivFredrick}>
                        <h2 className={styles.title}>AI Sir.Fredrick</h2>
                        <p className={styles.subtitle}>Have a chat! I know what Brittany offers, her skill set, stats and more!</p>
                    </div>
                    <div className={styles.chatWindow}>
                        {messages.map((msg, index) => (
                            <div key={index} className={styles[msg.author === 'bot' ? 'botMessage' : 'userMessage']}>
                                {msg.text}
                            </div>
                        ))}
                        {isLoading && <div className={styles.botMessage}><em>Thinking...</em></div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSubmit} className={styles.chatForm}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className={styles.chatInput}
                            disabled={isLoading}
                        />
                        <button type="submit" className={styles.sendButton} disabled={isLoading}>
                            Send
                        </button>
                    </form>
                </div>
                <div className={styles.projectsDiv}>
                    <h2 className={styles.title}>Projects</h2>
                    <h3 className={styles.titleSub}>Click to view Github Repositroy</h3>
                    {reposLoading && <p>Fetching my latest projects...</p>}
                    {reposError && <p>Oops! Couldn't fetch my projects.</p>}
                    {!reposLoading && !reposError && (
                        <ul className={styles.repoList}>
                            {repos.map(repo => (
                                <li key={repo.id} className={styles.repoItem}>
                                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className={styles.repoLink}>
                                        {repo.name}
                                    </a>
                                    <p className={styles.repoDescription}>{repo.description}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className={styles.contactDiv}>
                    <h2 className={styles.title}>Contact</h2>
                    <div className={styles.contactContent}>
                        <ul>
                            <li className={styles.listContact}>
                                LinkedIn: <a href="https://www.linkedin.com/in/brittany-cahill-carnaby-a85294124" target="_blank">Brittany Cahill-Carnaby</a>
                            </li>
                            <li className={styles.listContact}>
                                Github: <a href="https://github.com/Brittany-Potato" target="_blank">Brittany-Potato</a>
                            </li>
                            <li className={styles.listContact}>
                                Facebook Page: <a href="https://www.facebook.com/profile.php?id=61580483732248" target="_blank">BrittanyIT</a>
                            </li>
                            <li className={styles.listContact}>
                                Teams email: <a href="mailto:brittanycc@missionreadyhq.com" target="_blank">Brittany@missionready</a>
                            </li>
                            <li className={styles.listContact}>
                                Business email: <a href="mailto:brittanycc@missionreadyhq.com" target="_blank">BrittanyIT@gmail</a>
                            </li>
                        </ul>
                        <img src="/images/chester.jpg" alt="Chester" className={styles.contactImage}/>
                    </div>
                </div>
            </div>

        </div>
    );
}