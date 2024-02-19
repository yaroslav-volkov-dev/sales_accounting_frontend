import { createBrowserRouter } from 'react-router-dom';
import { MainPage } from '../pages/MainPage/MainPage.jsx';
import { Layout } from '../components/Layout/Layout.jsx';

export const router = createBrowserRouter([
  {
    element: <Layout/>,
    path: '/',
    children: [
      {
        index: true,
        element: <MainPage/>,
      },
      {
        path: '/edit-database',
        element: <h1> /edit-database </h1>,
      },
      {
        path: 'categories/:slug',
        element: <h1> /edit-database </h1>,
      },
    ]
  },
  {
    path: '*',
    element: <h1>Not found</h1>
  }
]);
