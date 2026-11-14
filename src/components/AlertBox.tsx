import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

type Props = {
    text: string,
    reset: () => void,
    title?:string,
}

const AlertBox = ({ text, reset,title }: Props) => {
    return (
        <Modal transparent animationType='fade'>
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.title}>{title || 'Alert'}</Text>
                    <Text style={styles.text}>{text}</Text>
                    <View style={styles.row}>
                        <TouchableOpacity style={[styles.button,{backgroundColor:"#111"}]} onPress={reset}>
                            <Text style={styles.buttonText}>Ok</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default AlertBox

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#00000070"
    },
    card: {
        padding:10,
        gap:5,
        borderRadius:5,
        backgroundColor:"#fff",
        width:400,
        maxWidth:"90%",
    },
    title: {
        fontSize:18,
        fontWeight:"600"
    },
    text: {
        fontSize:16,
        textAlign:'center'
    },
    row: {
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-end",
        gap:20,
        marginTop:20
    },
    button: {
        padding:10,
        borderRadius:5
    },
    buttonText: {
        color:'#fff',
        fontSize:16,
    },
})