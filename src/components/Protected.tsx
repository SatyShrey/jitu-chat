import { useApp } from '@/global';
import { Redirect } from 'expo-router';
import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Protected = ({ children }: { children: ReactNode }) => {
    const { user } = useApp();
    return user ? (<>{children}</>) : <Redirect href={'/login'} />
}

export default Protected

const styles = StyleSheet.create({})