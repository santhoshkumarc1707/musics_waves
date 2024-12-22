import { useSelector } from 'react-redux';

function Display() {
    const { albumsData } = useSelector(state => state.player);

    return (
        <div className="display-container">
            {albumsData.map(album => (
                <div key={album._id}>{album.name}</div>
            ))}
            {console.log(albumsData) }
        </div>
    );
}

export default Display;
