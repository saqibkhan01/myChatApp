import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    Image,
    TouchableOpacity,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import  Icon  from "react-native-vector-icons/MaterialIcons";
  import auth from '@react-native-firebase/auth';
  import firestore from '@react-native-firebase/firestore';
 
const AccountScreen = ({user}) => {
    const [profile, setProfile] = useState("");

  useEffect(() => {
    firestore()
      .collection("users")
      .doc(user.uid)
      .get()
      .then((docSnap) => {
        setProfile(docSnap.data());
      });
  }, []);
  if (!profile) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }
  return (
    <View style={styles.container}>
      <Image style={styles.img} source={{ uri: profile.pic }} />
      <Text style={styles.text}>Name - {profile.name}</Text>
      <View style={{ flexDirection: "row" }}>
        <Icon name="email" size={30} color="white" />
        <Text style={[styles.text, { marginLeft: 10 }]}>{profile.email}</Text>
      </View>
      <TouchableOpacity
        style={styles.btn}
        mode="contained"
        onPress={() => {
          firestore()
            .collection("users")
            .doc(user.uid)
            .update({
              // status:firestore.FieldValue.serverTimestamp()
              status: new Date().toUTCString()
            })
            .then(() => {
              auth().signOut();
            });
        }}
      >
        <Text style={{ padding: 10, fontWeight: "bold" }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  img: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "white",
  },
  text: {
    fontSize: 23,
    color: "white",
  },
  btn: {
    borderColor: "white",
    borderWidth: 3,
  },
});


export default AccountScreen

