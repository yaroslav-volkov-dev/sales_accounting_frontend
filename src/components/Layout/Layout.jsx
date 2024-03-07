import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header.jsx';
import { Container } from '../Container/Container.jsx';

export const Layout = () => {
  return (
    <div className="h-screen flex flex-col gap-4">
      <Header />
      <Container>
        <Outlet />
      </Container>
    </div>
  );
};