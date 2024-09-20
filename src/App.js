import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideoPlaybackScreen from './component/VideoPlaybackScreen';
import ListingScreen from './component/ListingScreen';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ListingScreen />} />
        <Route path="/video/:id" element={<VideoPlaybackScreen />} />
      </Routes>
    </Router>

  );
}

export default App;
