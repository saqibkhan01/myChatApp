import {
    View,
    Text,
    Image,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Alert,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import {
    GiftedChat,
    Bubble,
    InputToolbar,
  } from "react-native-gifted-chat";
  import  Icon  from "react-native-vector-icons/AntDesign";
  import Moment from "moment/moment"


  import firestore from '@react-native-firebase/firestore';

  const ChatScreen = ({navigation, route, user}) => {
    const { uid, pic, name, status } = route.params;
    const [messages, setMessages] = useState([]);

  useEffect(() => {
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;
    const messageRef = firestore()
      .collection("chatrooms")
      .doc(docid)
      .collection("messages")
      .orderBy("createdAt", "desc");

    const unSubscribe = messageRef.onSnapshot((querySnap) => {
      const allmsg = querySnap.docs.map((docSanp) => {
        const data = docSanp.data();

        if (data.createdAt) {
          return {
            ...docSanp.data(),
            createdAt: docSanp.data().createdAt.toDate(),
          };
        } else {
          return {
            ...docSanp.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allmsg);
    });

    return () => {
      unSubscribe();
    };
  }, []);
  const onSend = (messageArray) => {
    console.log(messageArray);
    const msg = messageArray[0];
    const mymsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: uid,
      padding: true,
      sent: true,
      //pic: image.uri,
      // createdAt: new Date(),
    };
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, mymsg)
    );
    const docid = uid > user.uid ? user.uid + "-" + uid : uid + "-" + user.uid;

    firestore()
      .collection("chatrooms")
      .doc(docid)
      .collection("messages")
      .add({
        ...mymsg,
        // createdAt: new Date(),
      });
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0a6c3b" />
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrowleft" size={30} color="white" />
          </TouchableOpacity>
          <Image source={{ uri: pic }} style={styles.profileimage} />
          <Text style={styles.headerTxt}>{name}</Text>
        </View>
        <View>
          <Text style={styles.status}>{Moment(status).format('hh:mm')}</Text>
        </View>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(text) => onSend(text)}
        showAvatarForEveryMessage={true}
        user={{
          _id: user.uid,
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: "green",
                },
              }}
            />
          );
        }}
        renderInputToolbar={(props) => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{ borderTopWidth: 1.5, borderTopColor: "green" }}
              textInputStyle={{ color: "black" }}
            />
          );
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#0a6c3b",
    paddingVertical: 15,
  },
  profileimage: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginLeft: 3,
  },
  headerTxt: {
    marginLeft: 15,
    fontWeight: "bold",
    fontSize: 20,
    marginTop: -25,
    color: "white",
  },
  status: {
    marginLeft: 90,
    marginTop: -35,
    color: "white",
  },
});

export default ChatScreen

