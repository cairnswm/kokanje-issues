import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { IssueProvider } from './contexts/issuecontext';
import Navigation from './components/navigation';
import Home from './pages/home';
import List from './pages/list';
import Edit from './pages/edit';
import CreateIssue from './pages/createissue';
import { accessElf } from './functions/accessElf';
import { REACT_APP_ACCESSELF_API } from './env.js';

console.log(REACT_APP_ACCESSELF_API);
accessElf.setApiKey(REACT_APP_ACCESSELF_API);

const Layout = ({ children }) => (
  <>
    <Navigation />
    {children}
  </>
);

const App = () => {
  // Determine the basename based on environment
  const basename = useMemo(() => {
    return process.env.NODE_ENV === 'production' ? '/kokanje' : '/';
  }, []);

  return (
    <IssueProvider>
      <Router basename={basename}>
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
