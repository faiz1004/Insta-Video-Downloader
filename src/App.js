import { useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoData, setVideoData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState('');
  const [videoQualities, setVideoQualities] = useState([]);
  const [error, setError] = useState('');

  const getApidata = async () => {
    if (!videoUrl) {
      setError('Please enter a valid Instagram video URL.');
      return;
    }

    const options = {
      method: 'GET',
      url: 'https://social-media-video-downloader.p.rapidapi.com/smvd/get/instagram',
      params: {
        url: videoUrl,
        filename: 'download'
      },
      headers: {
        'x-rapidapi-key':'6b697e1e85msh6cdba57dcc6d5ffp1e92bfjsn5b12ec5a16fe',
        'x-rapidapi-host': 'social-media-video-downloader.p.rapidapi.com'
      }
    };

    try {
      setIsLoading(true);
      setError(''); // Reset error state
      const response = await axios.request(options);

      if (response.data.success) {
        setVideoData(response.data);
        setThumbnail(response.data.picture);
        const qualities = response.data.links.map(link => ({
          quality: link.quality,
          url: link.link
        }));
        setVideoQualities(qualities);
      } else {
        setError('Failed to retrieve video. Please check the URL and try again.');
      }
      setIsLoading(false);
    } catch (error) {
      setError('An error occurred while fetching data. Please try again later.');
      setIsLoading(false);
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-transparent min-h-screen flex flex-col items-center">
      <p className='flex gap-2 items-center mb-6'>
        <img className='h-8' src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png" alt="Instagram Icon" />
        <span className='text-lg font-semibold text-white-600'>Open in Instagram</span>
      </p>
      <div className="w-full max-w-md bg-white shadow-md rounded p-6">
        <h1 className="text-center text-2xl font-bold mb-4">Instagram Reels Downloader</h1>
        <input
          type="text"
          value={videoUrl}
          className='w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
          placeholder='Enter Instagram video URL'
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
          onClick={getApidata}
        >
          {isLoading ? 'Loading...' : 'Download Video'}
        </button>
        {error && <div className='mt-4 text-red-500 text-center'>{error}</div>}
        {videoData && !error && (
          <div className='mt-6'>
            <img src={thumbnail} alt="Video Thumbnail" className='w-full h-40 object-cover rounded mb-4' />
            <div className='space-y-4'>
              {videoQualities.map((video, index) => (
                <div key={index} className='flex justify-between items-center p-2 border border-gray-300 rounded'>
                  <h3 className='text-gray-700'>{video.quality}</h3>
                  <a href={video.url} target='_blank' rel='noreferrer' className='bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-300'>Download</a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
