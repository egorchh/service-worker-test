import './App.css'
import toast, { Toaster } from "react-hot-toast";
import {useEffect} from "react";
import { useAppUpdateBanner } from "./useAppUpdateBanner.tsx";

function App() {
    const { needRefresh, onUpdate } = useAppUpdateBanner();

    useEffect(() => {
        if (needRefresh) {
            toast.success((
                <div>
                    <p>Приложение обновилось, перезагрузите страницу</p>
                    <button onClick={onUpdate}>Обновить</button>
                </div>
            ), { duration: 10000 });
        }
    }, [needRefresh, onUpdate])

  return (
    <>
      <h1>Service Worker Update TEST 6</h1>
        <Toaster />
    </>
  )
}

export default App
