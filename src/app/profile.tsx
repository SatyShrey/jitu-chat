import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useApp } from '@/global'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Protected from '@/components/Protected';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const profile = () => {

    const { user, setuser } = useApp();
    const logOut = async () => {
        await AsyncStorage.clear();
        setuser(null);
    }

    return (
        <Protected>
            <ScrollView style={styles.container}>
                <View style={styles.card}>
                    <View style={styles.profilePic}>
                        <MaterialIcons name='person' size={80} />
                    </View>
                    <Text style={styles.name}>{user?.name}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>
                <View style={styles.card}>
                    <TouchableOpacity style={styles.btnChangePassword} onPress={() => router.push('/change-password')}>
                        <Text style={styles.btnChangePasswordText}>Change password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnLogout} onPress={logOut}>
                        <Text style={styles.btnLogoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Protected>
    )
}

export default profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        borderRadius: 12,
        borderColor: "#ccc",
        padding: 10,
        width: 600,
        maxWidth: "90%",
        borderWidth: 1,
        marginVertical: 10,
        marginHorizontal: "auto",
        alignItems: "center",
        gap: 10,
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: "50%",
        borderColor: "#ccc",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    name: {
        fontSize: 21,
        fontWeight: "500"
    },
    email: {
        fontSize: 14,
        fontStyle: "italic",
        fontWeight: "400",
        color:"#3c3c3c"
    },
    btnChangePassword: {
        padding: 10,
        borderRadius: 12,
        borderColor: '#222322',
        width: '100%',
        borderWidth: 1
    },
    btnChangePasswordText: {
        color: '#000',
        textAlign: "center",
        fontSize: 21
    },
    btnLogout: {
        padding: 10,
        borderRadius: 12,
        backgroundColor: '#df4545',
        width: '100%',
    },
    btnLogoutText: {
        color: '#ffffff',
        textAlign: "center",
        fontSize: 21
    },
})