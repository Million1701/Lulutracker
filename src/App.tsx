import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PetProfile from './pages/PetProfile';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import PetForm from './components/PetForm';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';
import QRSuccess from './pages/QRSuccess';
import LocationReportsDashboard from './pages/LocationReportsDashboard';

function App() {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (
          event === 'SIGNED_IN' &&
          session?.user &&
          !localStorage.getItem('user_created')
        ) {
          await supabase.from('users').upsert(
            {
              id: session.user.id,
              email: session.user.email,
            },
            { onConflict: 'id' }
          );
          localStorage.setItem('user_created', 'true');
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/new-pet" element={<PetForm />} />
                <Route
                  path="/dashboard/new-pet/qr_success"
                  element={<QRSuccess />}
                />
                <Route path="/location-reports" element={<LocationReportsDashboard />} />
              </Route>
              <Route path="/pet/:id" element={<PetProfile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
