import { StyleSheet } from 'react-native'
import { Stack } from 'expo-router';
import { MyProvider } from '@/global';

const Layout = () => {
  return (
    <MyProvider>
      <Stack />
    </MyProvider>
  )
}

export default Layout

const styles = StyleSheet.create({})