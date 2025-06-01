import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Image,
  Alert,
  TextInput,
  Pressable,
  Modal,
  Linking,
  ScrollView,
} from 'react-native';

export default function ListaRecursos({ navigation }) {
  const [recursos, setRecursos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [recursoEditar, setRecursoEditar] = useState(null);

  const [idBusqueda, setIdBusqueda] = useState('');
  const [recursosFiltrados, setRecursosFiltrados] = useState([]);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const fetchRecursos = () => {
    fetch('https://683b6b5628a0b0f2fdc4a1ac.mockapi.io/recursos')
      .then((res) => res.json())
      .then((data) => setRecursos(data))
      .catch(() => Alert.alert('Error', 'No se pudieron cargar los recursos'));
  };



  useEffect(() => {
    fetchRecursos();
  }, []);

  useEffect(() => {
    if (idBusqueda.trim() === '') {
      setRecursosFiltrados([]);
      setBusquedaRealizada(false);
    }
  }, [idBusqueda]);

  const buscarPorId = () => {
    const resultado = recursos.filter((r) => r.id === idBusqueda.trim());
    setRecursosFiltrados(resultado);
    setBusquedaRealizada(true);
  };

  const eliminarRecurso = (id) => {
    fetch(`https://683b6b5628a0b0f2fdc4a1ac.mockapi.io/recursos/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setRecursos((prev) => prev.filter((r) => r.id !== id));
        setRecursosFiltrados((prev) => prev.filter((r) => r.id !== id));
      })
      .catch(() => Alert.alert('Error', 'No se pudo eliminar el recurso'));
  };


  const abrirModalEditar = (item) => {
    setRecursoEditar({ ...item }); // Clonar el objeto para editar
    setModalVisible(true);
  };

  // Guardar edición con actualización automática de lista
  const guardarEdicion = () => {
    if (!recursoEditar) return;

    fetch(`https://683b6b5628a0b0f2fdc4a1ac.mockapi.io/recursos/${recursoEditar.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recursoEditar),
    })
      .then((res) => res.json())
      .then((nuevoRecurso) => {
        // Actualizamos lista completa
        setRecursos((prev) =>
          prev.map((r) => (r.id === nuevoRecurso.id ? nuevoRecurso : r))
        );

        setRecursosFiltrados((prev) =>
          prev.map((r) => (r.id === nuevoRecurso.id ? nuevoRecurso : r))
        );

        setModalVisible(false);
        setRecursoEditar(null);
      })
      .catch(() => Alert.alert('Error', 'No se pudo editar el recurso'));
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagen }} style={styles.image} />
      <Text style={styles.title}>{item.titulo}</Text>
      <Text>{item.descripcion}</Text>
      <Text style={styles.tipo}>{item.tipo}</Text>

      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8 }}
      >
        <Button title="Editar" onPress={() => abrirModalEditar(item)} />
        <Button title="Eliminar" color="red" onPress={() => eliminarRecurso(item.id)} />
      </View>

      <Pressable style={styles.enlaceBoton} onPress={() => Linking.openURL(item.enlace)}>
        <Text style={styles.enlaceTexto}>Visitar el sitio web</Text>
      </Pressable>
    </View>
  );

  const listaAMostrar =
    recursosFiltrados.length > 0 || busquedaRealizada ? recursosFiltrados : recursos;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Lista de Recursos</Text>
        <Button title="Agregar" onPress={() => navigation.navigate('Agregar')} />
      </View>

      <View style={styles.barraBusqueda}>
        <TextInput
          placeholder="Buscar por ID"
          value={idBusqueda}
          onChangeText={setIdBusqueda}
          style={styles.input}
          keyboardType="numeric"
        />
        <Button title="Buscar" onPress={buscarPorId} />
      </View>

      {busquedaRealizada && listaAMostrar.length === 0 && (
        <Text style={styles.mensajeNoEncontrado}>No se encontró ningún recurso con ese ID.</Text>
      )}

      <FlatList
        data={listaAMostrar}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />


      {/* Modal de edición */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
              <Text style={styles.title}>Editar Recurso</Text>
              <TextInput
                style={styles.input}
                value={recursoEditar?.titulo ?? ''}
                onChangeText={(text) => setRecursoEditar({ ...recursoEditar, titulo: text })}
                placeholder="Título"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                value={recursoEditar?.descripcion ?? ''}
                onChangeText={(text) => setRecursoEditar({ ...recursoEditar, descripcion: text })}
                placeholder="Descripción"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                value={recursoEditar?.tipo ?? ''}
                onChangeText={(text) => setRecursoEditar({ ...recursoEditar, tipo: text })}
                placeholder="Tipo"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                value={recursoEditar?.enlace ?? ''}
                onChangeText={(text) => setRecursoEditar({ ...recursoEditar, enlace: text })}
                placeholder="Enlace"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                value={recursoEditar?.imagen ?? ''}
                onChangeText={(text) => setRecursoEditar({ ...recursoEditar, imagen: text })}
                placeholder="Imagen"
                placeholderTextColor="#999"
              />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Pressable style={styles.botonGuardar} onPress={guardarEdicion}>
                  <Text style={styles.textoBoton}>Guardar</Text>
                </Pressable>
                <Pressable style={styles.botonCancelar} onPress={() => setModalVisible(false)}>
                  <Text style={styles.textoBoton}>Cancelar</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}


// Estilos:
const styles = StyleSheet.create({
  container: { padding: 10, flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: { fontSize: 24, fontWeight: 'bold' },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  tipo: { fontStyle: 'italic', marginTop: 5 },
  image: { width: '100%', height: 150, borderRadius: 8, marginBottom: 10 },
  barraBusqueda: {
    flexDirection: 'row',
    marginBottom: 10,
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  mensajeNoEncontrado: {
    textAlign: 'center',
    color: 'red',
    marginBottom: 10,
  },
  enlaceBoton: {
    marginTop: 5,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  enlaceTexto: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    maxHeight: '80%', 
  },
  botonGuardar: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  botonCancelar: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
