
export interface Camera {
    id: string;
    label: string;
}

export interface AudioDevice {
    id: string;
    label: string;
}

/**
 * Requests camera and microphone permissions from the user.
 * It immediately stops the tracks to release the hardware, as we only need the permission grant.
 * @returns {Promise<boolean>} True if permissions were granted, false otherwise.
 */
export const requestPermissions = async (): Promise<boolean> => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // Stop all tracks immediately to release the camera/mic
        stream.getTracks().forEach(track => track.stop());
        return true;
    } catch (error) {
        console.error("Error requesting media permissions:", error);
        return false;
    }
};

/**
 * Enumerates all available video input devices (cameras).
 * Requires permissions to have been granted first to get detailed labels.
 * @returns {Promise<Camera[]>} A list of available cameras.
 */
export const getAvailableCameras = async (): Promise<Camera[]> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.warn("enumerateDevices() not supported.");
        return [];
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
        .filter(device => device.kind === 'videoinput')
        .map(device => ({
            id: device.deviceId,
            label: device.label || `Camera ${devices.filter(d => d.kind === 'videoinput').indexOf(device) + 1}`
        }));
};

/**
 * Enumerates all available audio input devices (microphones).
 * Requires permissions to have been granted first to get detailed labels.
 * @returns {Promise<AudioDevice[]>} A list of available microphones.
 */
export const getAvailableMicrophones = async (): Promise<AudioDevice[]> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.warn("enumerateDevices() not supported.");
        return [];
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
        .filter(device => device.kind === 'audioinput')
        .map(device => ({
            id: device.deviceId,
            label: device.label || `Microphone ${devices.filter(d => d.kind === 'audioinput').indexOf(device) + 1}`
        }));
};
