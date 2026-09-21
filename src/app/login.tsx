// src/app/login.tsx
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";

// 1. Esquema de validación actualizado con mínimo de 8 caracteres
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("Correo electrónico inválido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
    .regex(/[0-9]/, "Debe contener al menos un número"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  // Datos mockeados actualizados a 8 caracteres o más
  const emailMock = "turista@colon.com";
  const passwordMock = "12345678"; // <-- Modificado aquí (8 caracteres)

  const router = useRouter();

  // 2. Configuramos react-hook-form con el resolver de zod
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3. Función que se ejecuta si la validación pasa exitosamente
  const handleLogin = async (data: LoginFormData) => {
    if (data.email === emailMock && data.password === passwordMock) {
      try {
        await AsyncStorage.setItem("@user_session", data.email);
        router.replace("/(tabs)/perfil");
      } catch (error) {
        console.error("Error al guardar la sesión", error);
      }
    } else {
      alert("Credenciales incorrectas. Prueba con turista@colon.com y 123456");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="compass" size={64} color="#27ae60" />
        </View>

        <Text style={styles.title}>Turismo Colón</Text>
        <Text style={styles.subtitle}>
          Inicia sesión para guardar tu recorrido
        </Text>

        {/* Input de Correo con Controller */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        {/* Input de Contraseña con Controller */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#aaa"
              secureTextEntry
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
            />
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        {/* Botón de envío vinculado a handleSubmit */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(handleLogin)}
        >
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.guestButtonText}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.guestButtonText}>Continuar como invitado</Text>
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
    marginBottom: 5,
    color: "#333",
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 4,
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
  guestButton: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  guestButtonText: {
    color: "#7f8c8d",
    fontSize: 14,
    fontWeight: "600",
  },
});
