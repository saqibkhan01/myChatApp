import firestore from '@react-native-firebase/firestore';

  export const sendMessage = async (currentUid, guestUid, message, imgSource) => {
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

export const recieveMessage = async (
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

