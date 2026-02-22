import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWalletStore } from '../src/store/wallet-store';
import { StatusBar } from 'expo-status-bar';

export default function FavoritesScreen() {
    const router = useRouter();
    const favorites = useWalletStore((state: any) => state.favorite);
    const removeFavorite = useWalletStore((state: any) => state.removeFavorite);

    const handleRemove = (address: string) => {
        Alert.alert(
            "Remove Favorite",
            "Are you sure you want to remove this address from favorites?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: 'destructive',
                    onPress: () => removeFavorite(address)
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                    <Text style={styles.headerTitle}>Favorites</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={favorites}
                keyExtractor={(item) => item}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <View style={styles.itemInfo}>
                            <Ionicons name="wallet-outline" size={24} color="#14F195" />
                            <Text style={styles.addressText} numberOfLines={1} ellipsizeMode="middle">
                                {item}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={() => handleRemove(item)} style={styles.removeButton}>
                            <Ionicons name="trash-outline" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="star-outline" size={64} color="#334155" />
                        <Text style={styles.emptyText}>No favorites yet</Text>
                        <Text style={styles.emptySubText}>Add wallets to your favorites to see them here</Text>
                    </View>
                }
            />
            <StatusBar style="light" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#1E293B',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    listContent: {
        padding: 20,
    },
    itemContainer: {
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#334155',
    },
    itemInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    addressText: {
        color: '#fff',
        fontSize: 16,
        flex: 1,
        marginRight: 10,
    },
    removeButton: {
        padding: 8,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        gap: 16,
    },
    emptyText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    emptySubText: {
        color: '#94A3B8',
        fontSize: 16,
        textAlign: 'center',
    }
});
