import React, { useState } from "react"
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

const RPC = "https://api.mainnet-beta.solana.com";

const rpc = async (method: string, params: any[]) => {
    const res = await fetch(RPC, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    });
    const json = await res.json();
    if (json.error) throw new Error(json.error.message);
    return json.result;
};

const getBalance = async (addr: string) => {
    const result = await rpc("getBalance", [addr]);
    return result.value / 1_000_000_000;
};

const getTokens = async (addr: string) => {
    const result = await rpc("getTokenAccountsByOwner", [
        addr,
        { programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
        { encoding: "jsonParsed" },
    ]);
    return (result.value || [])
        .map((a: any) => ({
            mint: a.account.data.parsed.info.mint,
            amount: a.account.data.parsed.info.tokenAmount.uiAmount,
        }))
        .filter((t: any) => t.amount > 0);
};

const getTxns = async (addr: string) => {
    const sigs = await rpc("getSignaturesForAddress", [addr, { limit: 10 }]);
    return sigs.map((s: any) => ({
        sig: s.signature,
        time: s.blockTime,
        ok: !s.err,
    }));
};

const short = (s: string, n = 4) => `${s.slice(0, n)}...${s.slice(-n)}`;

const timeAgo = (ts: number) => {
    const s = Math.floor(Date.now() / 1000 - ts);
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
};

export const WalletScreen = () => {

    const [addr, setAddr] = useState("");
    const [balance, setBalance] = useState<number | null>(null);
    const [tokens, setTokens] = useState<any[]>([]);
    const [txns, setTxns] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const search = async () => {
        if (!addr) return Alert.alert("Please enter a wallet address");
        setLoading(true);
        try {
            const [bal, tok, tx] = await Promise.all([
                getBalance(addr),
                getTokens(addr),
                getTxns(addr),
            ])
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

        <View style={{ flex: 1 }}>
            <Text style={styles.header}>SolScan</Text>
            <View style={styles.searchBox}>
                <TextInput placeholder="Search Wallet Address..."
                    placeholderTextColor="#9CA3AF"
                    style={styles.searchInput}
                    value={addr}
                    onChangeText={setAddr}
                    autoCapitalize='none'
                    autoCorrect={false}
                />
            </View>
            <TouchableOpacity style={styles.searchbutton} onPress={search} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#000" />
                ) : (
                    <Text style={styles.btnText}>Search</Text>
                )}
            </TouchableOpacity>

            {balance !== null && (
                <View style={styles.balenceCard}>
                    <Text style={styles.label}>Balance:</Text>
                    <Text style={styles.value}>{balance.toFixed(4)} SOL</Text>
                </View>
            )}

            <FlatList
                style={{ flex: 1 }}
                data={tokens}
                keyExtractor={(item) => item.mint}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.label}>Amount:</Text>
                        <Text style={styles.value}>{item.amount}</Text>
                    </View>
                )}
                scrollEnabled={true}
                showsVerticalScrollIndicator={true}
            />

            {/* <Text>Hello world</Text> */}
            <StatusBar style="auto" />
        </View>

    );
}

const styles = StyleSheet.create({
    container: {

        backgroundColor: '#fff',
        padding: 30,
        borderWidth: 2,
        borderColor: '#000'
        // alignItems: 'center',
        // justifyContent: 'center',
    },

    header: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#fff',
    },
    searchInput: {
        color: '#fff',
    },
    searchBox: {
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold'
    },
    searchbutton: {
        // flex: 1,
        backgroundColor: '#14F195',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    btnText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000'
        // color: '#fff'
    },
    balenceCard: {
        backgroundColor: '#1a62aeff',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,

        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    card: {
        backgroundColor: '#1a62aeff',
        padding: 16,
        borderRadius: 12,
        marginTop: 16,
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    },
    value: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff'
    }
});