// Import React Hooks
import React, {useRef, useState, useEffect} from 'react';
// Import user interface elements
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// Import components for obtaining Android device permissions
import {PermissionsAndroid, Platform} from 'react-native';
// Import Agora SDK
import {
  ClientRoleType,
  createAgoraRtcEngine,
  ChannelProfileType,
} from 'react-native-agora';

// Define basic information
const appId = '2a501d37b13542aea209f6a418c0aa5f';
const token =
  '007eJxTYEhIY7gWw5ybKKOe2RVQ4GvYtFTLhW3zOr1vIbk3+dMkOhQYjBJNDQxTjM2TDI1NTYwSUxONDCzTzBJNDC2SDRITTdPq9malNQQyMmx5U8jACIUgPjdDSGpxiXNGYl5eag4DAwD2oB8Z';
const channelName = 'TestChannel';
const uid = 0; // Local user UID, no need to modify

const App = () => {
  const agoraEngineRef = useRef(null); // IRtcEngine instance
  const [isJoined, setIsJoined] = useState(false); // Whether the local user has joined the channel
  const [remoteUid, setRemoteUid] = useState(0); // Remote user UID
  const [message, setMessage] = useState(''); // User prompt message

  // Initialize the engine when starting the App
  useEffect(() => {
    setupVideoSDKEngine();
  }, []);

  const setupVideoSDKEngine = async () => {
    try {
      // Create RtcEngine after checking and obtaining device permissions
      if (Platform.OS === 'android') {
        await getPermission();
      }
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;

      // Register event callbacks
      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          showMessage('Successfully joined the channel: ' + channelName);
          setIsJoined(true);
        },
        onUserJoined: (_connection, Uid) => {
          showMessage('Remote user ' + Uid + ' has joined');
          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, Uid) => {
          showMessage('Remote user ' + Uid + ' has left the channel');
          setRemoteUid(0);
        },
      });
      // Initialize the engine
      agoraEngine.initialize({
        appId: appId,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // Define the join method called after clicking the join channel button
  const join = async () => {
    if (isJoined) {
      return;
    }
    try {
      // Set the channel profile type to communication after joining the channel
      agoraEngineRef.current?.setChannelProfile(
        ChannelProfileType.ChannelProfileCommunication,
      );
      // Call the joinChannel method to join the channel
      agoraEngineRef.current?.joinChannel(token, channelName, uid, {
        // Set the user role to broadcaster
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    } catch (e) {
      console.log(e);
    }
  };

  // Define the leave method called after clicking the leave channel button
  const leave = () => {
    try {
      // Call the leaveChannel method to leave the channel
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      showMessage('Left the channel');
    } catch (e) {
      console.log(e);
    }
  };

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  };

  // Render the user interface
  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.head}>Agora Voice Call Quick Start</Text>
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={() => join()}>
          <Text style={styles.button}>Join Channel</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => leave()}>
          <Text style={styles.button}>Leave Channel</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContainer}>
        {isJoined ? (
          <Text>Local user UID: {uid}</Text>
        ) : (
          <Text>Join a channel</Text>
        )}
        {isJoined && remoteUid !== 0 ? (
          <Text>Remote user UID: {remoteUid}</Text>
        ) : (
          <Text>Waiting for remote users to join</Text>
        )}
        <Text>{message}</Text>
      </ScrollView>
    </SafeAreaView>
  );

  // Display message
  function showMessage(msg) {
    setMessage(msg);
  }
};

// Define user interface styles
const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 25,
    paddingVertical: 4,
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#0055cc',
    margin: 5,
  },
  main: {flex: 1, alignItems: 'center'},
  scroll: {flex: 1, backgroundColor: '#ddeeff', width: '100%'},
  scrollContainer: {alignItems: 'center', backgroundColor: 'black'},
  videoView: {width: '90%', height: 200},
  btnContainer: {flexDirection: 'row', justifyContent: 'center'},
  head: {fontSize: 20},
});

export default App;

// // Import React Hooks
// import React, { useRef, useState, useEffect } from 'react';
// // Import user interface elements
// import {
//     SafeAreaView,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// // Import components for obtaining Android device permissions
// import { PermissionsAndroid, Platform } from 'react-native';
// // Import Agora SDK
// import {
//     ClientRoleType,
//     createAgoraRtcEngine,
//     IRtcEngine,
//     ChannelProfileType,
// } from 'react-native-agora';

// // Define basic information
// const appId = '2a501d37b13542aea209f6a418c0aa5f';
// const token = '007eJxTYEhIY7gWw5ybKKOe2RVQ4GvYtFTLhW3zOr1vIbk3+dMkOhQYjBJNDQxTjM2TDI1NTYwSUxONDCzTzBJNDC2SDRITTdPq9malNQQyMmx5U8jACIUgPjdDSGpxiXNGYl5eag4DAwD2oB8Z';
// const channelName = 'TestChannel';
// const uid = 0; // Local user UID, no need to modify

