import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from '@/Contexts/ToastContext';
import { NotificationProvider } from "@/Contexts/NotificationContext";


const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
    const customPages = {
        'View/Landingpage': () => import('./Pages/View/landingpage.jsx'),
        'View/About': () => import('./Pages/View/about.jsx'),
        'View/LandingPageAnnouncement': () => import('./Pages/View/LandingPageAnnouncement.jsx'),
        'Services/Service': () => import('./Pages/Services/service.jsx'),
    };


    return customPages[name]
        ? customPages[name]()
        : resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx'));
    },

    setup({ el, App, props }) {
    const { auth } = props;
    const root = createRoot(el);
        root.render(
            <NotificationProvider user={auth?.user}>
                <ToastProvider>
                    <App {...props} />
                </ToastProvider>
            </NotificationProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

function App() {
    return (
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Layout>
    );
}

