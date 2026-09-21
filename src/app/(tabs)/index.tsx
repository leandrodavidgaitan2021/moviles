// src/app/(tabs)/index.tsx
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { obtenerLugares } from "../../servicios/lugares";
import { Lugar } from "../../tipos";

function calcularDistancia(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371e3;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function PantallaInicio() {
  const router = useRouter();
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [ubicacionActual, setUbicacionActual] = useState<{
    latitud: number;
    longitud: number;
  }>({
    latitud: -31.8333, // Coordenadas aproximadas de Oro Verde
    longitud: -60.5167,
  });

  // Estados para el panel desplegable de simulación
  const [mostrarSimulador, setMostrarSimulador] = useState<boolean>(false);
  const [inputLat, setInputLat] = useState<string>("-32.2214");
  const [inputLon, setInputLon] = useState<string>("-58.1381");

  useEffect(() => {
    async function inicializar() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          let ubicacion = await Location.getCurrentPositionAsync({});
          const realLat = ubicacion.coords.latitude;
          const realLon = ubicacion.coords.longitude;
          setUbicacionActual({ latitud: realLat, longitud: realLon });
          setInputLat(realLat.toString());
          setInputLon(realLon.toString());
        }

        const respuesta = await obtenerLugares();
        setLugares(respuesta.datos);
      } catch (error) {
        console.error("Error al inicializar datos o GPS:", error);
      } finally {
        setCargando(false);
      }
    }
    inicializar();
  }, []);

  const aplicarUbicacionManual = () => {
    const lat = parseFloat(inputLat);
    const lon = parseFloat(inputLon);
    if (!isNaN(lat) && !isNaN(lon)) {
      setUbicacionActual({ latitud: lat, longitud: lon });
    } else {
      alert("Por favor ingresa coordenadas válidas");
    }
  };

  const obtenerUbicacionRealGps = async () => {
    try {
      setCargando(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let ubicacion = await Location.getCurrentPositionAsync({});
        const realLat = ubicacion.coords.latitude;
        const realLon = ubicacion.coords.longitude;
        setUbicacionActual({ latitud: realLat, longitud: realLon });
        setInputLat(realLat.toString());
        setInputLon(realLon.toString());
      } else {
        alert("Se requieren permisos de ubicación para usar el GPS.");
      }
    } catch (error) {
      console.error("Error al obtener la ubicación real:", error);
      alert("No se pudo obtener la ubicación actual.");
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#2E8B57" />
        <Text style={styles.textoCargando}>Cargando Guía Turística...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabecera */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Colon - Secretaria de Turismo</Text>
        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => router.push("/escanear")}
        >
          <Ionicons name="qr-code-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Botón desplegable para simular ubicación */}
      <TouchableOpacity
        style={styles.toggleSimulador}
        onPress={() => setMostrarSimulador(!mostrarSimulador)}
      >
        <Ionicons name="options-outline" size={18} color="#27ae60" />
        <Text style={styles.toggleSimuladorText}>
          {mostrarSimulador
            ? "Ocultar simulador de ubicación"
            : "Simular / Cambiar ubicación en Colón"}
        </Text>
      </TouchableOpacity>

      {/* Panel Desplegable */}
      {mostrarSimulador && (
        <View style={styles.simuladorContainer}>
          <Text style={styles.simuladorLabel}>
            Latitud y Longitud Actuales:
          </Text>
          <View style={styles.inputsRow}>
            <TextInput
              style={styles.inputCoord}
              value={inputLat}
              onChangeText={setInputLat}
              keyboardType="numeric"
              placeholder="Latitud"
            />
            <TextInput
              style={styles.inputCoord}
              value={inputLon}
              onChangeText={setInputLon}
              keyboardType="numeric"
              placeholder="Longitud"
            />
            <TouchableOpacity
              style={styles.botonAplicar}
              onPress={aplicarUbicacionManual}
            >
              <Text style={styles.botonAplicarText}>Ir</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sugerenciaLabel}>Accesos directos en Colón:</Text>
          <View style={styles.chipsRow}>
            <TouchableOpacity
              style={styles.chip}
              onPress={() => {
                setInputLat("-32.2214");
                setInputLon("-58.1381");
                setUbicacionActual({ latitud: -32.2214, longitud: -58.1381 });
              }}
            >
              <Text style={styles.chipText}>Centro / Plaza</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chip}
              onPress={() => {
                setInputLat("-32.2350");
                setInputLon("-58.1420");
                setUbicacionActual({ latitud: -32.235, longitud: -58.142 });
              }}
            >
              <Text style={styles.chipText}>Termas Colón</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chip}
              onPress={() => {
                setInputLat("-32.2150");
                setInputLon("-58.1300");
                setUbicacionActual({ latitud: -32.215, longitud: -58.13 });
              }}
            >
              <Text style={styles.chipText}>Costanera</Text>
            </TouchableOpacity>
          </View>

          {/* Botón para regresar al GPS real */}
          <TouchableOpacity
            style={styles.botonGpsReal}
            onPress={obtenerUbicacionRealGps}
          >
            <Ionicons name="locate" size={16} color="#27ae60" />
            <Text style={styles.botonGpsRealText}>
              Usar mi ubicación real (GPS)
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Contenedor del Mapa */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={{
            latitude: ubicacionActual.latitud,
            longitude: ubicacionActual.longitud,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
          showsUserLocation={false}
        >
          {/* Marcador azul para tu posición actual o simulada */}
          <Marker
            coordinate={{
              latitude: ubicacionActual.latitud,
              longitude: ubicacionActual.longitud,
            }}
            title="Tu ubicación"
            description="Posición actual o simulada"
            pinColor="blue"
          />

          {/* Marcadores rojos para los lugares turísticos */}
          {lugares.map((lugar) => (
            <Marker
              key={lugar.id}
              coordinate={{
                latitude: lugar.coordenadas.latitud,
                longitude: lugar.coordenadas.longitud,
              }}
              title={lugar.nombre}
              description={lugar.descripcionCorta}
            />
          ))}
        </MapView>
      </View>

      {/* Sección "Cerca tuyo" */}
      <View style={styles.cercaContainer}>
        <Text style={styles.cercaTitle}>Cerca tuyo</Text>
        <FlatList
          data={lugares}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const metros = calcularDistancia(
              ubicacionActual.latitud,
              ubicacionActual.longitud,
              item.coordenadas.latitud,
              item.coordenadas.longitud,
            );
            const textoDistancia =
              metros > 1000
                ? `${(metros / 1000).toFixed(1)} km`
                : `${Math.round(metros)} m`;

            return (
              <TouchableOpacity
                style={styles.lugarItem}
                onPress={() => router.push(`/lugar/${item.id}`)}
              >
                <View>
                  <Text style={styles.lugarNombre}>{item.nombre}</Text>
                  <Text style={styles.lugarDesc} numberOfLines={1}>
                    {item.descripcionCorta}
                  </Text>
                </View>
                <Text style={styles.lugarDistancia}>{textoDistancia}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  centrado: { flex: 1, justifyContent: "center", alignItems: "center" },
  textoCargando: { marginTop: 10, fontSize: 16, color: "#666" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#222" },
  qrButton: { padding: 6, backgroundColor: "#f0f0f0", borderRadius: 8 },
  toggleSimulador: {
    backgroundColor: "#e8f8f0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#d4efdf",
  },
  toggleSimuladorText: {
    color: "#27ae60",
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 6,
  },
  simuladorContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  simuladorLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  inputsRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  inputCoord: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
  },
  botonAplicar: {
    backgroundColor: "#27ae60",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  botonAplicarText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  sugerenciaLabel: { fontSize: 11, color: "#888", marginBottom: 4 },
  chipsRow: { flexDirection: "row", gap: 6 },
  chip: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  chipText: { fontSize: 11, color: "#333", fontWeight: "500" },
  botonGpsReal: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e8f8f0",
    paddingVertical: 8,
    borderRadius: 6,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#c6e7d6",
    gap: 6,
  },
  botonGpsRealText: {
    color: "#27ae60",
    fontWeight: "600",
    fontSize: 12,
  },
  mapContainer: {
    height: 250,
    width: "100%",
    backgroundColor: "#fff",
  },
  map: { ...StyleSheet.absoluteFill },
  cercaContainer: { flex: 1, padding: 15 },
  cercaTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  lugarItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  lugarNombre: { fontSize: 16, fontWeight: "600", color: "#2c3e50" },
  lugarDesc: { fontSize: 13, color: "#7f8c8d", maxWidth: 220 },
  lugarDistancia: { fontSize: 14, fontWeight: "bold", color: "#27ae60" },
});
