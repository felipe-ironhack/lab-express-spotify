require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// require spotify-web-api-node package here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => res.render('index'));

app.get('/artist-search', (req, res) => {
  const { artist } = req.query

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      res.render('artist-search-result', {artists: data.body.artists.items})
    }, (error) => console.log(error))
    .catch(error => console.log('We got an error searching for the artist:', error))
});

app.get('/albums/:artistId' , (req, res) => {
  const { artistId } = req.params

  spotifyApi
    .getArtistAlbums(artistId)
    .then(data =>{
       res.render('albums', { albums: data.body.items, artist: data.body.items[0].artists[0].name })
    })
    .catch(error => console.log('Error getting the albums:', error))


})

app.get('/tracks/:albumId', (req, res) => {
  const { albumId } = req.params

  spotifyApi
    .getAlbumTracks(albumId)
    .then(data => {
      const info = {tracks: data.body.items}
      console.log(info)
      res.render('tracks', { tracks: data.body.items } )
    })
    .catch(error => console.log('Error getting the tracks:', error))


})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
