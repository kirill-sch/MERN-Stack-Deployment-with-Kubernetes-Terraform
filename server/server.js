import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from "./model/User.js";
import Charachter from "./model/Character.js";
import Dislike from "./model/Dislike.js";
import Like from "./model/Like.js";
import Setting from "./model/Setting.js";
import Match from './model/Match.js';

dotenv.config({
    path: ['.env.local', '.env']
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(express.json());

const url = process.env.MONGODB_STRING;

await mongoose.connect(url);

//Endpoints go here

// USER

app.get('api/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (e) {
        res.status(500).json({ error: 'An error occured while retrieving users.' });
    }
});

app.post('/api/user', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await User.findOne({ username: username })

        if (!user) {
            return res.json({ userFound: false, succeeded: false })
        }

        if (user.password === password) {
            res.json({ userFound: true, succeeded: true, user: user })
        } else {
            res.json({ userFound: true, succeeded: false })
        }
    } catch (e) {
        res.status(500).json({ error: `An error occured while trying to retrieve log in data for: ${username}.` })
    }
})

app.post('/api/users', async (req, res) => {
    try {
        const { username, password, email, firstName, lastName, profilePicture } = req.body;
        const createdAt = Date.now();

        const alreadyExistedUsers = user.find({})

        alreadyExistedUsers.map(existingUser => {

            if (username === existingUser.username) {
                res.status(500).json({error_message: "Username already exists!"})
                return;
            } else if (email === existingUser.email) {
                res.status(500).json({error_message: "Email address already registered!"})
                return;
            }
        })


        const user = await new User({
            firstName,
            lastName,
            username,
            password,
            email,
            profilePicture,
            createdAt
        }).save();

        res.status(201).json(user);
    } catch (e) {
        res.status(500).json({ error: 'An error occured while trying to save the user.' })
    }
})

app.delete('/api/user/:user_id', async (req, res) => {
    const userId = req.params.user_id;

    try {
        const user = await User.findByAndDelete(userId);

        if (!user) {
            return res.status(404).json({ error: `User with id: ${userId}, not found.` });
        }

        res.status(200).json({ message: `User with id: ${userId}, successfully deleted.` })
    } catch (e) {
        res.status(500).json({ error: `An error occured while deleting user with id: ${userId}.` })
    }
})

app.put('/api/user/:user_id', async (req, res) => {
    const userId = req.params.user_id;
    const updates = req.body;

    try {
        const updatedUserDocument = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true });

        if (updatedUserDocument) {
            res.status(200).json({ message: `Updated user: ${updatedUserDocument}` })
        } else {
            res.status(404).json({ error: `User not found with id: ${userId}.` });
        }
    } catch (e) {
        res.status(500).json({ error: `An error occured while updating user with id: ${userId}.` })
    }
})

// CHARACTERS

app.get('/api/characters/races', async (req, res) => {
    const userPreferences = req.body.preferences;

    try {
        const filteredCharacters = await Charachter.find({ race: { $in: userPreferences } });

        res.status(200).json(filteredCharacters)
    } catch (e) {
        res.status(500).json({ error: `An error occured while trying to find characters by preferences: ${userPreferences}.` });
    }
})

// LIKES

app.get('/api/likes/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const likes = await Like.find({ likedBy: username });

        res.status(200).json(likes);
    } catch (e) {
        res.status(500).json({ error: `An error occured while trying to find the likes of user: ${username}.` })
    }
})

app.post('/api/likes', async (req, res) => {
    try {
        const { likedBy, likedCharacterId } = req.body;
        const likedAt = Date.now();

        const like = await new Like({
            likedBy,
            likedCharacterId,
            likedAt
        }).save();
        res.status(201).json(like);
    } catch (e) {
        res.status(500).json({ error: `An error occured while trying to save like.` })
    }
})

app.delete('/api/likes/:like_id', async (req, res) => {
    const like_id = req.params.username;

    try {
        const like = Like.findOneAndDelete({ _id: like_id });

        if (!like) {
            res.status(404).json({ error: `Like with id: ${like_id}, not found.` })
        }

        res.status(200).json({ message: `Like with id: ${like_id}, successfully deleted.` })
    } catch (e) {
        res.status(500).json({ error: `An error occured while deleting like with id: ${like_id}.` })
    }
})

