# wavesense

Wavesense is a music visualizer and playlist manager using the youtube api.

# Functionality & MVP

- Music Player
- Music visualiser for on-page audio
- search to find new songs to play
- Playlist functionality
- Likes/favorites for top songs and playlists
- User sign-in to save and manage playlists
- Host live to Heroku
- production README

# Bonus Features
- interactive/game element that uses the sound data driving the visualizer

# Technologies & Technical Challenges

WaveSense will be build on the MERN stack  (MongoDB, Express, React, and Node)

We will be leveraging the youtube api as out source of audio content. 

The visualizer will be built using Threejs.

## Backend: MongoDB/Express

User preferences and playlists will be stored in a noSQL database.

### Models:
Users: stores basic auth information for the user and allows them to save their preferences for later use or use on other devices

Playlists: playlists each belong to one user and consist of links to the audio source

## Frontend: React/Node.js

Visualizer: Threejs will provide the visual context for the visualizer, using data provided by the Web Audio api.

UI: we don't want to interupt the listening experience, so all user-interaction should take place on the same page. We will be using React to allow the user to sign in and out and manipulate their palylists without leaving the playlist page. Once they're set up, the user should be able to get the UI out of the way and just enjoy the visualiser.

Daily Task Breakdowns

## Day 1
- User auth start **-May**
- Audio Library Familiarization/skeleton **-Kat**
- Youtube API **-Brian**
- Frontend Skeleton **-Will**

## Day 2
- Finish auth & set up playlists **-May**
- Build basic audio visualizer, test that audio given to the app can be used by basic visualizer element
- ablity to fetch single video from youtube and play in page
- Ensure backend information displays to frontend for styling

## Day 3
- Finalize user & playlist models
- Get youtube audio talking to visualizer element **-Brian & Kat**
- Style Style Style - Will

## Day 4
- Flex day. pair up onto any problems that are proving to be walls
- Host live

## Day 5
- UI polish
- Production Readme
- if hosting didn't work, figure out why and get it going