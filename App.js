import { View, Text } from 'react-native'
import { useState, useEffect } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignupScreen from './Screens/SignupScreen';
import LoginScreen from './Screens/LoginScreen';
import AccountScreen from './Screens/AccountScreen';
import ChatScreen from './Screens/ChatScreen';
import HomeScreen from './Screens/HomeScreen';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ChatTwo from './Screens/ChatTwo';


const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setuser] = useState("");
  useEffect(() => {
    const unregister = auth().onAuthStateChanged((userExist) => {
      if (userExist) {
        firestore().collection("users").doc(userExist.uid).update({
          status: "online",
        });
        setuser(userExist);
      } else setuser("");
    });

    return () => {
      unregister();
    };
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              options={{
                statusBarColor: "#0a6c3b",
                title: "ChatApp",
                headerTitleStyle: {
                  color: "white",
                },
                headerStyle: {
                  backgroundColor: "#0a6c3b",
                },
              }}
            >
              {(props) => <HomeScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
              name="chat"
              // options={({ route }) => ({ title: route.params.name })}
              options={{ headerShown: false }}
            >
              {(props) => <ChatScreen {...props} user={user} />}
            </Stack.Screen>
            {/* default ChatTwo */}
            <Stack.Screen name="chatTwo" options={{ headerShown: false }}>
              {(props) => <ChatTwo {...props} user={user} />}
            </Stack.Screen>

            <Stack.Screen name="Account">
              {(props) => <AccountScreen {...props} user={user} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App