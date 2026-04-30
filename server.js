
const express = require('express'); //API framework, simplies creation of HTTP servers, provides middleware and API rutes
const mongoose = require('mongoose'); // simpliefies querybuilding to mongodb databases Song.find() e.g and allows creating document schemas
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

// Create structure of the documents in the database collection. Document = each individual record. Documents are store as JSON objects.
const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  genre: { type: String, required: true},
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
app.post('/songs', async ( req, res) => {

    try {
        const newSong = new Song(req.body);
        await newSong.save(); 
        res.status(201).json(newSong);
    }

    catch (err) {
        res.status(400).json({error: err.message})
    }
})

// UPDATE SONG
app.put('/songs/:id', async (req, res) => {
  try {
    const updated = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.json(updated);

  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

//APIs for testing with Postman client 
app.get('/house', async (req, res) => {

  try {
    const houseMusic = await Song.find({ genre: "House" });
    res.json(houseMusic);
  }
  catch (err) {
    res.status(400).json({ error: "Could not process request"})
  }
})


const port = 3000;

app.listen(port, () => {

    console.log(`Server is running on http://localhost:${port}`);
})

