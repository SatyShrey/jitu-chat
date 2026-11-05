import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Loader = () => {
    return (
        <Modal>
            <View style={styles.container}>
                <ActivityIndicator />
                <Text>Loading...</Text>
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
    }
})