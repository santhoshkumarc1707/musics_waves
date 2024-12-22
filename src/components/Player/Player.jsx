import { useDispatch, useSelector } from 'react-redux';
import { toggleMute, setVolume, toggleLoop, toggleShuffle, setPlayStatus } from '../store/playerSlice';

function Player() {
    const dispatch = useDispatch();
    const { track, playStatus, volume, isMuted, isLooping, isShuffle, time } = useSelector((state) => state.player);

    const handlePlayPause = () => {
        dispatch(setPlayStatus(!playStatus));
        if (playStatus) track?.audio.pause();
        else track?.audio.play();
    };

    return track ? (
        <div className="h-[10%] bg-black flex justify-between items-center text-white px-4">
            <div className="flex gap-4">
                <button onClick={() => dispatch(toggleShuffle())}>{isShuffle ? 'Shuffle' : 'No Shuffle'}</button>
                <button onClick={() => dispatch(toggleLoop())}>{isLooping ? 'Looping' : 'No Loop'}</button>
                <button onClick={handlePlayPause}>{playStatus ? 'Pause' : 'Play'}</button>
                <button onClick={() => dispatch(toggleMute())}>{isMuted ? 'Unmute' : 'Mute'}</button>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => dispatch(setVolume(parseFloat(e.target.value)))}
                />
                <div className="text-white">{time.currentTime.minute}:{time.currentTime.second.toString().padStart(2, '0')}</div>
            </div>
        </div>
    ) : null;
}

export default Player;

