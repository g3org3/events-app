import { pb } from './pb'
import Router from './Router'
import Login from './Login'

export default function App() {
  if (!pb.authStore.isValid) {
    return <Login />
  }
  
  return <Router />
}

