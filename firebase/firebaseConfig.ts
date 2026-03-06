// 
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getDatabase, type Database } from "firebase/database";
import { getAnalytics, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBY5z4uU0OUlp9x_ZcaFRICSUe_42GwlOk",
  authDomain: "pelis-react-upna-ru-al.firebaseapp.com",
  databaseURL: "https://pelis-react-upna-ru-al-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "pelis-react-upna-ru-al",
  storageBucket: "pelis-react-upna-ru-al.firebasestorage.app",
  messagingSenderId: "429730876592",
  appId: "1:429730876592:web:f0ba5be35895a94bbbbf75",
  measurementId: "G-DHWQH7G0S0"
};

// Inicialización
const app: FirebaseApp = initializeApp(firebaseConfig);

// Exportación de servicios tipados
export const auth: Auth = getAuth(app);
export const db: Database = getDatabase(app);
export const analytics: Analytics = getAnalytics(app);

export default app;