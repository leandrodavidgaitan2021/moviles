import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { obtenerLugaresFav } from "../servicios/favoritos";
import { Lugar } from "../tipos";

export default function PantallaFavoritos() {
    const router = useRouter();
    const [lugares, setLugares] = useState<Lugar[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);

    useEffect(() => {
        async function cargarFavoritos() {
            const datos = await obtenerLugaresFav();
            setLugares(datos);
            setCargando(false);
        }
        cargarFavoritos();
    }, []);

    if (cargando) {
        return (
            <View style = {styles.centrado}>
                <ActivityIndicator size = "large" color = "#27ae60"/>
            </View>
            );
        }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.floatingBackButton} onPress={() => router.back()}>
                <Ionicons name = "arrow-back" size ={24} color = "#333"/>
            </TouchableOpacity>

            <View style={styles.header}>
                <Text style={styles.title}>Mis Favoritos</Text>
            </View>

            {lugares.length === 0 ? (
                <View style={styles.centrado}>
                    <Ionicons name = "star-outline" size ={48} color = "#bdc3c7"/>
                    <Text style = {styles.emptyText}>Aún no tenés favoritos.</Text>
                </View>    
            ) : (
                <FlatList
                    data={lugares}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.lista}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.item} onPress={() => router.push(`/lugar/${item.id}`)}>
                            <Text style={styles.itemNombre}>{item.nombre}</Text>
                            <Ionicons name="chevron-forward" size ={20} color="#bdc3c7"/>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f9fa" },
    centrado: { flex: 1, justifyContent: "center", alignItems: "center" },
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
    header: { paddingTop: 90, paddingHorizontal: 20, paddingBottom: 10 },
    title: { fontSize: 24, fontWeight: "bold", color: "#222" },
    emptyText: { marginTop: 10, fontSize: 14, color: "#7f8c8d" },
    lista: { paddingHorizontal: 20 },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 10,
        marginBottom: 10,
    },
    itemNombre: { fontSize: 16, fontWeight: "600", color: "#2c3e50" },
});