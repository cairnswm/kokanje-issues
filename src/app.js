import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { IssueProvider } from './contexts/issuecontext';
import Navigation from './components/navigation';
import Home from './pages/home';
import List from './pages/list';
import Edit from './pages/edit';
import CreateIssue from './pages/createissue';

const Layout = ({ children }) => (
  <>
    <Navigation />
    {children}
  </>
);

const App = () => {
  return (
    <IssueProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CreateIssue />} />
          <Route path="/home" element={<Layout><Home /></Layout>} />
          <Route path="/list" element={<Layout><List /></Layout>} />
          <Route path="/edit/:id" element={<Layout><Edit /></Layout>} />
        </Routes>
      </Router>
    </IssueProvider>
  );
};

export default App;
