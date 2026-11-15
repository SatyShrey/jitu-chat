import { Alert, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useApp } from '@/global'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Protected from '@/components/Protected';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const profile = () => {

    const { user, setuser, setconfirmValue } = useApp();
    const logOut = async () => {
        setconfirmValue({
            task: async () => {
                await AsyncStorage.clear();
                setuser(null);
            },
            text: "Are you sure you want to logout?",
            title: "Logout"
        })
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
                    <TouchableOpacity style={[styles.btn, { backgroundColor: '#00000090', }]} onPress={() => router.push('/change-password')}>
                        <Text style={styles.btnText}>Change password</Text>
                    </TouchableOpacity>
                    <Pressable style={[styles.btn, { backgroundColor: '#df4545', }]} onPress={logOut}>
                        <Text style={styles.btnText}>Logout</Text>
                    </Pressable>
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
        padding: 10,
        width: 600,
        maxWidth: "90%",
        marginVertical: 10,
        marginHorizontal: "auto",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#fff",
        elevation: 4
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: "50%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ccc"
    },
    name: {
        fontSize: 21,
        fontWeight: "500"
    },
    email: {
        fontSize: 14,
        fontStyle: "italic",
        fontWeight: "400",
        color: "#3c3c3c"
    },
    btn: {
        padding: 10,
        borderRadius: 7,
        width: '100%',
    },
    btnText: {
        color: '#ffffff',
        textAlign: "center",
        fontSize: 21
    },
})