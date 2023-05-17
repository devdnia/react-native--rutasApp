import React, { useRef, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { useLocation } from '../hooks/useLocation';
import { LoadingScreen } from '../pages/LoadingScreen';
import { Fab } from './Fab';




export const Map = () => {

    const { 
        followUserLocation,
        getCurrentLocation, 
        hasLocation,
        initialPosition, 
        stopFollowUserLocation,
        userLocation,
     } = useLocation();

    const mapViewRef = useRef<MapView>();
    const following  = useRef<boolean>(true);
     
    useEffect(() => {
      followUserLocation();
      return() =>{
        stopFollowUserLocation();
      }
    }, [])
    
    useEffect(()=>{
        if( !following.current ) return;
        const { latitude, longitude} = userLocation;
        mapViewRef.current?.animateCamera({
            center: { latitude, longitude }
        })
    },
    [userLocation])


    const centerPosition = async () => {

        const { latitude, longitude } = await getCurrentLocation();

        following.current = true;

        mapViewRef.current?.animateCamera({
            center: { latitude, longitude }
        })
    }

    if (!hasLocation) {
        return <LoadingScreen />
    }

    return (
        <>
            <MapView
                ref={(el) => mapViewRef.current = el!}
                style={{ flex: 1 }}
                showsUserLocation
                initialRegion={{
                    latitude: initialPosition.latitude,
                    longitude: initialPosition.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                onTouchStart={ () => following.current = false}
            >
                {/* <Marker
                    image={require('../assets/custommarker.png')}
                    coordinate={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                    }}
                    title="Esto es un título"
                    description="Descripción del marcador"
                /> */}

            </MapView>
            <Fab
                iconName='compass-outline'
                onPress={centerPosition}
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                }}
            />
        </>
    )
};