// src/app/(tabs)/agenda.tsx
import { Ionicons } from "@expo/vector-icons";
import { FlatList, StyleSheet, Text, View } from "react-native";

const eventosLocales = [
  {
    id: "evt-001",
    titulo: "Fiesta Nacional de la Artesanía",
    fecha: "Febrero (Próximamente)",
    lugar: "Predio Ferial - Costanera",
    descripcion:
      "El evento cultural y artesanal más importante de la región con artistas en vivo.",
  },
  {
    id: "evt-002",
    titulo: "Encuentro de Motos Colón",
    fecha: "Marzo (Próximamente)",
    lugar: "Polideportivo Municipal",
    descripcion:
      "Reunión de motociclistas de todo el país con caravanas y shows de rock.",
  },
  {
    id: "evt-003",
    titulo: "Feria de Sabores Entrerrianos",
    fecha: "Fin de semana largo",
    lugar: "Plaza San Martín",
    descripcion:
      "Patios gastronómicos, degustación de vinos regionales y cervecerías artesanales.",
  },
];

export default function AgendaScreen() {
  return (
    <View style={styles.container}>
      {/* Cabecera */}
      <View style={styles.header}>
        <Text style={styles.title}>Agenda de Eventos</Text>
        <Text style={styles.subtitle}>
          Próximas fiestas y actividades culturales en Colón
        </Text>
      </View>

      {/* Lista de Eventos */}
      <FlatList
        data={eventosLocales}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <View style={styles.eventHeader}>
              <Ionicons name="calendar-outline" size={20} color="#27ae60" />
              <Text style={styles.eventFecha}>{item.fecha}</Text>
            </View>
            <Text style={styles.eventTitulo}>{item.titulo}</Text>
            <View style={styles.eventLocationRow}>
              <Ionicons name="location-outline" size={14} color="#7f8c8d" />
              <Text style={styles.eventLugar}>{item.lugar}</Text>
            </View>
            <Text style={styles.eventDesc}>{item.descripcion}</Text>
          </View>
        )}
      />
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
  eventCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  eventFecha: {
    fontSize: 12,
    fontWeight: "600",
    color: "#27ae60",
  },
  eventTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 6,
  },
  eventLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 4,
  },
  eventLugar: {
    fontSize: 13,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  eventDesc: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
});
