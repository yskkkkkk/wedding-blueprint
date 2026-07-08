import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import InvitationPage from '@/pages/InvitationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/demo-wedding" replace />} />
          <Route path="/:invitationSlug" element={<InvitationPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
