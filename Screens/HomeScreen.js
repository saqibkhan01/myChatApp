import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import FontAwesome from "react-native-vector-icons/FontAwesome"
import  Moment  from "moment/moment";
  import firestore from '@react-native-firebase/firestore';

const HomeScreen = ({navigation, user}) => {
    const [getData, setGetData] = useState("")
    

    const getUsers = async () => {
    const querySanp = await firestore()
      .collection("users")
      .where("uid", "!=", user.uid)
      .get()
     const alluser = querySanp.docs.map((docSnap) => docSnap.data());
     setGetData(alluser)
    // console.log(alluser)
  };

  useEffect(() => {
    getUsers();
  }, []);

  const RenderCard = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={
          () =>
            navigation.navigate("chat", {
                name: item.name,
                uid: item.uid,
                pic: item.pic,
                status: item.status,
            })
        }
      >
        <View style={styles.mycard}>
          <Image source={{ uri: item.pic }} style={styles.img} />
          <View>
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>{item.email}</Text>
          </View>
          <Text>{Moment(item.status).format('hh:mm')}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        keyExtractor={(key) => key.uid}
        data={getData}
        renderItem={({item})=> {return <RenderCard item={item} /> }}
      />
      <TouchableOpacity
        style={styles.accountbtn}
        onPress={() => navigation.navigate("Account")}
      >
       <FontAwesome name="user-circle-o" size={30}  color={"black"}/>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  img: { width: 60, height: 60, borderRadius: 30, backgroundColor: "green" },
  text: {
    fontSize: 18,
    marginLeft: 15,
  },
  mycard: {
    flexDirection: "row",

    padding: 20,
    backgroundColor: "white",
  },
  accountbtn: {
    height: 50,
    width: 50,
    borderRadius: 35,
    borderColor: "white",
    backgroundColor: "white",
    elevation: 10,
    padding: 10,
    alignSelf:"flex-end"
    ,justifyContent:"flex-end",
    marginHorizontal:20,
    marginVertical:40
  },
  search: {
    width: 320,
    height: 40,
    borderWidth: 2,
    borderColor: "lightgray",
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    paddingLeft: 15,
    backgroundColor: "lightgray",
    marginLeft: 20,
  },
});


export default HomeScreen

