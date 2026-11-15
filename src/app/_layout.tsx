import { StatusBar, StyleSheet } from 'react-native'
import { Stack } from 'expo-router';
import { MyProvider } from '@/global';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as SystemUI from 'expo-system-ui';
SystemUI.setBackgroundColorAsync('#9daccb');

const Layout = () => {
  const insets=useSafeAreaInsets()
  return (
    <SafeAreaProvider>
      <LinearGradient style={{ flex: 1 }} colors={["#dbeaf1", '#9daccb',]}>
        <SafeAreaView style={{ flex: 1,paddingBottom:insets.bottom,paddingTop:insets.top }} edges={[]}>
          <StatusBar barStyle='dark-content' />
          <MyProvider>
            <Stack screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
              contentStyle: {
                backgroundColor: "transparent"
              }
            }} />
          </MyProvider>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  )
}

export default Layout;

const styles = StyleSheet.create({})