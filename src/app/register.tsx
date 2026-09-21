// src/app/register.tsx
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!nombre || !email || !password) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      // Guardamos la sesión del nuevo usuario simulado
      await AsyncStorage.setItem("@user_session", email);
      alert(`¡Registro exitoso! Bienvenido, ${nombre}`);
      router.replace("/(tabs)/perfil");
    } catch (error) {
      console.error("Error al registrar el usuario", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-add" size={64} color="#27ae60" />
        </View>

        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>
          Regístrate para guardar tu bitácora de viaje en Colón
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          placeholderTextColor="#aaa"
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            ¿Ya tienes cuenta? Inicia sesión
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
  },
  formContainer: {
    padding: 24,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 15,
    color: "#333",
  },
  button: {
    backgroundColor: "#27ae60",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  backButtonText: {
    color: "#27ae60",
    fontSize: 14,
    fontWeight: "600",
  },
});
