
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); //for using environment variables 
const cors = require('cors');

dotenv.config();

const app = express();
// Middleware
app.use(cors()); //use cross origin resource system - frontend backend on different domains to talk

app.use(express.json());

app.use(express.static("public"));

// Anslut till databasen - använd anslutningssträng
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

// Create structure of the documents in the database collection. Document = each individual record
const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  file: { type: String, required: true },
  cover: { type: String, required: true }
}, { timestamps: true });

const Song = mongoose.model("song", songSchema); //creates a collection in the database that corresponds to the structure of songschema

// API endpoints for CRUD operations

// READ all songs from the server
app.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Create add new song to the server
app.post('songs', async ( req, res) => {

    try {
        const newSong = new Song(req.body);
        await newSong.save(); 
        res.status(201).json(newSong);
    }

    catch (err) {
        res.status(400).json({error: err.message})
    }
})

const port = 3000;

app.listen(port, () => {

    console.log(`Server is running on http://localhost:${port}`);
})

