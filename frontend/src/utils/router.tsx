import { createBrowserRouter, Navigate } from 'react-router';
import Cookies from 'js-cookie';

import { App, Auth, SignIn, SignUp, NotFound, Events } from '@/pages';

import { AppLayout } from '@/components';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = Cookies.get('token');

  if (!isAuthenticated) {
    return <Navigate to="/auth/in" replace />;
  }

  return children;
};

const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = Cookies.get('token');

  if (isAuthenticated) {
    return <Navigate to="/events" replace />;
  }

  return children;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'auth',
        element: (
          <AuthRoute>
            <Auth />
          </AuthRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="in" replace />,
          },
          {
            path: 'in',
            element: <SignIn />,
          },
          {
            path: 'up',
            element: <SignUp />,
          },
        ],
      },
      {
        path: 'account',
        element: (
          <PrivateRoute>
            <>Аккаунт</>
            {/* <Account /> */}
          </PrivateRoute>
        ),
      },
      {
        path: 'events',
        element: (
          <PrivateRoute>
            <Events />
          </PrivateRoute>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
