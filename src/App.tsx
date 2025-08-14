import './App.css'
import toast, { Toaster } from "react-hot-toast";
import {useEffect, useState} from "react";

function App() {
    const [updateAvailable, setUpdateAvailable] = useState(false);

    useEffect(() => {
        const swUpdate = () => {
            setUpdateAvailable(true);
        };

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.addEventListener('controllerchange', swUpdate);
        }

        return () => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.removeEventListener('controllerchange', swUpdate);
            }
        };
    }, []);

    useEffect(() => {
        if (updateAvailable) {
            toast.success("Приложение обновилось, перезагрузите страницу", { duration: 30000 })
        }
    }, [updateAvailable])

  return (
    <>
      <h1>Service Worker Update TEST</h1>
        <Toaster />
    </>
  )
}

export default App
