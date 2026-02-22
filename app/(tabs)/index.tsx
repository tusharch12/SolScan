import React, { useState } from "react"
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context'
import { getBalance, getTokens, getTxns } from "../../src/services/solana";
import { useRouter } from "expo-router";
import { useWalletStore } from "../../src/store/wallet-store";
import { Ionicons } from "@expo/vector-icons";



const short = (s: string, n = 4) => `${s.slice(0, n)}...${s.slice(-n)}`;

const timeAgo = (ts: number) => {
    const s = Math.floor(Date.now() / 1000 - ts);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
};

export default function WalletScreen() {

    const addToHistory = useWalletStore((state: any) => state.addHistory);
    const searchHistory = useWalletStore((state: any) => state.searchHistory);
    const isDevnet = useWalletStore((state: any) => state.isDevnet);
    const addFavorite = useWalletStore((state: any) => state.addFavorite);
    const removeFavorite = useWalletStore((state: any) => state.removeFavorite);
    const isFavorite = useWalletStore((state: any) => state.isFavorite);

    const [addr, setAddr] = useState("");
    const [balance, setBalance] = useState<number | null>(null);
    const [tokens, setTokens] = useState<any[]>([]);
    const [txns, setTxns] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFav, setIsFav] = useState(isFavorite(addr));

    const router = useRouter();

    const search = async () => {
        if (!addr) return Alert.alert("Please enter a wallet address");
        setLoading(true);
        try {
            const [bal, tok, tx] = await Promise.all([
                getBalance(addr),
                getTokens(addr),
                getTxns(addr),
            ])
            addToHistory(addr);
            setBalance(bal);
            setTokens(tok);
            setTxns(tx);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    console.log('balance', balance);
    console.log("tokens", tokens);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.header}>SolScan</Text>
                <View style={styles.searchContainer}>
                    <TextInput
                        placeholder="Search Wallet Address..."
                        placeholderTextColor="#6B7280"
                        style={styles.searchInput}
                        value={addr}
                        onChangeText={setAddr}
                        autoCapitalize='none'
                        autoCorrect={false}
                    />

                </View>
                <View style={{ flexDirection: "row", gap: 12, marginBottom: 20 }}>
                    <TouchableOpacity style={styles.searchButton} onPress={search} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.btnText}>Search</Text>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.clearButton} onPress={() => setAddr('')} disabled={loading}>

                        <Text style={styles.btnTextClear}>Clear</Text>

                    </TouchableOpacity>
                </View>

                {!addr && searchHistory.length > 0 && (
                    <View style={styles.historyContainer}>
                        <Text style={styles.historyTitle}>History</Text>
                        <FlatList
                            data={searchHistory}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.historyItem}
                                    onPress={() => { setAddr(item); search(); }}
                                >
                                    <Text style={styles.historyText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}

                {addr && balance !== null && (
                    <View style={styles.balanceCard}>
                        <View style={styles.balRow1}>
                            <Text style={styles.balanceLabel}>Total Balance</Text>
                            <TouchableOpacity onPress={() => {
                                if (isFav) {
                                    removeFavorite(addr);
                                    setIsFav(false);
                                } else {
                                    addFavorite(addr);
                                    setIsFav(true);
                                }
                            }}>
                                <Ionicons name={isFav ? "star" : "star-outline"} size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.balanceValue}>{balance.toFixed(4)} SOL</Text>
                    </View>
                )}

                {addr && <FlatList
                    style={styles.list}
                    data={tokens}
                    keyExtractor={(item) => item.mint}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => router.push(`/token/${item.mint}`)}
                            style={styles.tokenCard}>
                            <View>
                                <Text style={styles.tokenMint}>{short(item.mint, 6)}</Text>
                                <Text style={styles.tokenLabel}>Mint Address</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.tokenAmount}>{item.amount.toLocaleString()}</Text>
                                <Text style={styles.tokenLabel}>Amount</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        balance !== null && tokens.length === 0 ? (
                            <Text style={styles.emptyText}>No tokens found</Text>
                        ) : null
                    }
                />}
                <StatusBar style="light" />
            </View>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0F172A', // Dark Slate Blue background
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    header: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 20,
        letterSpacing: 0.5,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#1E293B',
        color: '#fff',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#334155',
    },
    searchButton: {
        backgroundColor: '#14F195', // Solana Green
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: '70%'
    },
    clearButton: {
        backgroundColor: '#1E293B', // Solana Green
        color: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: '25%'
    },
    btnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0F172A',

    },
    btnTextClear: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',

    },
    balanceCard: {
        backgroundColor: '#9945FF', // Solana Purple
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        shadowColor: "#9945FF",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    balRow1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    balanceLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
    },
    balanceValue: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 20,
    },
    tokenCard: {
        backgroundColor: '#1E293B',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    tokenMint: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    tokenAmount: {
        color: '#14F195',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    tokenLabel: {
        color: '#94A3B8', // Slate 400
        fontSize: 12,
    },
    emptyText: {
        color: '#94A3B8',
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
    },
    historyContainer: {
        marginBottom: 24,
    },
    historyTitle: {
        color: '#94A3B8',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    historyItem: {
        backgroundColor: '#1E293B',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#334155',
    },
    historyText: {
        color: '#E2E8F0',
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    }
});