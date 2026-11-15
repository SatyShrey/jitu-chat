import Protected from '@/components/Protected';
import SecureInput from '@/components/SecureInput';
import { useApp } from '@/global';
import axios from 'axios';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const App = () => {
    const { user, setloading, url, token, alert } = useApp();
    const [currentPassword, setcurrentPassword] = useState('')
    const [newPassword, setnewPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');
    const [error, seterror] = useState('');

    const handleChange = () => {
        setloading(true);
        axios.post(url + '/change-password', { newPassword, currentPassword, email: user?.email }, { headers: { Authorization: `Bearer ${token}` } })
            .then((data) => {
                alert(data.data.message)
            })
            .catch((err: any) => {
                alert(err?.response?.data?.message || err.message,"Error")
            })
            .finally(() => {
                setloading(false)
            })
    }

    const handleSubmit = () => {
        seterror('');
        if (!currentPassword) return seterror('Enter Current Password')
        if (!newPassword) return seterror('Enter New Password')
        if (newPassword == currentPassword) return seterror(`New password and current password can't be the same`)
        if (newPassword.length < 4) return seterror('New password must be at least 4 characters')
        if (newPassword != confirmPassword) return seterror('Confirm password not match')
        handleChange()
    }

    return (
        <Protected>
            <View style={styles.container}>
                <Text style={styles.title}>Change Password</Text>
                <SecureInput
                    style={styles.input}
                    value={currentPassword}
                    placeholder='Current Password'
                    placeholderTextColor='#ccc'
                    onChangeText={setcurrentPassword} />
                <SecureInput
                    style={styles.input}
                    value={newPassword}
                    placeholder='New Password'
                    placeholderTextColor='#ccc'
                    onChangeText={setnewPassword} />
                <SecureInput
                    style={styles.input}
                    value={confirmPassword}
                    placeholder='Confirm New Password'
                    placeholderTextColor='#ccc'
                    onChangeText={setconfirmPassword} />
                <Text style={styles.error}>{error}</Text>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </Protected>
    )
}

export default App

const styles = StyleSheet.create({
    container: {
        padding: 10,
        gap: 10
    },
    title: {
        fontSize: 21,
        fontWeight: "600",
        textAlign: "center",
    },
    input: {
        height: 52,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 10,
        fontSize: 16,
        color: '#171717',
        backgroundColor:"#fff"
    },
    error: {
        color: "#d93030",
        textAlign: "center",
    },
    button: {
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#2563EB',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
})