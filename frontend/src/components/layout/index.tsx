import { Outlet } from 'react-router';

import { Header } from '../header';

export const AppLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
