import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    SafeAreaView,
    TouchableOpacity,
    StatusBar,
    Alert,
    ActivityIndicator,
  } from "react-native";
  import React, { useState } from "react";
  import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const SignupScreen = ({navigation}) => {
    const backImage = require("../assets/backImage.png");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [image, setImage] = useState(null);
    const [repassword, setRePassword] = useState("")
    const [loading, setLoading] = useState(false);
  
    if (loading) {
      return <ActivityIndicator size="large" color="#00ff00" />;
    }
  
    const userSignup = async () => {
      setLoading(true);
      // if (!email || !password || !name ||repassword) {
      //   alert("please add all the field");
      //   return;
      // }else if(!password || !repassword) {
      //   alert("password is not same");
      //   return;
      // }
       
      
      try {
        const result = await auth().createUserWithEmailAndPassword(email, password);
        firestore().collection("users").doc(result.user.uid).set({
          name: name,
          email: result.user.email,
          uid: result.user.uid,
          pic: image,
          status: "online",
        });
        setLoading(false);
        alert("user Profile Regestered");
      } catch (err) {
        alert("something went wrong");
      }
    };
    const pickImage = () => {
      launchCamera({ quality: 0.5 }, (result) => {
            if (result.errorCode || result.didCancel) {
              return console.log('You should handle errors or user cancellation!');
            }
            const img = result.assets[0];
            const uploadTask = storage()
              .ref()
              .child(`/userimage/${Date.now()}`)
              .putFile(img.uri);
        
            uploadTask.on(
              'state_changed',
              (snapshot) => {
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (progress == 100) {
                  alert('User image Uploaded');
                }
              },
              (error) => {
                alert('something went wrong');
              },
              () => {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                  console.log(downloadURL);
                  setImage(downloadURL);
                });
              },
            );
          });
    };
  return (
    <View style={styles.container}>
      <Image source={backImage} style={styles.backImage} />
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          style={styles.input}
          placeholder="User Name"
          autoCapitalize="none"
          keyboardType="Text"
          textContentType="name"
          autoFocus={true}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Re-password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={repassword}
          onChangeText={(text) => setRePassword(text)}
        />
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: "blue",
            },
          ]}
          onPress={() => pickImage()}
        >
          <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
            {" "}
            upload Image
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          disabled={image ? false : true}
          onPress={() => userSignup()}
        >
          <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
            {" "}
            Sign Up
          </Text>
        </TouchableOpacity>
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Text style={{ color: "gray", fontWeight: "600", fontSize: 14 }}>
            Aleardy have an account{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={{ color: "#f57c00", fontWeight: "600", fontSize: 14 }}>
              {" "}
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "orange",
    alignSelf: "center",
    paddingBottom: 24,
    marginTop: 40,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  backImage: {
    width: "100%",
    height: 340,
    position: "absolute",
    top: 0,
    resizeMode: "cover",
  },
  whiteSheet: {
    width: "100%",
    height: "75%",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: "#f57c00",
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
});


export default SignupScreen

