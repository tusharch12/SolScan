import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Alert, Button, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WalletScreen } from './src/screen/wallet';
import SwapScreen from './src/screen/swap'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


export default function App() {
  const [activeTab, setActiveTab] = useState<"wallet" | "swap">('wallet');


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.globalCon}>
        <View style={styles.container}>
          {activeTab === 'wallet' ? <WalletScreen /> : <SwapScreen />}
        </View>
        <View style={styles.tabbar}>
          <TouchableOpacity style={styles.tabbutton} onPress={() => setActiveTab('wallet')}>
            <Ionicons name={activeTab === "wallet" ? "home" : "home-outline"} size={24} color={activeTab === "wallet" ? "#14F195" : "#6B7280"} />
            <Text style={[styles.tabLabel, activeTab === "wallet" && styles.tabActive]}>Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabbutton} onPress={() => setActiveTab('swap')}>
            <Ionicons name={activeTab === "swap" ? "swap" : "swap-outline"} size={24} color={activeTab === "swap" ? "#14F195" : "#6B7280"} />
            <Text style={[styles.tabLabel, activeTab === "swap" && styles.tabActive]}>Swap</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  globalCon: {
    flex: 1,
    // backgroundColor: '#882a2aff',
  },
  container: {
    height: '100%',
    backgroundColor: '#000',
    padding: 20

  },
  tabbar: {
    flexDirection: 'row',
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    backgroundColor: '#16161D',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    textAlign: 'center'
  },
  tabbutton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10
  },
  tabLabel: {
    color: "#6B7280",
    fontSize: 12,
  },
  tabActive: {
    color: "#14F195",
  },
});


