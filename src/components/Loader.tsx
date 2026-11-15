import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Loader = () => {
    return (
        <Modal transparent>
            <View style={styles.container}>
                <View style={styles.card}>
                    <ActivityIndicator />
                    <Text>Loading...</Text>
                </View>
            </View>
        </Modal>
    )
}

export default Loader

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#00000070"
    },
    card: {
        flexDirection: "row",
        padding: 10,
        gap: 5,
        borderRadius: 5,
        backgroundColor: "#fff",
    }
})