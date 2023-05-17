import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MapScreen } from '../pages/MapScreen';
import { PermissionScreen } from '../pages/PermissionScreen';
import { PermissionsContext } from '../context/PermissionsContext';
import { LoadingScreen } from '../pages/LoadingScreen';

const Stack = createStackNavigator();

export const Navigator = () => {

  const { permissions } = useContext( PermissionsContext );

  if( permissions.locationStatus === 'unavailable'){
    return <LoadingScreen />
  }

  return (
    <Stack.Navigator
      // initialRouteName='PermissionScreen'
        screenOptions={{
            headerShown: false,
            cardStyle:{
                backgroundColor: 'white',
            }
        }}
    >

      {
        ( permissions.locationStatus === 'granted')
        ? <Stack.Screen name="MapScreen"        component={ MapScreen} />
        : <Stack.Screen name="PermissionScreen" component={PermissionScreen} />
      }
    </Stack.Navigator>
  );
}