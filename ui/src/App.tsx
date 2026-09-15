import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Triggers from './pages/Triggers';
import Concerns from './pages/Concerns';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/triggers" element={<Triggers />} />
        <Route path="/concerns" element={<Concerns />} />
      </Routes>
    </Router>
  );
}
