import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { GearPlanner } from './pages/GearPlanner';
import { GuildAnalytics } from './pages/GuildAnalytics';
import { TBPlanner } from './pages/TBPlanner';
import { TWPlanner } from './pages/TWPlanner';
import { GACPlanner } from './pages/GACPlanner';

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/gear-planner" element={<GearPlanner />} />
            <Route path="/guild-analytics" element={<GuildAnalytics />} />
            <Route path="/tb-planner" element={<TBPlanner />} />
            <Route path="/tw-planner" element={<TWPlanner />} />
            <Route path="/gac-planner" element={<GACPlanner />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
