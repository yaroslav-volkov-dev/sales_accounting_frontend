import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Toaster } from 'sonner'
import { queryClient } from './api/global-config.ts'
import { router } from './router/router.tsx'

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ToastContainer />
      <Toaster richColors closeButton />
    </QueryClientProvider>
  )
}
