import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideoPlaybackScreen from './component/VideoPlaybackScreen';
// import { Provider } from 'react-redux'
// import store from './redux/store'
import ListingScreen from './component/ListingScreen';


function App() {
  return (
    // <Provider store={store}>
    //   <div className="App">
    //     <ListingScreen/>
    //   </div>
    // </Provider>
    <Router>
      <Routes>
        <Route path="/" element={<ListingScreen />} />
        <Route path="/video/:id" element={<VideoPlaybackScreen />} />
      </Routes>
    </Router>

  );
}

export default App;
