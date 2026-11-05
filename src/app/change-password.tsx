import Protected from '@/components/Protected';
import { StyleSheet, Text, View } from 'react-native';

const App = () => {
    return (
        <Protected>
            <View>
                <Text>App</Text>
            </View>
        </Protected>
    )
}

export default App

const styles = StyleSheet.create({})