import type { Toast } from "@nuxt/ui/runtime/composables/useToast.js";
import { TNY360 } from "@tny-robotics/sdk";

let instance: Ref<TNY360 | undefined> = ref(undefined);
let connectionToast: Toast | null = null;

const addrMe = window?.location.hostname || 'localhost';

export const useTNY360 = (address: string = addrMe) => {
    const toast = useToast();
    
    if (!instance.value) {
        if (!connectionToast) {
            connectionToast = toast.add({
                title: 'Connecting to TNY-360',
                description: `Connecting to TNY-360 at ${address}...`,
                duration: 0, // Don't auto-dismiss
                color: 'primary',
            });
        } else {
            toast.update(connectionToast.id, {
                description: `Connecting to TNY-360 at ${address}...`,
            });
        }

        instance.value = new TNY360(address);
        instance.value.connect().then(() => {
            console.log('Connected to TNY-360');
            if (connectionToast) {
                toast.update(connectionToast.id, {
                    description: `Connected to TNY-360 at ${address} !`,
                    color: 'success',
                    duration: 2000, // Auto-dismiss after 2 seconds
                });
            }
            if (address !== 'localhost') {
                storeFallbackIP(address);
            }
        }).catch((error : Error) => {
            instance.value = undefined;
            console.error(`Failed to connect to TNY-360 at ${address}:`, error);
            if (address === addrMe || address === getFallbackIP()) {
                const ip = (address === getFallbackIP() || getFallbackIP() === null)
                    ? (window?.prompt(`Failed to connect to TNY-360 at ${address}. Please enter the robot IP address:`, '')?.trim() || '')
                    : getFallbackIP();
                if (ip) {
                    return useTNY360(ip);
                }
            }
            if (connectionToast) {
                toast.update(connectionToast.id, {
                    title: 'Connection Failed',
                    description: `Failed to connect to TNY-360 at ${address}`,
                    color: 'error',
                    duration: 4000, // Auto-dismiss after 4 seconds
                });
            }
        });
    }
    return instance;
}

function getFallbackIP() {
    return window?.localStorage.getItem('fallback_ip');
}

function storeFallbackIP(ip: string) {
    window?.localStorage.setItem('fallback_ip', ip);
}