import Protected from '@/components/Protected';
import SecureInput from '@/components/SecureInput';
import { useApp } from '@/global';
import axios from 'axios';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const App = () => {
  const { user, setloading, url, token,alert } = useApp();
  const [email, setemail] = useState('')
  const [error, seterror] = useState('');

  const handleReset = () => {
    alert('Reset link sent to ' + email)
  }

  const handleSubmit = () => {
    seterror('');
    if (!email) return seterror('Enter a valid email')
    handleReset()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        value={email}
        placeholder='Email'
        placeholderTextColor='#ccc'
        onChangeText={setemail} />

      <Text style={styles.error}>{error}</Text>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
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