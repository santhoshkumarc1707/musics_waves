import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    songsData: [],
    albumsData: [],
    originalSongsData: [],
    track: null,
    playStatus: false,
    isLooping: false,
    isShuffle: false,
    volume: 0.5,
    isMuted: false,
    time: {
        currentTime: { second: 0, minute: 0 },
        totalTime: { second: 0, minute: 0 }
    },
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setSongsData(state, action) {
            state.songsData = action.payload;
            state.originalSongsData = action.payload;
            state.track = action.payload[0];
        },
        setAlbumsData(state, action) {
            state.albumsData = action.payload;
        },
        setTrack(state, action) {
            state.track = action.payload;
        },
        setPlayStatus(state, action) {
            state.playStatus = action.payload;
        },
        toggleLoop(state) {
            state.isLooping = !state.isLooping;
        },
        toggleShuffle(state) {
            state.isShuffle = !state.isShuffle;
            if (state.isShuffle) {
                const shuffledSongs = [...state.songsData];
                for (let i = shuffledSongs.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffledSongs[i], shuffledSongs[j]] = [shuffledSongs[j], shuffledSongs[i]];
                }
                state.songsData = shuffledSongs;
            } else {
                state.songsData = state.originalSongsData;
            }
        },
        setVolume(state, action) {
            state.volume = action.payload;
            state.isMuted = action.payload === 0;
        },
        toggleMute(state) {
            state.isMuted = !state.isMuted;
            state.volume = state.isMuted ? 0 : 0.5;
        },
        setTime(state, action) {
            state.time = action.payload;
        },
    },
});

export const {
    setSongsData,
    setAlbumsData,
    setTrack,
    setPlayStatus,
    toggleLoop,
    toggleShuffle,
    setVolume,
    toggleMute,
    setTime,
} = playerSlice.actions;

export default playerSlice.reducer;
