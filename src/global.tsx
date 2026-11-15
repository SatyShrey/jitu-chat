import { createContext, Dispatch, ReactNode, RefObject, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import Loader from "./components/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, type Socket } from 'socket.io-client';
import axios from "axios";
import { useLocalSearchParams } from "expo-router";
import ConfirmBox from "./components/ConfirmBox";
import AlertBox from "./components/AlertBox";
import { Alert, BackHandler } from "react-native";

type User = { name: string, email: string } | null;
export type Chat = {
    sender: string,
    receiver: string,
    content: string,
    timestamp: number,
    status: 'read' | 'sent' | 'received' | 'sending',
}
type ConfirmProp = {
    text: string,
    task: () => void,
    title?: string,
}
type AlertProp = {
    text: string,
    title?: string,
    task?: () => void,
    buttonText?: string,
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
    socket: RefObject<Socket | null>,
    onlineUsers: string[],
    setconfirmValue: Dispatch<SetStateAction<ConfirmProp | null>>,
    alert: (text: string, title?: string) => void
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
    const [confirmValue, setconfirmValue] = useState<ConfirmProp | null>(null);
    const [alertValue, setalertValue] = useState<AlertProp | null>(null)
    const url = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.45:5000';
    const { email } = useLocalSearchParams();

    const alert = (text: string, title?: string, buttonText?: string, task?: () => void) => {
        setalertValue({ text, title, buttonText, task })
    }

    const asyncFunction = async () => {
        const userString = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');
        const user = userString != null ? JSON.parse(userString) : null;
        if (!user || !token) { return setloaded(true) };
        axios.get(url + '/user/', { headers: { Authorization: `Bearer ${token}` } }).then((data) => {
            settoken(token);
            setuser(data.data);
            setloaded(true);
        }).catch((e) => {
            if (e.message == "Network Error") {
                return Alert.alert(e.message, "Please check your network connection.",[
                    {text:"Retry",onPress:asyncFunction},
                    {text:"Exit",onPress:BackHandler.exitApp}
                ])
            }
            setloaded(true);
        })
    }

    useEffect(() => {
        asyncFunction();
    }, []);

    useEffect(() => {
        if (email) {
            AsyncStorage.setItem('receiver-id', `${email}`)
        } else {
            AsyncStorage.removeItem('receiver-id');
        }
    }, [email]);

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
            const receiverId = await AsyncStorage.getItem('receiver-id');
            const newMessage: Chat = (receiverId && receiverId == message.sender) ? { ...message, status: "read" } : message;
            array.push(newMessage);
            await AsyncStorage.setItem('chats', JSON.stringify(array));
            setchats(array);
            socket.current?.emit('received', message);
            if (receiverId && receiverId === message.sender) {
                socket.current?.emit('read', message);
            }
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
        });

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

        axios.get(url + '/retrive-data/' + user.email, { headers: { Authorization: `Bearer ${token}` } }).then(async (data) => {
            const msgs = await AsyncStorage.getItem('chats');
            const array = msgs != null ? JSON.parse(msgs) : [];
            const newArray = [...array, ...data.data.messages];
            await AsyncStorage.setItem('chats', JSON.stringify(newArray));
            await AsyncStorage.setItem('users', JSON.stringify(data.data.users));
            setusers(data.data.users)
            setchats(newArray)
        }).catch(e => alert(e.response?.data?.message || e.message))

        return () => {
            socket.current?.disconnect();
        }
    }, [user])

    if (!loaded) {
        return null
    }

    return (
        <MyContexts.Provider value={{
            user, setloading, setuser, alert, url, users, chats, setchats, token, settoken, socket, onlineUsers, setconfirmValue
        }}>
            {children}
            {loading && <Loader />}
            {confirmValue &&
                <ConfirmBox
                    text={confirmValue.text}
                    task={confirmValue.task}
                    reset={() => { setconfirmValue(null) }}
                    title={confirmValue.title}
                />
            }
            {alertValue &&
                <AlertBox
                    text={alertValue.text}
                    title={alertValue.title}
                    task={alertValue.task}
                    buttonText={alertValue.buttonText}
                    reset={() => setalertValue(null)}
                />
            }
        </MyContexts.Provider>
    )
}

export const useApp = () => {
    const values = useContext(MyContexts);
    if (!values) { throw new Error('Context value error') }
    return values;
}