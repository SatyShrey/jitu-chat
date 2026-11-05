import { StyleSheet } from 'react-native'
import { Stack } from 'expo-router';
import { MyProvider } from '@/global';

const Layout = () => {
  return (
    <MyProvider>
      <Stack  screenOptions={{headerShown:false}} />
    </MyProvider>
  )
}

export default Layout

const styles = StyleSheet.create({})