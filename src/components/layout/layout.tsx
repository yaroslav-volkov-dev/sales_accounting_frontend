import { Outlet } from 'react-router-dom';
import { Header } from '@/components/header/header.tsx';
import { Container } from '@/components/container/container.tsx';

export const Layout = () => {
  return (
    <div className="h-screen flex flex-col gap-4">
      <Header />
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
    </div>
  );
};