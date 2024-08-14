import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from "./model/User.js";
import Charachter from "./model/Character.js";
import Dislike from "./model/Dislike.js";
import Like from "./model/Like.js";
import Setting from "./model/Setting.js";

dotenv.config({
    path: ['.env.local', '.env']
});


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

app.get('/api/user', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user = await User.findOne({ username: username })

        if (!user) {
            return res.json({ userFound: false, succeeded: false })
        }

        if (user.password === password) {
            res.json({ userFound: true, succeeded: true })
        } else {
            res.json({ userFound: true, succeeded: false })
        }
    } catch (e) {
        res.status(500).json({ error: `An error occured while trying to retrieve log in data for: ${username}.` })
    }
})

app.post('/api/user', async (req, res) => {
    try {
        const { username, password, email, firstName, lastName} = req.body;
        const createdAt = Date.now();
        const user = await new User({
            username,
            password,
            email,
            firstName,
            lastName,
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
        const { likedBy, likedCharacter } = req.body;
        const likedAt = Date.now();

        const like = await new Like({
            likedBy,
            likedCharacter,
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
        const { dislikedBy, dislikedCharacter } = req.body;
        const dislikedAt = Date.now();

        const dislike = await new Dislike({
            dislikedBy,
            dislikedCharacter,
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
    const body = req.body;

    try {
        const prefAge = body.prefAge;
        const prefGender = body.prefGender;
        const prefRace = body.prefRace;
        const prefJob = body.prefJob;
        const prefOrigin = body.prefOrigin;

        const setting = new Setting({
            prefAge,
            prefGender,
            prefRace,
            prefJob,
            prefOrigin
        })
        await setting.save();
        res.status(201).json(setting);
    } catch (e) {
        res.status(500).json({ error: `An error occured while trying to save settings.` })
    }
})

app.listen(3000, () => console.log('Server started on http://localhost:3000'));