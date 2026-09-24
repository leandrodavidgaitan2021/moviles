// src/components/FiltrosYBusqueda.tsx
import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CATEGORIAS = [
  "Todos",
  "playas",
  "termas",
  "museos y patrimonio",
  "gastronomía",
  "artesanías",
  "naturaleza",
  "alojamiento",
];

interface Props {
  busquedaTexto: string;
  setBusquedaTexto: (texto: string) => void;
  categoriaSeleccionada: string;
  setCategoriaSeleccionada: (cat: string) => void;
}

export default function FiltrosYBusqueda({
  busquedaTexto,
  setBusquedaTexto,
  categoriaSeleccionada,
  setCategoriaSeleccionada,
}: Props) {
  return (
    <View>
      {/* Barra de Búsqueda por Nombre */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={18}
          color="#7f8c8d"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar lugares por nombre..."
          value={busquedaTexto}
          onChangeText={setBusquedaTexto}
          placeholderTextColor="#95a5a6"
        />
        {busquedaTexto.length > 0 && (
          <TouchableOpacity onPress={() => setBusquedaTexto("")}>
            <Ionicons name="close-circle" size={18} color="#7f8c8d" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtros por Categoría (Horizontales) */}
      <View style={styles.categoriasWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriasContainer}
        >
          {CATEGORIAS.map((cat) => {
            const activo = categoriaSeleccionada === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoriaChip,
                  activo && styles.categoriaChipActivo,
                ]}
                onPress={() => setCategoriaSeleccionada(cat)}
              >
                <Text
                  style={[
                    styles.categoriaTexto,
                    activo && styles.categoriaTextoActivo,
                  ]}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: "#333" },
  categoriasWrapper: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoriasContainer: { paddingHorizontal: 15, gap: 8 },
  categoriaChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#f1f2f6",
    borderWidth: 1,
    borderColor: "#dcdde1",
  },
  categoriaChipActivo: {
    backgroundColor: "#27ae60",
    borderColor: "#27ae60",
  },
  categoriaTexto: { fontSize: 13, color: "#2f3640", fontWeight: "500" },
  categoriaTextoActivo: { color: "#fff", fontWeight: "bold" },
});
