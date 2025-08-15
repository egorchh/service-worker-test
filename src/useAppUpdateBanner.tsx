import { useRegisterSW } from "virtual:pwa-register/react";

export function useAppUpdateBanner() {
    const {
        needRefresh: [needRefresh],
        updateServiceWorker,
        offlineReady: [offlineReady]
    } = useRegisterSW({
        onRegisteredSW(_url, reg) {
            const check = () => reg?.update();
            window.addEventListener("focus", check);
            document.addEventListener("visibilitychange", () => {
                if (!document.hidden) check();
            });
            check();
        }
    });

    const onUpdate = () => {
        updateServiceWorker(true); // skipWaiting + reload
        try {
            const bc = new BroadcastChannel("app-version");
            bc.postMessage({ type: "reload" });
            bc.close();
        } catch (error) {
            console.error(error);
        }
    };

    return {
        needRefresh,
        offlineReady,
        onUpdate
    };
}
