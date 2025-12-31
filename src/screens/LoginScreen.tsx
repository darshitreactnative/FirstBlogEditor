// src/screens/LoginScreen.tsx
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../firebase";

//  Google webClientId
GoogleSignin.configure({
  webClientId:
    "450921957584-becvvuodvf7khmbutk8nuupir3al01q1.apps.googleusercontent.com",
});

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const result = await GoogleSignin.signIn();
      const idToken = result?.idToken || result?.data?.idToken;
      if (!idToken) {
        throw new Error("Google Sign-In failed (no idToken)");
      }
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);

      console.log("LOGIN SUCCESS:", auth.currentUser?.email);
    } catch (error: any) {
      Alert.alert("Login failed", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Offline First Blog Editor</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={signInWithGoogle}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.text}>Sign in with Google</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 40,
    color: "#111",
  },
  button: {
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    borderRadius: 8,
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
});














// import { GoogleSignin } from "@react-native-google-signin/google-signin";
// import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { auth } from "../firebase";

// // Configure Google Sign-In with correct Web Client ID
// GoogleSignin.configure({
//   webClientId:
//     "450921957584-becvvuodvf7khmbutk8nuupir3al01q1.apps.googleusercontent.com",
//   offlineAccess: false,
//   forceCodeForRefreshToken: false,
// });

// export default function Login() {
//   const [loading, setLoading] = useState(false);

// const signInWithGoogle = async () => {
//   try {
//     setLoading(true);
//     await GoogleSignin.hasPlayServices({
//       showPlayServicesUpdateDialog: true,
//     });
//     const result = await GoogleSignin.signIn();
//     const idToken = result?.idToken || result?.data?.idToken;
//     if (!idToken) throw new Error("Google did not return idToken");
//     const credential = GoogleAuthProvider.credential(idToken);
//     await signInWithCredential(auth, credential);
//     console.log("LOGIN SUCCESS:", auth.currentUser?.email);
//   } catch (error: any) {
//     Alert.alert("Login failed", error.message || "Google Sign-In failed");
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Offline First Blog Editor</Text>

//       <TouchableOpacity
//         style={styles.button}
//         onPress={signInWithGoogle}
//         disabled={loading}
//         activeOpacity={0.8}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.text}>Sign in with Google</Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 24,
//     backgroundColor: "#ffffff",
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "600",
//     textAlign: "center",
//     marginBottom: 40,
//     color: "#111",
//   },
//   button: {
//     backgroundColor: "#4285F4",
//     paddingVertical: 14,
//     borderRadius: 8,
//   },
//   text: {
//     color: "#fff",
//     textAlign: "center",
//     fontSize: 16,
//     fontWeight: "500",
//   },
// });
