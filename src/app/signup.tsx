import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { useApp } from '@/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import SecureInput from '@/components/SecureInput';
import axios from 'axios';

const Signup = () => {
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');
    const [name, setname] = useState('');
    const { user, setloading, setuser, url } = useApp();
    const [error, seterror] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');

    const handleSignup = async () => {
        const user = { email, name, password };
        setloading(true)
        axios.post(url + '/signup', user).then(async (data) => {
            console.log(data.data);
            alert(data.data)
        }).catch(err => alert(err?.response?.data?.message || err.message))
            .finally(() => { setloading(false) })
    }

    const handleSubmit = async () => {
        seterror('');
        if (!name) { return seterror('Enter name') }
        if (!email) { return seterror('Enter email') }
        if (!password) { return seterror('Enter password') }
        if (confirmPassword !== password) { return seterror('Confirm password do not match') }
        handleSignup()
    }

    return (
        <ScrollView style={{flex:1}} contentContainerStyle={styles.container}>
            <Text style={styles.title}>Signup</Text>
            <Text style={styles.subtitle}>Enter details to create a new account</Text>

            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    placeholderTextColor="#8A8A8A"
                    value={name}
                    onChangeText={setname}
                />
            </View>
            <View>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#8A8A8A"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setemail}
                />
            </View>

            <SecureInput
                value={password}
                onChangeText={setpassword}
                placeholder='Password'
                style={styles.input}
            />
            <SecureInput
                value={confirmPassword}
                onChangeText={setconfirmPassword}
                placeholder='Confirm Password'
                style={styles.input}
            />

            <Text style={styles.error}>{error}</Text>

            <Pressable style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Signup</Text>
            </Pressable>
        </ScrollView>
    )
}

export default Signup

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: '#FFFFFF',
        gap: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#171717',
    },
    subtitle: {
        marginBottom: 18,
        fontSize: 16,
        color: '#666666',
    },
    input: {
        height: 52,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 10,
        fontSize: 16,
        color: '#171717',
    },
    error: {
        color: "#d93030",
        textAlign: "center",
        height: 40,
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