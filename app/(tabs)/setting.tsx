import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useWalletStore } from '../../src/store/wallet-store';
import { StatusBar } from 'expo-status-bar';

export default function SettingScreen() {
    const router = useRouter();
    const isDevnet = useWalletStore((state: any) => state.isDevnet);
    const toggleDevnet = useWalletStore((state: any) => state.toggleDevnet);

    const MenuGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <View style={styles.group}>
            <Text style={styles.groupTitle}>{title}</Text>
            <View style={styles.groupContent}>
                {children}
            </View>
        </View>
    );

    const MenuItem = ({
        icon,
        label,
        onPress,
        value,
        isLast = false,
        showArrow = true,
        destructive = false
    }: {
        icon: any,
        label: string,
        onPress?: () => void,
        value?: React.ReactNode,
        isLast?: boolean,
        showArrow?: boolean,
        destructive?: boolean
    }) => (
        <TouchableOpacity
            style={[styles.item, !isLast && styles.itemBorder]}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.itemLeft}>
                <View style={[styles.iconContainer, destructive && styles.destructiveIcon]}>
                    <Ionicons name={icon} size={20} color={destructive ? "#EF4444" : "#fff"} />
                </View>
                <Text style={[styles.itemLabel, destructive && styles.destructiveText]}>{label}</Text>
            </View>
            <View style={styles.itemRight}>
                {value}
                {showArrow && <Ionicons name="chevron-forward" size={20} color="#64748B" />}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <ScrollView style={styles.content}>
                <MenuGroup title="General">
                    <MenuItem
                        icon="star-outline"
                        label="Favorites"
                        onPress={() => router.push('/favorites')}
                        isLast={true}
                    />
                </MenuGroup>

                <MenuGroup title="Network">
                    <MenuItem
                        icon="globe-outline"
                        label="Devnet Mode"
                        showArrow={false}
                        value={
                            <Switch
                                value={isDevnet}
                                onValueChange={toggleDevnet}
                                trackColor={{ false: '#334155', true: '#14F195' }}
                                thumbColor={'#fff'}
                            />
                        }
                        isLast={true}
                    />
                </MenuGroup>

                <MenuGroup title="App Info">
                    <MenuItem
                        icon="information-circle-outline"
                        label="Version"
                        value={<Text style={styles.versionText}>1.0.0</Text>}
                        showArrow={false}
                    />
                    <MenuItem
                        icon="document-text-outline"
                        label="Terms of Service"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="shield-checkmark-outline"
                        label="Privacy Policy"
                        onPress={() => { }}
                        isLast={true}
                    />
                </MenuGroup>
            </ScrollView>
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
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#fff',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    group: {
        marginBottom: 24,
    },
    groupTitle: {
        color: '#94A3B8',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
    },
    groupContent: {
        backgroundColor: '#1E293B',
        borderRadius: 16,
        overflow: 'hidden',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#1E293B',
    },
    itemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#334155',
        alignItems: 'center',
        justifyContent: 'center',
    },
    destructiveIcon: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
    },
    itemLabel: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
    destructiveText: {
        color: '#EF4444',
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    versionText: {
        color: '#64748B',
        fontSize: 16,
    },
});