import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SecureInput = ({ style, ...restProps }: TextInputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View style={styles.container}>
            <TextInput
                {...restProps}
                secureTextEntry={!isPasswordVisible}
                style={[styles.input, style]}
                placeholderTextColor="#8A8A8A"
            />
            <Pressable
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                style={styles.iconContainer}
            >
                <MaterialCommunityIcons
                    name={isPasswordVisible ? 'eye-off' : 'eye'}
                    size={22}
                    color="#666"
                />
            </Pressable>
        </View>
    );
};

export default SecureInput;

const styles = StyleSheet.create({
    container: {
        position: "relative",
        flexDirection: "row",
    },
    input: {
        flex: 1,
    },
    iconContainer: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center",
        width:40
    }
});
