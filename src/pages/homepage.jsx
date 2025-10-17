import React from 'react';
import { useState, useEffect } from 'react';
import styles from './homepage.module.css';
import ReactMarkdown from 'react-markdown';


export default function homepage() {

      const [profile, setProfile] = useState(null);
  const [readmeContent, setReadmeContent] = useState('');
  
  // Unified loading and error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchGitHubProfile() {
      const username = 'Brittany-Potato';
      
      try {
        // Fetch both the user profile data AND the README data in parallel
        const [profileResponse, readmeResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(`https://api.github.com/repos/${username}/${username}/readme`)
        ]);

        if (!profileResponse.ok) throw new Error('Failed to fetch GitHub profile.');
        if (!readmeResponse.ok) throw new Error('Failed to fetch GitHub README.');

        const profileData = await profileResponse.json();
        const readmeData = await readmeResponse.json();
        
        // Decode the README content from Base64
        const decodedReadme = b64_to_utf8(readmeData.content);

        // Update state with both pieces of data
        setProfile(profileData);
        setReadmeContent(decodedReadme);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubProfile();
  }, []); // Empty array ensures this runs only once on mount

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

    return (
        <div>
            <div className={styles.titleDiv}>
                <h2 className={styles.title}>BrittanyIT - Tato Codes</h2>
            </div>
            <div className={styles.cardParent}>
                            <div className={styles.cardOneDiv}>
                <h3 className={styles.techStackTitle}>Tech Stack</h3>
                {/* ~~~ LANGUAGES ~~~ */}
                <div className={styles.techstackListDiv}>
                    <ul>
                        <p>Languages</p>
                        <li>
                            JavaScript
                        </li>
                        <li>
                            Python
                        </li>
                        <li>
                            Html
                        </li>
                        <li>
                            CSS
                        </li>
                    </ul>
                </div>
                <div className={styles.techstackListDiv}>
                    <ul>
                        <p>Frontend & Backend Libraries</p>
                        <li>
                            React.js
                        </li>
                        <li>
                            Node.js
                        </li>
                    </ul>
                </div>
                <div className={styles.techstackListDiv}>
                    <ul>
                        <p>Databases</p>
                        <li>
                            NoSQL: MongoDB
                        </li>
                        <li>
                            SQL: MySQL
                        </li>
                        <li>
                            Familiar with Vector Databases
                        </li>
                    </ul>
                </div>
                <div className={styles.techstackListDiv}>
                    <ul>
                        <p>AI & Bot Development</p>
                        <li>
                            Discord.js
                        </li>
                        <li>
                            Tmi.js
                        </li>
                        <li>
                            Gemini SDK
                        </li>
                    </ul>
                </div>
                <div className={styles.techstackListDiv}>
                    <ul>
                        <p>Cloud & AI platforms</p>
                        <li>
                            Microsoft Azure
                        </li>
                    </ul>
                </div>
                <div className={styles.techstackListDiv}>
                    <ul>
                        <p>Version Control</p>
                        <li>
                            Git
                        </li>
                        <li>
                            Github
                        </li>
                    </ul>
                </div>
                <div className={styles.techstackListDiv}>
                    <ul>
                        <p>Developer Tools</p>
                        <li>
                            Postman
                        </li>
                    </ul>
                </div>
            </div>
                    <div className={styles.cardTwo}>
          <div className={styles.cardTwoInsdeDiv}>
            {loading && <p>Loading GitHub Profile...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && profile && (
              // This is the main "window" container
              <div className={styles.githubContentContainer}>
                
                {/* --- Profile Header Section --- */}
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

                {/* --- README Section --- */}
                <div className={styles.readmeContainer}>
                  <ReactMarkdown>{readmeContent}</ReactMarkdown>
                </div>

              </div>
            )}
          </div>
        </div>
            </div>
        </div>
    )
}
