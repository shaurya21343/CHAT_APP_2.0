import React from 'react'
import useAuthStore from './store/auth-store'
import LogoutUserPage from './pages/Logout-user-page'
import HomePage from './pages/home-page'

const App : React.FC = () => {
  const { checkAuth } = useAuthStore();

  React.useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  const { user } = useAuthStore();
  console.log(user?.username);

  if (user) {
    return (
      <HomePage />
    )
  } else
  return (
    <LogoutUserPage />
  )
}

export default App