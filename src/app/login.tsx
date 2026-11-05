import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useState } from 'react';
import { useApp } from '@/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import axios from 'axios';
import SecureInput from '@/components/SecureInput';

const Login = () => {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const { user, setloading, setuser, url, settoken } = useApp();
  const [error, seterror] = useState('');

  const handleLogin = async () => {
    setloading(true);
    axios.post(url + '/login', { email, password }).then(async (data) => {
      await AsyncStorage.setItem('token', data.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
      settoken(data.data.token);
      setuser(data.data.user);
      router.replace('/');
    })
      .catch((error) => alert(error?.response?.data?.message || 'Something went wrong'))
      .finally(() => setloading(false))
  }

  const handleSubmit = async () => {
    seterror('');
    if (!email) { return seterror('Enter email') }
    if (!password) { return seterror('Enter password') }
    handleLogin();
  }

  return (
    <ScrollView contentContainerStyle={styles.container} style={{ flex: 1 }}>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      <View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#8A8A8A"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setemail}
        />
      </View>
      <SecureInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#8A8A8A"
        secureTextEntry
        value={password}
        onChangeText={setpassword}
      />
      <Pressable style={styles.forgotPassword} onPress={() => router.push("/forgot-password")}>
        <Text style={styles.linkText}>Forgot password?</Text>
      </Pressable>
      <Text style={styles.error}>{error}</Text>
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Log in</Text>
      </Pressable>
      <Pressable style={styles.linkButton} onPress={() => router.push('/signup')} >
        <Text>
          Don't have an account?
          <Text style={styles.linkText} >{"  "}Signup</Text>
        </Text>
      </Pressable>
    </ScrollView>
  )
}

export default Login

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
    marginTop: 8,
    marginBottom: 28,
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
  forgotPassword: {
    padding: 10,
    width: 200,
  },
  error: {
    color: "#d93030",
    textAlign: "center",
  },
  button: {
    height: 52,
    marginTop: 8,
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
  linkButton: {
    alignItems: "center",
    marginTop: 10,
  },
  linkText: {
    color: "#1455d9"
  },
})