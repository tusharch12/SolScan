import React, { useState } from "react";
import { Text, View, StyleSheet, TextInput, TouchableOpacity, Modal, FlatList } from "react-native";

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
            <Text style={styles.tokenSymbol}>{item.symbol}</Text>
            <Text style={styles.tokenName}>{item.name}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.mainCon}>
            <Text style={styles.header}>Swap Tokens</Text>


            <View style={styles.swapContainer}>
                <View style={styles.swConRow1}>
                    <TouchableOpacity style={styles.dropdownBtn} onPress={() => handleOpenModal('from')}>
                        <Text style={styles.dropdownBtnText}>{fromToken.symbol} ▼</Text>
                    </TouchableOpacity>
                    <TextInput placeholder="0.0" placeholderTextColor="#9CA3AF" style={styles.textInput} keyboardType="numeric" />
                </View>
                <View style={styles.swConRow2}>
                    <Text style={{ color: '#9CA3AF' }}>Balance: 0.0</Text>
                    <Text style={{ color: '#9CA3AF' }}>≈ $0.00</Text>
                </View>
            </View>

            {/* To Token Section */}
            <View style={styles.swapContainer}>
                <View style={styles.swConRow1}>
                    <TouchableOpacity style={styles.dropdownBtn} onPress={() => handleOpenModal('to')}>
                        <Text style={styles.dropdownBtnText}>{toToken.symbol} ▼</Text>
                    </TouchableOpacity>
                    <TextInput placeholder="0.0" placeholderTextColor="#9CA3AF" style={styles.textInput} keyboardType="numeric" />
                </View>
                <View style={styles.swConRow2}>
                    <Text style={{ color: '#9CA3AF' }}>Balance: 0.0</Text>
                    <Text style={{ color: '#9CA3AF' }}>≈ $0.00</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.swapBtn}>
                <Text style={styles.swapBtnText}>Swap</Text>
            </TouchableOpacity>

            {/* Token Selection Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Token</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={TOKENS}
                            keyExtractor={(item) => item.symbol}
                            renderItem={renderTokenItem}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    mainCon: {
        flex: 1,
        backgroundColor: '#000',
        // padding: 20,
    },
    header: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    swapContainer: {
        borderWidth: 1,
        backgroundColor: '#181818',
        borderColor: '#181818',
        borderRadius: 12,
        padding: 14,
        marginTop: 10,
        marginBottom: 10,
    },
    swConRow1: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    swConRow2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textInput: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'right',
        flex: 1,
    },
    dropdownBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#333',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    dropdownBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    swapBtn: {
        backgroundColor: '#14F195',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    swapBtnText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000'
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#181818',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        height: '50%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeText: {
        color: '#14F195',
        fontSize: 16,
        fontWeight: 'bold',
    },
    tokenItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    tokenSymbol: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    tokenName: {
        color: '#9CA3AF',
        fontSize: 14,
    },
})

export default SwapScreen;