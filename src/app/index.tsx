import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Protected from '@/components/Protected'
import { useApp } from '@/global';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const App = () => {
  const { user, users, chats } = useApp();

  const unreadCount = (email: string | undefined) => {
    if (!email) return 0;
    const unreadChats = chats.filter(f => (f.receiver == user?.email && f.sender == email && f.status != "read"));
    return unreadChats.length
  }

  return (
    <Protected>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity style={styles.menuBtn} onPress={() => router.push('/profile')}>
            <MaterialIcons name='person' size={30} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.containContainer}>
          {
            users && users.map((u, i) => (
              <TouchableOpacity style={styles.row} key={i}
                onPress={() => router.push({ pathname: "/chats", params: { email: u?.email } })}
              >
                <View style={styles.userPic} >
                  <MaterialIcons name='person' size={30} />
                </View>
                <View style={unreadCount(u?.email) > 0 ? styles.unread : { display: "none" }}>
                  <Text style={styles.unreadText}>{unreadCount(u?.email)}</Text>
                </View>
                <Text style={styles.name}>{u?.name}</Text>
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </View>
    </Protected>
  )
}

export default App

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    alignItems: "center"
  },
  title: {
    fontSize: 25,
    fontWeight: "600"
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containContainer: {
    padding: 0,
  },
  row: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 10,
  },
  userPic: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    borderColor: "#ccc",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 18,
  },
  unread: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: "50%",
    backgroundColor: "#df1d1d",
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
  }
})