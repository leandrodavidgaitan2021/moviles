// src/app/(tabs)/index.tsx
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FiltrosYBusqueda from "../../components/FiltrosYBusqueda";
import MapaLugares from "../../components/MapaLugares";
import SimuladorUbicacion from "../../components/SimuladorUbicacion";
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
    latitud: -31.8333,
    longitud: -60.5167,
  });

  const [mostrarSimulador, setMostrarSimulador] = useState<boolean>(false);
  const [inputLat, setInputLat] = useState<string>("-32.2214");
  const [inputLon, setInputLon] = useState<string>("-58.1381");

  // Estados de Búsqueda, Filtros y Ordenamiento por Distancia
  const [busquedaTexto, setBusquedaTexto] = useState<string>("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] =
    useState<string>("Todos");
  const [ordenarPorCercania, setOrdenarPorCercania] = useState<boolean>(false);

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

  const cambiarCoordenadasDirectas = (lat: number, lon: number) => {
    setInputLat(lat.toString());
    setInputLon(lon.toString());
    setUbicacionActual({ latitud: lat, longitud: lon });
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

  // Filtrado y ordenamiento de lugares por nombre, categoría y distancia
  const lugaresFiltrados = useMemo(() => {
    // 1. Filtrar
    const filtrados = lugares.filter((lugar) => {
      const coincideNombre = lugar.nombre
        .toLowerCase()
        .includes(busquedaTexto.toLowerCase());

      if (categoriaSeleccionada === "Todos") {
        return coincideNombre;
      }

      const categoriaIdFormateado = `cat-${categoriaSeleccionada.toLowerCase().split(" ")[0]}`;
      const coincideCategoria =
        lugar.categoriaId.toLowerCase() ===
          categoriaSeleccionada.toLowerCase() ||
        lugar.categoriaId.toLowerCase() === categoriaIdFormateado;

      return coincideNombre && coincideCategoria;
    });

    // 2. Ordenar por cercanía si está activado el switch/botón
    if (ordenarPorCercania) {
      return [...filtrados].sort((a, b) => {
        const distanciaA = calcularDistancia(
          ubicacionActual.latitud,
          ubicacionActual.longitud,
          a.coordenadas.latitud,
          a.coordenadas.longitud,
        );
        const distanciaB = calcularDistancia(
          ubicacionActual.latitud,
          ubicacionActual.longitud,
          b.coordenadas.latitud,
          b.coordenadas.longitud,
        );
        return distanciaA - distanciaB; // Del más cercano al más lejano
      });
    }

    return filtrados;
  }, [
    lugares,
    busquedaTexto,
    categoriaSeleccionada,
    ordenarPorCercania,
    ubicacionActual,
  ]);

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

      {/* Componente Modular de Búsqueda y Filtros */}
      <FiltrosYBusqueda
        busquedaTexto={busquedaTexto}
        setBusquedaTexto={setBusquedaTexto}
        categoriaSeleccionada={categoriaSeleccionada}
        setCategoriaSeleccionada={setCategoriaSeleccionada}
      />

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

      {/* Componente del Simulador */}
      <SimuladorUbicacion
        mostrar={mostrarSimulador}
        inputLat={inputLat}
        inputLon={inputLon}
        setInputLat={setInputLat}
        setInputLon={setInputLon}
        onAplicarManual={aplicarUbicacionManual}
        onCambiarCoordenadas={cambiarCoordenadasDirectas}
        onGpsReal={obtenerUbicacionRealGps}
      />

      {/* Componente del Mapa */}
      <MapaLugares
        ubicacionActual={ubicacionActual}
        lugares={lugaresFiltrados}
      />

      {/* Listado de resultados y botón de ordenar por distancia */}
      <View style={styles.cercaContainer}>
        <View style={styles.listHeaderRow}>
          <Text style={styles.cercaTitle}>
            Lugares ({lugaresFiltrados.length})
          </Text>
          <TouchableOpacity
            style={[
              styles.botonOrdenar,
              ordenarPorCercania && styles.botonOrdenarActivo,
            ]}
            onPress={() => setOrdenarPorCercania(!ordenarPorCercania)}
          >
            <Ionicons
              name="navigate-outline"
              size={14}
              color={ordenarPorCercania ? "#fff" : "#27ae60"}
            />
            <Text
              style={[
                styles.botonOrdenarText,
                ordenarPorCercania && styles.botonOrdenarTextActivo,
              ]}
            >
              {ordenarPorCercania
                ? "Más cercanos primero"
                : "Ordenar por distancia"}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={lugaresFiltrados}
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
                <View style={{ flex: 1 }}>
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
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#222" },
  qrButton: { padding: 6, backgroundColor: "#f0f0f0", borderRadius: 8 },
  toggleSimulador: {
    backgroundColor: "#e8f8f0",
    paddingVertical: 8,
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
    fontSize: 12,
    marginLeft: 6,
  },
  cercaContainer: { flex: 1, padding: 15 },
  listHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cercaTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  botonOrdenar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f8f0",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#c6e7d6",
    gap: 4,
  },
  botonOrdenarActivo: {
    backgroundColor: "#27ae60",
    borderColor: "#27ae60",
  },
  botonOrdenarText: {
    fontSize: 12,
    color: "#27ae60",
    fontWeight: "600",
  },
  botonOrdenarTextActivo: {
    color: "#fff",
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
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  lugarNombre: { fontSize: 15, fontWeight: "600", color: "#2c3e50" },
  lugarDesc: { fontSize: 12, color: "#7f8c8d", maxWidth: 220, marginTop: 2 },
  lugarDistancia: { fontSize: 13, fontWeight: "bold", color: "#27ae60" },
});
