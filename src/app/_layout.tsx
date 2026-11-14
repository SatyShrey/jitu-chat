import { StatusBar, StyleSheet } from 'react-native'
import { Stack } from 'expo-router';
import { MyProvider } from '@/global';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Layout = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle='dark-content' />
        <MyProvider>
          <Stack screenOptions={{
            headerShown: false,
            animation: "slide_from_right"
          }} />
        </MyProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default Layout;

const styles = StyleSheet.create({})