// DISLIKES

app.get('/api/dislikes/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const dislikes = await Dislike.find({ dislikedBy: username });

        res.status(200).json(dislikes);
    } catch (e) {
        res.status(500).json({ error: `An error occured while trying to find the dislikes of user: ${username}.` })
    }
})

app.post('/api/dislikes', async (req, res) => {
    try {
        const { dislikedBy, dislikedCharacterId } = req.body;
        const dislikedAt = Date.now();

        const dislike = await new Dislike({
            dislikedBy,
            dislikedCharacterId,
            dislikedAt
        }).save();

        res.status(201).json(dislike);
    } catch (e) {
        res.status(500).json({ error: `An error occured while trying to save dislike.` })
    }
})

app.delete('/api/dislikes/:dislike_id', (req, res) => {
    const dislike_id = req.params.username;

    try {
        const dislike = Dislike.findOneAndDelete({ _id: dislike_id });

        if (!dislike) {
            res.status(404).json({ error: `Dislike with id: ${dislike_id}, not found.` })
        }

        res.status(200).json({ message: `Dislike with id: ${dislike_id}, successfully deleted.` })
    } catch (e) {
        res.status(500).json({ error: `An error occured while deleting dislike with id: ${dislike_id}.` })
    }
})

// MESSAGES


// SETTINGS

app.get('/api/settings/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const settings = await Setting.find({ username: username });

        res.status(200).json(settings);
    } catch (e) {
        res.status(500).json({ error: `An error occured while trying to find the settings for: ${username}.` });
    }
})

app.put('/api/settings/:username', async (req, res) => {
    const username = req.params.username;
    const newSetting = req.body;

    try {
        const updatedSettingsDocument = await Setting.findOneAndUpdate({ username: username }, { $set: newSetting }, { new: true });

        if (updatedSettingsDocument) {
            res.status(200).json({ message: `Updated users settings: ${username}.` });
        } else {
            res.status(404).json({ error: `Username not found: ${username}.` })
        }
    } catch (e) {
        res.status(500).json({ error: `An error occured while trying to update settings for: ${username}.` })
    }
})

app.delete('/api/settings/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const setting = Setting.findOneAndDelete({ username: username })

        if (!setting) {
            res.status(404).json({ error: `Settings for: ${username}, not found.` })
        }
        res.status(200).json({ message: `Settings successfully deleted for: ${username}.` })
    } catch (e) {
        res.status(500).json({ error: `An error occured while deleting settings for: ${username}.` })
    }
})

app.post('/api/settings', async (req, res) => {
    try {
        const { prefAge, prefGender, prefRace, prefJob, prefOrigin } = req.body;

        const setting = await new Setting({
            prefAge,
            prefGender,
            prefRace,
            prefJob,
            prefOrigin
        }).save();

        res.status(201).json(setting);
    } catch (e) {
        res.status(500).json({ error: `An error occured while trying to save settings.` })
    }
})

// MATCHES

app.get('/api/matches/:username', async (req, res) => {
    const username = req.params.username;

    try {
        const matches = await Match.find({ username: username });

        res.status(200).json(matches);
    } catch (e) {
        res.status(500).json({ error: `An error occured while trying to find the matches for: ${username}.` });
    }
})

app.post('/api/matches', async (req, res) => {
    try {
        const { username, charactersId } = req.body;
        const matchedAt = Date.now();

        const match = await new Match({
            username,
            charactersId,
            matchedAt
        }).save();

        res.status(201).json(match);
    } catch (e) {
        res.status(500).json({ error: `An error occured while trying to save matches.` })
    }
})


//GET endpoint to list all available profile pictures
app.get('/api/images', (req, res) => {
    const imagesDir = path.join(__dirname, '../client/public/assets/images/default_profiles');
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Unable to scan directory' });
        }
        // Filter for image files only
        const imageFiles = files.filter(file => /\.(webp|png|jpg|jpeg)$/.test(file));
        res.json(imageFiles);
    });
});

app.listen(3000, () => console.log('Server started on http://localhost:3000'));