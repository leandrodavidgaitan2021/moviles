// src/app/escanear.tsx
import { Ionicons } from "@expo/vector-icons";
import { Camera, CameraView } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EscanearScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    async function getCameraPermissions() {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    }
    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    // Asumiendo que el código QR contiene el ID del lugar (ej: "lugar-1" o simplemente el ID)
    // Redirigimos directamente a la pantalla de detalle del lugar
    router.replace(`/lugar/${data}`);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
        <Text style={styles.text}>No hay acceso a la cámara.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={StyleSheet.absoluteFill}
      />

      {/* Botón flotante para cerrar o volver */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.overlay}>
        <Text style={styles.overlayText}>
          Apunta al código QR del tótem turístico
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
  overlay: {
    position: "absolute",
    bottom: 60,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  overlayText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#27ae60",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
