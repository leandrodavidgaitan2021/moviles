// src/app/lugar/[id].tsx
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { obtenerLugares } from "../../servicios/lugares";
import { Lugar } from "../../tipos";
import { cambiarFavorito, esFavorito } from "../../servicios/favoritos";

export default function DetalleLugarScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [lugar, setLugar] = useState<Lugar | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);
  const [esFav, setEsFav] = useState<boolean>(false);

  useEffect(() => {
    async function cargarDetalle() {
      try {
        const respuesta = await obtenerLugares();
        // Buscamos el lugar que coincide con el ID recibido por la ruta
        const encontrado = respuesta.datos.find((item) => item.id === id);
        if (encontrado) {
          setLugar(encontrado);
        }
      } catch (error) {
        console.error("Error al cargar el detalle del lugar:", error);
      } finally {
        setCargando(false);
      }
    }
    if (id) {
      cargarDetalle();
    }
  }, [id]);

  useEffect(() => {
    async function verificarFavorito() {
      if (typeof id === "string") {
        const favorito = await esFavorito(id);
        setEsFav(favorito);
      }
    }
    verificarFavorito();
  }, [id]);

  async function cambiarEstrella() {
    if (typeof id === "string") {
      const nuevoEstado = await cambiarFavorito(id);
      setEsFav(nuevoEstado);
    }
  }

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#27ae60" />
        <Text style={styles.textoCargando}>Cargando detalle...</Text>
      </View>
    );
  }

  if (!lugar) {
    return (
      <View style={styles.centrado}>
        <Ionicons name="alert-circle-outline" size={48} color="#e74c3c" />
        <Text style={styles.errorText}>
          No se encontró el lugar solicitado.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Botón flotante para volver */}
      <TouchableOpacity
        style={styles.floatingBackButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.categoria}>
          {lugar.categoriaId
            ? lugar.categoriaId.toUpperCase().replace("CAT-", "")
            : "TURISMO"}
        </Text>

        <View style={styles.filaTitulo}>
          <Text style={styles.title}>{lugar.nombre}</Text>
          <TouchableOpacity
            onPress={cambiarEstrella}
            accessibilityLabel={esFav ? "Quitar de favoritos" : "Agregar a favoritos"}>
            <Ionicons
              name={esFav ? "star" : "star-outline"}
              size={26}
              color="#f1c40f"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.coordenadasContainer}>
          <Ionicons name="location-outline" size={16} color="#7f8c8d" />
          <Text style={styles.coordenadasText}>
            {lugar.direccion} (Lat: {lugar.coordenadas.latitud}, Lon:{" "}
            {lugar.coordenadas.longitud})
          </Text>
        </View>

        {/* Descripción Detallada */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acerca del lugar</Text>
          <Text style={styles.description}>{lugar.descripcion}</Text>
        </View>

        {/* Información adicional: Precio y Accesibilidad */}
        <View style={styles.infoRow}>
          <View style={styles.infoBadge}>
            <Ionicons name="ticket-outline" size={18} color="#27ae60" />
            <Text style={styles.infoBadgeText}>
              {lugar.precioEntrada === 0
                ? "Entrada Libre / Gratuita"
                : `$${lugar.precioEntrada}`}
            </Text>
          </View>
          <View style={styles.infoBadge}>
            <Ionicons
              name={
                lugar.accesible
                  ? "accessibility-outline"
                  : "close-circle-outline"
              }
              size={18}
              color={lugar.accesible ? "#27ae60" : "#95a5a6"}
            />
            <Text style={styles.infoBadgeText}>
              {lugar.accesible ? "Accesible" : "No accesible"}
            </Text>
          </View>
        </View>

        {/* Botón de Check-in */}
        <TouchableOpacity
          style={styles.checkinButton}
          onPress={() =>
            alert(`¡Check-in realizado con éxito en ${lugar.nombre}!`)
          }
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.checkinButtonText}>Hacer Check-in aquí</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  textoCargando: { marginTop: 10, fontSize: 16, color: "#666" },
  errorText: { fontSize: 16, color: "#333", marginTop: 10, marginBottom: 20 },
  floatingBackButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: { padding: 20, paddingTop: 90 },
  categoria: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#27ae60",
    marginBottom: 5,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#222", marginBottom: 10 },
  coordenadasContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  filaTitulo: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
  },
  coordenadasText: { fontSize: 13, color: "#7f8c8d", marginLeft: 5 },
  section: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  description: { fontSize: 15, color: "#555", lineHeight: 22 },
  checkinButton: {
    flexDirection: "row",
    backgroundColor: "#27ae60",
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    gap: 8,
  },
  checkinButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  backButton: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backButtonText: { color: "#fff", fontWeight: "bold" },
  infoRow: {
    flexDirection: "column",
    gap: 10,
    marginBottom: 25,
  },
  infoBadge: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f8f5",
    padding: 10,
    borderRadius: 8,
    gap: 6,
  },
  infoBadgeText: {
    fontSize: 13,
    color: "#2c3e50",
    fontWeight: "500",
  },
});
