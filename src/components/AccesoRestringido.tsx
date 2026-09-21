// src/components/AccesoRestringido.tsx
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AccesoRestringidoProps {
  subtitulo: string;
}

export default function AccesoRestringido({ subtitulo }: AccesoRestringidoProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Ionicons name="lock-closed-outline" size={64} color="#bdc3c7" />
      <Text style={styles.title}>Acceso restringido</Text>
      <Text style={styles.subtitle}>{subtitulo}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/login")}
      >
        <Text style={styles.buttonText}>Ir a Iniciar Sesión</Text>
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#27ae60",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});