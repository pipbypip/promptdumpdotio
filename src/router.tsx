import { createBrowserRouter, Navigate, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { About } from './pages/About';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Contact } from './pages/Contact';
import { PublicProfile } from './pages/PublicProfile';
import { Categories } from './pages/Categories';
import { CategoryPage } from './pages/CategoryPage';
import { SubcategoryPage } from './pages/SubcategoryPage';
import { ProfilePage } from './pages/ProfilePage';
import { Feed } from './pages/Feed';
import { Profile } from './pages/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';
import App from './App';

function ErrorPage() {
  const error = useRouteError();
  
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl text-foreground-secondary mb-6">Page not found</p>
            <a
              href="/"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go back home
            </a>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-xl text-foreground-secondary mb-6">
          Something went wrong. Please try again.
        </p>
        <a
          href="/"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'explore',
          element: <Explore />,
        },
        {
          path: 'about',
          element: <About />,
        },
        {
          path: 'privacy',
          element: <Privacy />,
        },
        {
          path: 'terms',
          element: <Terms />,
        },
        {
          path: 'contact',
          element: <Contact />,
        },
        {
          path: 'u/:username',
          element: <PublicProfile />,
        },
        {
          path: 'categories',
          element: <Categories />,
        },
        {
          path: 'category/:categoryId',
          element: <CategoryPage />,
        },
        {
          path: 'category/:categoryId/:subcategoryId',
          element: <SubcategoryPage />,
        },
        {
          path: 'profile',
          element: <ProfilePage />,
        },
        {
          path: 'feed',
          element: (
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          ),
        },
        {
          path: 'profile',
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: '*',
          element: <Navigate to="/" replace />,
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);
