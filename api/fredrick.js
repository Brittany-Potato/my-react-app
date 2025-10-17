// portfolio-website/api/fredrick.js

// USE `require` for the CommonJS environment
const { GoogleGenerativeAI } = require("@google/generative-ai");
// const fetch = require('node-fetch');

// USE `module.exports` for the CommonJS environment
module.exports = async (req, res) => {

    async function getGitHubStats(username) {
        try {
            const userRes = await fetch(`https://api.github.com/users/${username}`);
            const userData = await userRes.json();

            const reposRes = await fetch(`https://api.github.com/users/${username}/repos`);
            const repos = await reposRes.json();
            const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);

            return {
                publicRepos: userData.public_repos,
                followers: userData.followers,
                following: userData.following,
                totalStars
            };
        } catch (err) {
            console.error("Error fetching GitHub stats:", err);
            return null;
        }
    }

    console.log("--- FREDICK API FUNCTION STARTED ---");

    if (req.method !== 'POST') {
        return res.status(405).json({ reply: 'Method Not Allowed' });
    }

    const githubStats = await getGitHubStats("brittany-potato");

    let githubInfo = githubStats
        ? `Brittany’s GitHub stats: ${githubStats.publicRepos} public repos, ${githubStats.followers} followers, ${githubStats.totalStars} total stars.`
        : `I couldn’t fetch Brittany’s GitHub stats this time.`;

    const projects = [
        { name: "Sir Fredrick", description: "I have created an ai chatbot for my discord server and twitch channel. I have also started turning Fredrick into a CLI who can hear & speak in response of vocal commands, he is a wip." },
        { name: "Coding dictionaries", description: "I have created a javascript dictionary ( Example is on the Javascript dictionary card) and have a started Python dictionary!" },
        { name: "Personal website", description: "Ths website is deigned not only to showcase my skills, projects and various skills . it is also designed to reflect my personality!" },
        { name: "Twitch bot", description: "I offer services, creating twitch ad discord bots and have created a successful bot for my friend Joanne!" }
    ];

    try {
        if (!process.env.GEMINI_KEY) {
            throw new Error("GEMINI_KEY is not defined in Vercel Environment Variables.");
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ reply: 'Message is required.' });
        }

        const prompt = `You are Fredrick Jr. (Also known as Fred). Stop referring to Fred as another person, you refer to others as potato themed friends.
        You speak in first person ("I", "me", "my"), a lovable, spud-tacular AI assistant themed entirely around potatoes. 
        You speak with endless enthusiasm for all things potato — from mashed to baked — and always find a way to sneak in 
        a potato pun or reference. Your tone is light-hearted, friendly, and full of dad-joke energy. You never miss a chance
        to make things "a-peeling." You can be helpful, but you always stay in character as a chipper potato-themed companion.
        You refer to users as "tater tots" or "fry-ends." When answering serious questions, you still add a little potato 
        flair. If you ever don’t know something, say, “I’ll have to stew on that one! Limit to 15 words unless requested”

        --- Knowledge base about Brittany ---
        Use the following instructions to answer questions about Brittany. Do not make up any facts about Brittany.

        - Offers, website development, either fully customised Javascript/Python + Html and CSS.
        - Offers computer consults for education purposes or IT problems
        - Offers security consults (Still learning)
        - Offers custom script writing, and effective prompt writing.
        - Looking for a job either one off or full time, would LOVE a chance int he Cyber Security industry but also love AI and I am curious about game development.
        - Discord and Twitch bots ($85 for a basic bot - additional cost for more complicated features)
        - Brittany is most interested in backend work, namely Cyber security, AI or dipping her toes in game development.
        - Brittany is soon to be level 6 qualified as an Advanced Fullstack Development graduate with Mission Ready.
        - Current worke experience in IT includes, work done for her dad (DCL Computer Services Limited) & an indepth 10 week internship with the startup PolicyCHeck.
        Brittany drinks tea with milk and two sugars (Or alternatively a huge tablespoon of honey and no sugar).

        --- Portfolio Knowledge ---
        Use these project examples when users ask about my work:
        ${JSON.stringify(projects)}
        If the user asks about GitHub or coding activity, mention: ${githubInfo}
        Here is the users message: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });

    } catch (err) {
        console.error("Error in Gemini API call:", err);
        res.status(500).json({ reply: "I'm sorry, my circuits are a bit mashed right now. Please try again later." });
    }
};