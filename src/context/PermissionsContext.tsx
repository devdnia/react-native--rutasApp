import { createContext, useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import { check, openSettings, PERMISSIONS, PermissionStatus, request } from 'react-native-permissions';


export interface PermissionsState {
    // Para expandir poner otro atributo
    locationStatus: PermissionStatus;
}


// Estado Inicial
export const permissionInitState: PermissionsState = {
    locationStatus: 'unavailable',
}


type PermissionContextProps = {
    permissions: PermissionsState;
    askLocationPermission: () => void;
    checkLocationPermission: () => void;
}
// Contexto
export const PermissionsContext = createContext({} as PermissionContextProps);


// Provider
export const PermissionsProvider = ({ children }: any) => {

    const [permissions, setPermissions] = useState(permissionInitState);

    // Listener para saber el estado de la app
    useEffect(() => {

        askLocationPermission();

        AppState.addEventListener('change', state => {

            if (state !== 'active') return;

            askLocationPermission();
        })

    }, []);


    const askLocationPermission = async () => {

        let permissionStatus: PermissionStatus;

        if (Platform.OS === 'ios') {
            // permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            permissionStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        } else {
            // permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            permissionStatus = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
        }

        // Abrir ajustes para dar privilegios
        if (permissionStatus === 'blocked') {
            openSettings();
        }

        setPermissions({
            ...permissions,
            locationStatus: permissionStatus,
        })
    }

    const checkLocationPermission = async () => {
        let permissionStatus: PermissionStatus;

        if (Platform.OS === 'ios') {
            permissionStatus = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);

        } else {
            permissionStatus = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);

        }

        setPermissions({
            ...permissions,
            locationStatus: permissionStatus,
        })
    }


    return (
        <PermissionsContext.Provider value={{
            permissions,
            askLocationPermission,
            checkLocationPermission,
        }}>
            {children}
        </PermissionsContext.Provider>
    )

}