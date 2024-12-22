
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppRouter from './AppRouter/AppRouter';

export const url = "http://localhost:3000";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <AppRouter />
     
    </div>
  )
}

export default App