// const App = () => {
//     const agoraEngineRef = useRef<IRtcEngine>(); // IRtcEngine instance
//     const [isJoined, setIsJoined] = useState(false); // Whether the local user has joined the channel
//     const [remoteUid, setRemoteUid] = useState(0); // Remote user UID
//     const [message, setMessage] = useState(''); // User prompt message

//     // Initialize the engine when starting the App
//     useEffect(() => {
//         setupVideoSDKEngine();
//     });
//     const setupVideoSDKEngine = async () => {
//         try {
//             // Create RtcEngine after checking and obtaining device permissions
//             if (Platform.OS === 'android') {
//                 await getPermission();
//             }
//             agoraEngineRef.current = createAgoraRtcEngine();
//             const agoraEngine = agoraEngineRef.current;

//             // Register event callbacks
//             agoraEngine.registerEventHandler({
//                 onJoinChannelSuccess: () => {
//                     showMessage('Successfully joined the channel: ' + channelName);
//                     setIsJoined(true);
//                 },
//                 onUserJoined: (_connection, Uid) => {
//                     showMessage('Remote user ' + Uid + ' has joined');
//                     setRemoteUid(Uid);
//                 },
//                 onUserOffline: (_connection, Uid) => {
//                     showMessage('Remote user ' + Uid + ' has left the channel');
//                     setRemoteUid(0);
//                 },
//             });
//             // Initialize the engine
//             agoraEngine.initialize({
//                 appId: appId,
//             });
//         } catch (e) {
//             console.log(e);
//         }
//     };

//     // Define the join method called after clicking the join channel button
//     const join = async () => {
//         if (isJoined) {
//             return;
//         }
//         try {
//             // Set the channel profile type to communication after joining the channel
//             agoraEngineRef.current?.setChannelProfile(
//                 ChannelProfileType.ChannelProfileCommunication,
//             );
//             // Call the joinChannel method to join the channel
//             agoraEngineRef.current?.joinChannel(token, channelName, uid, {
//                 // Set the user role to broadcaster
//                 clientRoleType: ClientRoleType.ClientRoleBroadcaster,
//             });
//         } catch (e) {
//             console.log(e);
//         }
//     };
//     // Define the leave method called after clicking the leave channel button
//     const leave = () => {
//         try {
//             // Call the leaveChannel method to leave the channel
//             agoraEngineRef.current?.leaveChannel();
//             setRemoteUid(0);
//             setIsJoined(false);
//             showMessage('Left the channel');
//         } catch (e) {
//             console.log(e);
//         }
//     };
//     const getPermission = async () => {
//       if (Platform.OS === 'android') {
//           await PermissionsAndroid.requestMultiple([
//               PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           ]);
//       }
//   };

//     // Render the user interface
//     return (
//         <SafeAreaView style={styles.main}>
//             <Text style={styles.head}>Agora Voice Call Quick Start</Text>
//             <View style={styles.btnContainer}>
//               <TouchableOpacity onPress={() => join()}>
//                 <Text  style={styles.button}>
//                     Join Channel
//                 </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => leave()}>
//                 <Text  style={styles.button}>
//                     Leave Channel
//                 </Text>
//                 </TouchableOpacity>

//             </View>
//             <ScrollView
//                 style={styles.scroll}
//                 contentContainerStyle={styles.scrollContainer}>
//                 {isJoined ? (
//                     <Text>Local user UID: {uid}</Text>
//                 ) : (
//                     <Text>Join a channel</Text>
//                 )}
//                 {isJoined && remoteUid !== 0 ? (
//                     <Text>Remote user UID: {remoteUid}</Text>
//                 ) : (
//                     <Text>Waiting for remote users to join</Text>
//                 )}
//                 <Text>{message}</Text>
//             </ScrollView>
//         </SafeAreaView>
//     );

//     // Display message
//     function showMessage(msg: string) {
//         setMessage(msg);
//     }
// };

// // Define user interface styles
// const styles = StyleSheet.create({
//     button: {
//         paddingHorizontal: 25,
//         paddingVertical: 4,
//         fontWeight: 'bold',
//         color: '#ffffff',
//         backgroundColor: '#0055cc',
//         margin: 5,
//     },
//     main: { flex: 1, alignItems: 'center' },
//     scroll: { flex: 1, backgroundColor: '#ddeeff', width: '100%' },
//     scrollContainer: { alignItems: 'center' ,backgroundColor:'black'},
//     videoView: { width: '90%', height: 200 },
//     btnContainer: { flexDirection: 'row', justifyContent: 'center' },
//     head: { fontSize: 20 },
// });

// export default App;
