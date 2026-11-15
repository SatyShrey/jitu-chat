import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Protected from '@/components/Protected'
import { router, useLocalSearchParams } from 'expo-router'
import { useApp } from '@/global'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'

const App = () => {
    const { email } = useLocalSearchParams();
    const { users } = useApp();

    function getName() {
        if (!email) return ''
        const sender = users.find(f => f?.email === email);
        return sender?.name || email;
    }

    const callDisconnect = () => {
        router.back()
    }

    const cameraFlip = () => {

    }

    return (
        <Protected>
            <View style={styles.container}>
                <View style={styles.bigScreen}>
                    <View style={styles.middleRow}>
                        <MaterialIcons name='call' color={'#0db128'} size={30} />
                        <Text style={styles.title}>Calling to {getName()}</Text>
                    </View>
                </View>
                <View style={styles.bottomRow}>
                    <View style={styles.smallScreen}>

                    </View>
                    <TouchableOpacity onPress={cameraFlip} style={styles.flipButton}>
                        <MaterialIcons name='flip-camera-android' color={'#fff'} size={40} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={callDisconnect} style={styles.endCallButton}>
                        <MaterialIcons name='call-end' color={'#fff'} size={40} />
                    </TouchableOpacity>
                </View>
            </View>
        </Protected>
    )
}

export default App

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1
    },
    title: {
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
    },
    bigScreen: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: "center",
        alignItems: "center",
    },
    middleRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 4
    },
    bottomRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        position: 'absolute',
        bottom: 0,
        left: 0,
        padding: 10,
        gap: 20,
    },
    smallScreen: {
        backgroundColor: "#000",
        borderRadius: 10,
        borderColor: "#ccc",
        height: 150,
        width: 100,
        borderWidth: 1
    },
    endCallButton: {
        backgroundColor: "#e31e1e",
        borderRadius: 30,
        height: 60,
        width: 60,
        justifyContent: "center",
        alignItems: "center",
    },
    flipButton: {
        backgroundColor: "#514f4f",
        borderRadius: 30,
        height: 60,
        width: 60,
        justifyContent: "center",
        alignItems: "center"
    }
})