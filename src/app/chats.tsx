import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Protected from '@/components/Protected'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import { useApp, Chat } from '@/global'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const chats = () => {
    const [text, settext] = useState('');
    const { email } = useLocalSearchParams();
    const flatRef = useRef<FlatList>(null);
    const { users, user, token, setchats, chats, url, lastTimeStamp, socket, onlineUsers } = useApp();

    function getName() {
        if (!email) return ''
        const sender = users.find(f => f?.email === email);
        return sender?.name || email;
    }

    const getMessages = useMemo(() => {
        return chats.filter(f => f.sender === email || f.receiver === email);
    }, [chats, email])

    const status = () => {
        if (!email) return false;
        return onlineUsers.includes(`${email}`);
    }

    async function sendMessage() {
        const newMessage: Chat = {
            sender: `${user?.email}`,
            receiver: `${email}`,
            timestamp: Date.now(),
            content: text,
            status: 'sending',
        }
        const chatsString = await AsyncStorage.getItem('chats');
        const chats: Chat[] = chatsString != null ? JSON.parse(chatsString) : [];
        const newChats = [...chats, newMessage];
        await AsyncStorage.setItem('chats', JSON.stringify(newChats));
        setchats(newChats);
        settext('');
        axios.post(url + '/send-chat', newMessage, { headers: { Authorization: `Bearer ${token}` } }).then(async (data) => {
            const c: Chat = data.data;
            const localChatsString = await AsyncStorage.getItem('chats');
            const localChats: Chat[] = localChatsString != null ? JSON.parse(localChatsString) : [];

            const newChats: Chat[] = localChats.map(a => (
                a.receiver == c.receiver &&
                a.content == c.content &&
                a.sender == c.sender &&
                a.timestamp == c.timestamp
            ) ? ({ ...a, status: "sent" }) : a);

            await AsyncStorage.setItem('chats', JSON.stringify(newChats));
            setchats(newChats);
            setTimeout(() => {
                flatRef.current?.scrollToEnd({ animated: true })
            }, 200)
        }).catch((err) => alert(err?.response?.data?.message || err.message))
    }

    useEffect(() => {
        if (!email || !user) return
        const messages: Chat = {
            sender: `${email}`,
            receiver: user?.email,
            timestamp: Date.now(),
            content: '',
            status: 'read'
        }
        socket.current?.emit('read', messages)
    }, [lastTimeStamp]);

    useEffect(() => {
        setTimeout(() => {
            flatRef.current?.scrollToEnd({ animated: false })
        }, 200)
    }, [])

    if (!email) { return <Redirect href='/' /> }

    const renderItem = ({ item, index }: { item: Chat, index: number }) => {
        return (
            <View style={item.sender === user?.email ? styles.rightRow : styles.lfetRow}>
                <View style={item.sender === user?.email ? styles.rightBubble : styles.leftBubble}>
                    <Text style={styles.text}>{item.content}</Text>
                    {
                        item.sender === user?.email && <>
                            {
                                item.status === 'read' && <Ionicons color={'#2bdf46'} name='checkmark-done' size={16} />
                            }
                            {
                                item.status === 'sent' && <Ionicons color={'#ccc'} name='checkmark-outline' size={16} />
                            }
                            {
                                item.status === 'received' && <Ionicons color={'#ccc'} name='checkmark-done' size={16} />
                            }
                            {
                                item.status === 'sending' && <Ionicons color={'#ccc'} name='time-outline' size={16} />
                            }
                        </>
                    }
                </View>
            </View>
        )
    }

    return (
        <Protected>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.profilePic}>
                        <MaterialIcons name='person' size={30} />
                    </View>
                    <View style={styles.headerMiddle}>
                        <Text style={styles.title}>{getName()}</Text>
                        <Text style={{ color: status() ? "#0cc53e" : "#e73030" }}>{status() ? 'online' : 'offline'}</Text>
                    </View>
                    <TouchableOpacity>
                        <MaterialIcons name="video-call" size={30}/>
                    </TouchableOpacity>
                </View>
                <FlatList
                    ref={flatRef}
                    style={styles.messagesContainer}
                    data={getMessages}
                    keyExtractor={(item: Chat, index: number) => `${index}`}
                    renderItem={renderItem}
                />
                <View style={styles.footer}>
                    <TextInput style={styles.input} multiline value={text} onChangeText={settext} />
                    {!!text && <TouchableOpacity onPress={sendMessage}>
                        <MaterialIcons name='send' size={50} />
                    </TouchableOpacity>}
                </View>
            </View>
        </Protected>
    )
}

export default chats

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        borderColor: "#ccc",
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        padding: 5,
        borderColor: "#ccc",
        borderBottomWidth: 1,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    headerMiddle: {
        flex: 1,
        overflow: 'hidden'
    },
    title: {
        fontWeight: "500",
        fontSize: 18,
    },
    messagesContainer: {
        flex: 1
    },
    lfetRow: {
        alignItems: 'flex-start',
        margin: 2
    },
    rightRow: {
        alignItems: "flex-end",
        margin: 2
    },
    leftBubble: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#1b83d8",
    },
    rightBubble: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#111",
    },
    text: {
        color: '#fff',
        fontSize: 16
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
        borderColor: "#ccc",
        borderTopWidth: 1,
        gap: 10
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 25,
        borderColor: "#ccc",
        borderWidth: 1,
        flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 5,
        fontSize:18
    }
})