import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons';
import firestore from '@react-native-firebase/firestore';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import ImgToBase64 from 'react-native-image-base64';
import Moment from 'moment/moment';

// import ImgToBase64 from "react-native-image-base64";

const ChatTwo = ({navigation, route, user}) => {
  const {uid, pic, name, status} = route.params;
  const [message, setMessage] = useState();
  const [currentUid, setCurrentUid] = useState('');
  const [guestUid, setGuestUid] = useState('');
  const [getsms, setGetSms] = useState('');
  const [imgSource, setimgSource] = useState(null);

  useEffect(() => {
    setGuestUid(uid);
    setCurrentUid(user.uid);
    GetAllMessage();
  }, []);

  // //message send
  const Messagesend = async () => {
    if (message) {
      await sendMessage(currentUid, guestUid, message, '')
        .then(res => {
          console.log(res);
          setMessage('');
        })
        .catch(err => {
          alert(err);
        });

      await recieveMessage(currentUid, guestUid, message, '')
        .then(res => {
          console.log(res);
          setMessage('');
        })
        .catch(err => {
          alert(err);
        });
    }
  };
  // // retrive and fetch sms
  const docid = uid > user.uid ? user.uid + '-' + uid : uid + '-' + user.uid;
  const GetAllMessage = async () => {
    const querySanp = await firestore()
      .collection('Chatrooms')
      .doc(docid)
      .collection('messages' + user.uid)
      .orderBy('createdAt', 'desc')
      .get();
    const allsms = querySanp.docs.map(docSnap => docSnap.data());
    // console.log(allsms);
    setGetSms(allsms);
  };
  // // image send
  const ImageSendChat = async () => {
    launchImageLibrary('photo', (response) => {
    ImgToBase64.getBase64String(response.uri)
            .then(async (base64String) => {
                let source = "data:image/jpeg;base64," + base64String;
                setimgSource(source)
                
                sendMessage(currentUid, guestUid, '', imgSource).
                    then((res) => {
                        
                    }).catch((err) => {
                        alert(err)
                    })

                recieveMessage(currentUid, guestUid, '', imgSource).
                    then((res) => {
                        
                    }).catch((err) => {
                        alert(err)
                    })
            })
           
    })
  };



  /////////
   const sendMessage = async (currentUid, guestUid, message, imgSource) => {
    const docid =
      currentUid > guestUid
        ? guestUid + "-" + currentUid
        : currentUid + "-" + guestUid;
    const mysms = {
      sendby: currentUid,
      sendto: guestUid,
      message: message,
      createdAt: new Date().toUTCString(),
      image: imgSource,
    };
  
    try {
      await firestore()
        .collection("Chatrooms")
        .doc(docid)
        .collection("messages" + currentUid)
        .add({
          ...mysms,
        });
      user: {
        _id: 2;
      }
    } catch (err) {
      alert("something went wrong");
    }
  };
  
   const recieveMessage = async (
    currentUid,
    guestUid,
    message,
    imgSource
  ) => {
    const docid =
      currentUid > guestUid
        ? guestUid + "-" + currentUid
        : currentUid + "-" + guestUid;
    const mysms = {
      currentUid: currentUid,
      guestUid: guestUid,
      message: message,
      createdAt: new Date().toUTCString(),
      image: imgSource,
    };
  
    try {
      await firestore()
        .collection("Chatrooms")
        .doc(docid)
        .collection("messages" + guestUid)
        .add({
          ...mysms,
        });
      user: {
        _id: 1;
      }
    } catch (err) {
      alert("something went wrong");
    }
  };
  

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <StatusBar barStyle="light-content" backgroundColor="#0a6c3b" />
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrowleft" size={20} color="white" />
          </TouchableOpacity>
          <Image source={{uri: pic}} style={styles.profileimage} />
          <Text style={styles.headerTxt}>{name}</Text>
        </View>
        <View>
          <Text style={styles.status}>
            {Moment(status).format('YYYY-MM-DD')}
          </Text>
        </View>
      </View>

      <FlatList
        inverted
        style={{marginBottom: 60}}
        data={getsms}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <View
            style={{
              marginVertical: 5,
              maxWidth: Dimensions.get('window').width / 2 + 10,
              alignSelf: currentUid === item.sendby ? 'flex-end' : 'flex-start',
            }}>
            <View
              style={{
                borderRadius: 20,
                backgroundColor: currentUid === item.sendby ? '#fff' : '#ccc',
              }}>
              {item.image === '' ? (
                <Text style={{padding: 10, fontSize: 16, fontWeight: 'bold'}}>
                  {item.message} {'   '}{' '}
                  <Text style={{fontSize: 12}}>
                    {Moment(item.createdAt).format('hh:mm A')}
                  </Text>
                </Text>
              ) : (
                <View>
                  <Image
                    source={{uri: item.image}}
                    style={{
                      width: Dimensions.get('window').width / 2 + 10,
                      height: 150,
                      resizeMode: 'stretch',
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      position: 'absolute',
                      bottom: 5,
                      right: 5,
                    }}>
                    {Moment(item.createdAt).format('hh:mm A')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
      />

      <View style={styles.container2}>
        <TouchableOpacity
          style={{
            width: '10%',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 5,
          }}
          onPress={() => ImageSendChat()}>
          <Icon name="camera" size={30} color="#fff" />
        </TouchableOpacity>
        <View style={{width: '75%', justifyContent: 'center'}}>
          <TextInput
            value={message}
            onChangeText={text => setMessage(text)}
            placeholder="Enter Message"
            placeholderTextColor="#000"
            style={{height: 40, borderRadius: 20, backgroundColor: '#ccc'}}
          />
        </View>
        <TouchableOpacity style={styles.sendbtn} onPress={() => Messagesend()}>
          <Icon name="send" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#0a6c3b',
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
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: -25,
    color: 'white',
  },
  status: {
    marginLeft: 90,
    marginTop: -35,
    color: 'white',
  },
  container2: {
    bottom: 0,
    height: 50,
    width: '100%',
    position: 'absolute',
    flexDirection: 'row',
  },
  sendbtn: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
});

export default ChatTwo;

  