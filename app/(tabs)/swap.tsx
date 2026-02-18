import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const TOKENS = [
    { symbol: 'SOL', name: 'Solana', mint: 'So11111111111111111111111111111111111111112' },
    { symbol: 'USDC', name: 'USD Coin', mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
    { symbol: 'RAY', name: 'Raydium', mint: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R' },
    { symbol: 'SRM', name: 'Serum', mint: 'SRMuApVNdxXajjzP1qNwnMH64JKTZxuLIKHZeKrnuW' },
];

const SwapScreen = () => {
    const [fromToken, setFromToken] = useState(TOKENS[0]);
    const [toToken, setToToken] = useState(TOKENS[1]);
    const [modalVisible, setModalVisible] = useState(false);
    const [activeSide, setActiveSide] = useState<'from' | 'to'>('from');

    const handleOpenModal = (side: 'from' | 'to') => {
        setActiveSide(side);
        setModalVisible(true);
    };

    const handleSelectToken = (token: typeof TOKENS[0]) => {
        if (activeSide === 'from') {
            setFromToken(token);
        } else {
            setToToken(token);
        }
        setModalVisible(false);
    };

    const renderTokenItem = ({ item }: { item: typeof TOKENS[0] }) => (
        <TouchableOpacity style={styles.tokenItem} onPress={() => handleSelectToken(item)}>
            <View style={styles.tokenIconPlaceholder}>
                <Text style={styles.tokenIconText}>{item.symbol[0]}</Text>
            </View>
            <View>
                <Text style={styles.tokenSymbol}>{item.symbol}</Text>
                <Text style={styles.tokenName}>{item.name}</Text>
            </View>
            {/* Selected Indicator */}
            {(activeSide === 'from' && fromToken.symbol === item.symbol) || (activeSide === 'to' && toToken.symbol === item.symbol) ? (
                <Ionicons name="checkmark-circle" size={24} color="#14F195" style={{ marginLeft: 'auto' }} />
            ) : null}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Text style={styles.header}>Swap</Text>

                    {/* From Token Section */}
                    <View style={styles.swapCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardLabel}>You pay</Text>
                            <Text style={styles.balanceLabel}>Balance: 0.0</Text>
                        </View>
                        <View style={styles.inputRow}>
                            <TouchableOpacity style={styles.tokenSelector} onPress={() => handleOpenModal('from')}>
                                <View style={styles.miniIcon}>
                                    <Text style={styles.miniIconText}>{fromToken.symbol[0]}</Text>
                                </View>
                                <Text style={styles.tokenSelectorText}>{fromToken.symbol}</Text>
                                <Ionicons name="chevron-down" size={16} color="#fff" />
                            </TouchableOpacity>
                            <TextInput
                                placeholder="0.0"
                                placeholderTextColor="#64748B"
                                style={styles.amountInput}
                                keyboardType="numeric"
                            />
                        </View>
                        <Text style={styles.usdValue}>≈ $0.00</Text>
                    </View>

                    {/* Swap Indicator */}
                    <View style={styles.swapIndicatorContainer}>
                        <View style={styles.swapIndicator}>
                            <Ionicons name="arrow-down" size={20} color="#14F195" />
                        </View>
                    </View>

                    {/* To Token Section */}
                    <View style={styles.swapCard}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardLabel}>You receive</Text>
                            <Text style={styles.balanceLabel}>Balance: 0.0</Text>
                        </View>
                        <View style={styles.inputRow}>
                            <TouchableOpacity style={styles.tokenSelector} onPress={() => handleOpenModal('to')}>
                                <View style={styles.miniIcon}>
                                    <Text style={styles.miniIconText}>{toToken.symbol[0]}</Text>
                                </View>
                                <Text style={styles.tokenSelectorText}>{toToken.symbol}</Text>
                                <Ionicons name="chevron-down" size={16} color="#fff" />
                            </TouchableOpacity>
                            <TextInput
                                placeholder="0.0"
                                placeholderTextColor="#64748B"
                                style={styles.amountInput}
                                keyboardType="numeric"
                            />
                        </View>
                        <Text style={styles.usdValue}>≈ $0.00</Text>
                    </View>

                    {/* Swap Button */}
                    <TouchableOpacity style={styles.swapButton}>
                        <Text style={styles.swapButtonText}>Swap</Text>
                    </TouchableOpacity>

                    {/* Token Selection Modal */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Select a token</Text>
                                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                        <Ionicons name="close" size={24} color="#94A3B8" />
                                    </TouchableOpacity>
                                </View>
                                {/* Search bar in modal could go here */}
                                <View style={styles.separator} />
                                <FlatList
                                    data={TOKENS}
                                    keyExtractor={(item) => item.symbol}
                                    renderItem={renderTokenItem}
                                    contentContainerStyle={styles.tokenList}
                                />
                            </View>
                        </View>
                    </Modal>

                    <StatusBar style="light" />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0F172A', // Dark Slate Blue
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
        marginBottom: 24,
        letterSpacing: 0.5,
    },
    swapCard: {
        backgroundColor: '#1E293B', // Darker Slate
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#334155',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    cardLabel: {
        color: '#94A3B8', // Slate 400
        fontSize: 14,
        fontWeight: '500',
    },
    balanceLabel: {
        color: '#94A3B8',
        fontSize: 14,
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    tokenSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#334155',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 24,
        gap: 8,
    },
    miniIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#64748B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    miniIconText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    tokenSelectorText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    amountInput: {
        flex: 1,
        color: '#fff',
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'right',
        padding: 0,
    },
    usdValue: {
        color: '#64748B',
        fontSize: 14,
        textAlign: 'right',
    },
    swapIndicatorContainer: {
        alignItems: 'center',
        marginVertical: -16, // Pull closer
        zIndex: 10,
    },
    swapIndicator: {
        backgroundColor: '#0F172A',
        padding: 8,
        borderRadius: 12,
        borderWidth: 4,
        borderColor: '#0F172A', // Match bg to create "cutout" effect
    },
    swapButton: {
        backgroundColor: '#14F195', // Solana Green
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 24,
        shadowColor: "#14F195",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    swapButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F172A', // Dark text on green button
    },
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1E293B',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '60%',
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeButton: {
        padding: 4,
    },
    separator: {
        height: 1,
        backgroundColor: '#334155',
    },
    tokenList: {
        paddingHorizontal: 20,
    },
    tokenItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    tokenIconPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#475569',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    tokenIconText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    tokenSymbol: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    tokenName: {
        color: '#94A3B8',
        fontSize: 14,
    },
});

export default SwapScreen;