// src/app/(tabs)/perfil.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AccesoRestringido from "../../components/AccesoRestringido";

export default function PerfilScreen() {
  const [estaLogeado, setEstaLogeado] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(true);
  const [usuarioEmail, setUsuarioEmail] = useState<string>("");

  useEffect(() => {
    async function verificarSesion() {
      try {
        const token = await AsyncStorage.getItem("@user_session");
        if (token) {
          setEstaLogeado(true);
          setUsuarioEmail(token);
        }
      } catch (error) {
        console.error("Error al verificar la sesión:", error);
      } finally {
        setCargando(false);
      }
    }
    verificarSesion();
  }, []);

  const handleCerrarSesion = async () => {
    try {
      await AsyncStorage.removeItem("@user_session");
      setEstaLogeado(false);
      setUsuarioEmail("");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (cargando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#27ae60" />
      </View>
    );
  }

  if (!estaLogeado) {
    return (
      <AccesoRestringido subtitulo="Inicia sesión para ver tu perfil, preferencias y lugares guardados offline." />
    );
  }

  return (
    <View style={styles.containerLogeado}>
      <Ionicons name="person-circle-outline" size={80} color="#27ae60" />
      <Text style={styles.title}>Mi Perfil</Text>
      <Text style={styles.emailText}>{usuarioEmail}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tus datos offline</Text>
        <Text style={styles.cardDesc}>
          Los check-ins de tu recorrido se sincronizarán localmente en este
          dispositivo.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleCerrarSesion}
      >
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  containerLogeado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    textAlign: "center",
  },
  emailText: {
    fontSize: 15,
    color: "#7f8c8d",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    padding: 16,
    borderRadius: 10,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  cardDesc: {
    fontSize: 13,
    color: "#7f8c8d",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
