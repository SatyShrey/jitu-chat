import { LinearGradient } from 'expo-linear-gradient'
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
    text: string,
    task: () => void,
    reset: () => void,
    title?: string,
}

const ConfirmBox = ({ text, task, reset, title }: Props) => {
    return (
        <Modal transparent animationType='slide' >
            <LinearGradient style={{ flex: 1, justifyContent: "flex-end" }} colors={["#00000000", "#000"]}>
                <View style={styles.card}>
                    <Text style={styles.title}>{title || 'Confirm'}</Text>
                    <Text style={styles.text}>{text}</Text>
                    <View style={styles.row}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: "#00000090" }]} onPress={reset}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, { backgroundColor: "#d31a1a" }]} onPress={() => { task(); reset() }}>
                            <Text style={styles.buttonText}>Yes, Proceed</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </Modal>
    )
}

export default ConfirmBox

const styles = StyleSheet.create({
    card: {
        paddingHorizontal: 10,
        paddingVertical:20,
        gap: 5,
        borderTopRightRadius: 25,
        borderTopLeftRadius:25,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 25,
        fontWeight: "600"
    },
    text: {
        fontSize: 18,
        textAlign: 'center'
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 20,
        marginTop: 20
    },
    button: {
        padding: 10,
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: "500"
    },
})