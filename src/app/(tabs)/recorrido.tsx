// src/app/(tabs)/recorrido.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AccesoRestringido from "../../components/AccesoRestringido";

const lugaresVisitados = [
  {
    id: "lug-001",
    nombre: "Termas Colón",
    fechaCheckin: "11 de Septiembre, 2026",
    categoriaId: "cat-termas",
  },
  {
    id: "lug-002",
    nombre: "Playa Norte",
    fechaCheckin: "12 de Septiembre, 2026",
    categoriaId: "cat-playas",
  },
];

export default function RecorridoScreen() {
  const router = useRouter();
  const [estaLogeado, setEstaLogeado] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    async function verificarSesion() {
      try {
        const token = await AsyncStorage.getItem("@user_session");
        if (token) {
          setEstaLogeado(true);
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
      } finally {
        setCargando(false);
      }
    }
    verificarSesion();
  }, []);

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  if (!estaLogeado) {
    return (
      <AccesoRestringido subtitulo="Inicia sesión para ver tu bitácora de viaje, progreso y lugares visitados en Colón." />
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabecera de la sección */}
      <View style={styles.header}>
        <Text style={styles.title}>Mi Recorrido</Text>
        <Text style={styles.subtitle}>
          Bitácora de lugares descubiertos en Colón
        </Text>
      </View>

      {/* Tarjeta de Progreso / Resumen */}
      <View style={styles.progressCard}>
        <Ionicons name="trophy-outline" size={32} color="#27ae60" />
        <View style={styles.progressInfo}>
          <Text style={styles.progressTitle}>Progreso de viaje</Text>
          <Text style={styles.progressText}>
            Has visitado {lugaresVisitados.length} de 15 puntos turísticos
          </Text>
        </View>
      </View>

      {/* Lista de lugares visitados / check-ins */}
      <Text style={styles.sectionTitle}>Lugares visitados (Check-in)</Text>

      {lugaresVisitados.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="compass-outline" size={48} color="#bdc3c7" />
          <Text style={styles.emptyText}>
            Aún no has registrado ningún lugar.
          </Text>
          <Text style={styles.emptySubtext}>
            Usa el botón de QR en el inicio para escanear tótems en la ciudad.
          </Text>
        </View>
      ) : (
        <FlatList
          data={lugaresVisitados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemCard}
              onPress={() => router.push(`/lugar/${item.id}`)}
            >
              <View style={styles.itemIconContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#27ae60" />
              </View>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.nombre}</Text>
                <Text style={styles.itemDate}>
                  Registrado el {item.fechaCheckin}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  progressCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressInfo: {
    marginLeft: 15,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  progressText: {
    fontSize: 13,
    color: "#7f8c8d",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  itemIconContainer: {
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
  },
  itemDate: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 50,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#7f8c8d",
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 13,
    color: "#95a5a6",
    textAlign: "center",
    paddingHorizontal: 30,
    marginTop: 5,
  },
});
