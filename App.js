import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListaRecursos from './screens/ListaRecursos';
import AgregarRecurso from './screens/AgregarRecurso';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Lista">
        <Stack.Screen name="Lista" component={ListaRecursos} />
        <Stack.Screen name="Agregar" component={AgregarRecurso} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
