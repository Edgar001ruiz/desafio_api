import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Pressable, ScrollView } from 'react-native';

export default function AgregarRecurso({ navigation }) {
  const [nuevoRecurso, setNuevoRecurso] = useState({
    titulo: '',
    descripcion: '',
    tipo: '',
    enlace: '',
    imagen: '',
  });

  const handleChange = (key, value) => {
    setNuevoRecurso({ ...nuevoRecurso, [key]: value });
  };

  const agregarRecurso = () => {
    const { titulo, descripcion, tipo, enlace, imagen } = nuevoRecurso;
    if (!titulo || !descripcion || !tipo || !enlace || !imagen) {
      Alert.alert('Campos incompletos', 'Por favor llena todos los campos');
      return;
    }

    fetch('https://683b6b5628a0b0f2fdc4a1ac.mockapi.io/recursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoRecurso),
    })
      .then((res) => res.json())
      .then(() => {
        Alert.alert('¡Éxito!', 'Recurso agregado correctamente');
        navigation.goBack();
      })
      .catch(() => Alert.alert('Error', 'No se pudo agregar el recurso'));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Agregar Recurso</Text>

      <TextInput
        placeholder="Título"
        style={styles.input}
        value={nuevoRecurso.titulo}
        onChangeText={(text) => handleChange('titulo', text)}
      />
      <TextInput
        placeholder="Descripción"
        style={[styles.input, { height: 100 }]}
        value={nuevoRecurso.descripcion}
        multiline
        onChangeText={(text) => handleChange('descripcion', text)}
      />
      <TextInput
        placeholder="Tipo"
        style={styles.input}
        value={nuevoRecurso.tipo}
        onChangeText={(text) => handleChange('tipo', text)}
      />
      <TextInput
        placeholder="Enlace"
        style={styles.input}
        value={nuevoRecurso.enlace}
        onChangeText={(text) => handleChange('enlace', text)}
      />
      <TextInput
        placeholder="URL de Imagen"
        style={styles.input}
        value={nuevoRecurso.imagen}
        onChangeText={(text) => handleChange('imagen', text)}
      />

      <Pressable style={styles.botonAgregar} onPress={agregarRecurso}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Agregar Recurso</Text>
      </Pressable>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  botonAgregar: {
    backgroundColor: '#0a7b61',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
});
