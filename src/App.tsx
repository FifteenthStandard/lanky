import {
  createBrowserRouter,
  Outlet,
  ScrollRestoration,
  RouterProvider,
} from 'react-router-dom';
import {
  colors,
  createTheme,
  Container,
  CssBaseline,
  ThemeProvider,
} from '@mui/material';
import {
  GeminiProvider,
  ToastProvider,
  VocabProvider,
} from './contexts';
import {
  Actions,
  Navigation,
  TestView,
  VocabView,
} from './views';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: colors.grey[100],
    },
  },
});

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: <VocabView />,
      },
      {
        path: 'test',
        element: <TestView />,
      }
    ],
  },
], {
  basename: '/lanky/',
});

export default function App() {
  return (
    <RouterProvider router={router} />
  );
};

function Layout() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ paddingTop: 2, paddingBottom: 2 }}>
        <GeminiProvider>
          <ToastProvider>
            <VocabProvider>
              <Outlet />
              <ScrollRestoration />
              <Actions />
              <Navigation />
            </VocabProvider>
          </ToastProvider>
        </GeminiProvider>
      </Container>
    </ThemeProvider>
  );
}
