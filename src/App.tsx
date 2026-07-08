import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InvitationPage from './pages/InvitationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/demo-wedding" replace />} />
        <Route path="/:invitationSlug" element={<InvitationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
