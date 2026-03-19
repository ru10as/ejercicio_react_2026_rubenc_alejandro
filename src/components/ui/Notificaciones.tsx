import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notificaciones = () => {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      // Aquí puedes meterle vuestro color turquesa al estilo global
      toastStyle={{ border: '1px solid #2d9d9d' }} 
    />
  );
};

export default Notificaciones;