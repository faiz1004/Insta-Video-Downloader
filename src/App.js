import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Ensure this file is properly configured

function App() {
  const [videoUrl, setVideoUrl] = useState('');
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Validate Instagram URL
  const validateUrl = (url) => {
    const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9-_]+/;
    return instagramRegex.test(url);
  };

  // Fetch video data from API
  const fetchVideoData = async () => {
    if (!videoUrl || !validateUrl(videoUrl)) {
      setError('Please enter a valid Instagram video URL.');
      return;
    }

    setError('');
    setIsLoading(true);

    const options = {
      method: 'POST',
      url: 'https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': '4ce8cbc9famshe201ae08f7b3b25p11de04jsn08d96a35f629', // Replace with your API key
        'x-rapidapi-host': 'social-download-all-in-one.p.rapidapi.com',
      },
      data: { url: videoUrl },
    };

    try {
      const response = await axios.request(options);

      if (response.data && response.data.medias?.length) {
        setVideoData({
          thumbnail: response.data.thumbnail || '',
          medias: response.data.medias,
        });
      } else {
        setError('No video data found. Please check the URL.');
      }
    } catch (err) {
      setError('An error occurred while fetching the video data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Download video function
  const downloadVideo = (url) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `video_${Date.now()}.mp4`;  // Ensure valid filename
    anchor.style.display = 'none';  // Hide the anchor
    document.body.appendChild(anchor);  // Append to body
    anchor.click();  // Trigger download
    document.body.removeChild(anchor);  // Remove anchor after download
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-md bg-white shadow-md rounded p-6">
        <h1 className="text-center text-2xl font-bold mb-4">Instagram Reels Downloader</h1>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter Instagram video URL"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={fetchVideoData}
          disabled={isLoading}
          className={`w-full p-2 rounded ${
            isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isLoading ? 'Fetching...' : 'Fetch Video'}
        </button>

        {error && <div className="mt-4 text-red-500">{error}</div>}

        {videoData && (
          <div className="mt-6">
            <img
              src={videoData.thumbnail}
              alt="Video Thumbnail"
              className="w-full h-40 object-cover rounded mb-4"
            />
            <div className="space-y-4">
              {videoData.medias.map((media, index) => (
                <div key={index} className="flex justify-between items-center p-2 border rounded">
                  <span className="text-gray-700">{media.quality}</span>
                  <button
                    onClick={() => downloadVideo(media.url)}  // Trigger download
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  >
                    Download
                  </button>
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
