import { createContext, Dispatch, ReactNode, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import Loader from "./components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, type Socket } from 'socket.io-client';
import axios from "axios";

type User = { name: string, email: string } | null;
export type Chat = {
    sender: string,
    receiver: string,
    content: string,
    timestamp: number,
    status: 'read' | 'sent' | 'received' | 'sending',
}
type ContextValue = {
    user: User | null,
    setloading: Dispatch<SetStateAction<boolean>>,
    setuser: Dispatch<SetStateAction<User | null>>,
    url: string,
    users: User[],
    chats: Chat[],
    setchats: Dispatch<SetStateAction<Chat[]>>,
    token: string,
    settoken: Dispatch<SetStateAction<string>>,
    lastTimeStamp: string,
    socket: RefObject<Socket | null>,
    onlineUsers: string[],
}

const MyContexts = createContext<ContextValue | null>(null);
export const MyProvider = ({ children }: { children: ReactNode }) => {
    const [user, setuser] = useState<User | null>(null);
    const [loading, setloading] = useState(false);
    const [loaded, setloaded] = useState(false);
    const socket = useRef<Socket | null>(null);
    const [users, setusers] = useState<User[]>([]);
    const [chats, setchats] = useState<Chat[]>([]);
    const [onlineUsers, setonlineUsers] = useState<string[]>([]);
    const [token, settoken] = useState('');
    const [lastTimeStamp, setlastTimeStamp] = useState('');
    const url = 'http://localhost:5000';

    const asyncFunction = async () => {
        const userString = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');
        const user = userString != null ? JSON.parse(userString) : null;
        if (!user || !token) { return setloaded(true) };
        axios.get(url + '/user/', { headers: { Authorization: `Bearer ${token}` } }).then((data) => {
            settoken(token); setuser(data.data);
        }).catch((e) => { }).finally(() => setloaded(true))
    }

    useEffect(() => {
        asyncFunction();
    }, []);

    const asyncFunction2 = async () => {
        const chatsString = await AsyncStorage.getItem('chats');
        const messagesArray = chatsString != null ? JSON.parse(chatsString) : [];
        const usersString = await AsyncStorage.getItem('users');
        const usersArray = usersString != null ? JSON.parse(usersString) : [];
        setchats(messagesArray);
        setusers(usersArray);
    }

    useEffect(() => {
        if (!user) { return }
        socket.current = io(url, { query: { email: user.email } });

        asyncFunction2();

        socket.current.on('new-chat', async (message: Chat) => {
            const existingData = await AsyncStorage.getItem('chats');
            let array = existingData != null ? JSON.parse(existingData) : [];
            array.push(message);
            await AsyncStorage.setItem('chats', JSON.stringify(array));
            setchats(array);
            socket.current?.emit('received', message);
            setlastTimeStamp(`${message.content}${message.receiver}${message.sender}${message.timestamp}${Date.now()}`)
        });

        socket.current.on('received', async (message: Chat) => {
            const existingData = await AsyncStorage.getItem('chats');
            const array: Chat[] = existingData != null ? JSON.parse(existingData) : [];
            const newArray: Chat[] = array.map(a => (
                a.sender === message.sender &&
                a.status === 'sent' &&
                a.timestamp <= message.timestamp &&
                a.receiver === message.receiver
            ) ? { ...a, status: 'received' } : a);
            await AsyncStorage.setItem('chats', JSON.stringify(newArray));
            setchats(newArray);
        })

        socket.current.on('online-users', async (onlineUsers) => {
            setonlineUsers(onlineUsers);
        })

        socket.current.on('read', async (message: Chat) => {
            const existingData = await AsyncStorage.getItem('chats');
            const array: Chat[] = existingData != null ? JSON.parse(existingData) : [];
            const newArray: Chat[] = array.map(a => (
                a.status !== 'read' &&
                a.timestamp <= message.timestamp &&
                a.receiver === message.receiver
            ) ? { ...a, status: "read" } : a);
            await AsyncStorage.setItem('chats', JSON.stringify(newArray));
            setchats(newArray);
        })

        socket.current.on('online-users', (data) => {
            setonlineUsers(data);
        });

        axios.get(url + '/users/' + user.email, { headers: { Authorization: `Bearer ${token}` } }).then(async (data) => {
            await AsyncStorage.setItem('users', JSON.stringify(data.data));
            setusers(data.data)
        }).catch(e => alert(e.response?.data?.message || e.message))

        axios.get(url + '/chats/' + user.email, { headers: { Authorization: `Bearer ${token}` } }).then(async (data) => {
            const msgs = await AsyncStorage.getItem('chats');
            const array = msgs != null ? JSON.parse(msgs) : [];
            const newArray = [...array, ...data.data];
            await AsyncStorage.setItem('chats', JSON.stringify(newArray));
            setchats(newArray)
        }).catch(e => alert(e.response?.data?.message || e.message))

        return () => {
            socket.current?.disconnect();
        }
    }, [user])

    return (
        <MyContexts.Provider value={{
            user, setloading, setuser, url, users, chats, setchats, token, settoken, lastTimeStamp, socket,onlineUsers
        }}>
            {children} {loading && <Loader />}
        </MyContexts.Provider>
    )
}

export const useApp = () => {
    const values = useContext(MyContexts);
    if (!values) { throw new Error('Context value error') }
    return values;
}