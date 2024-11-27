import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "@/context/AuthContext";

// const API_URL = "http://localhost:3000/api/authExpo";
const API_URL = "http://192.168.x.x:3000/api/authExpo"; // Use local IP instead of localhost

export default function HomeScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login, logout } = useAuth();

  // "https://authjs-jade.vercel.app/api/auth/signin"

  const fetchUserData = async () => {
    try {
      // Retrieve the token from SecureStore
      const token = await SecureStore.getItemAsync("authToken");
      console.log("🚀 ~ fetchUserData ~ token:", token);

      if (!token) {
        throw new Error("No token found, please log in again.");
      }

      // Make an authenticated request with the token
      const response = await fetch(
        "https://authjs-jade.vercel.app/api/protectedRoute",
        {
          method: "GET", // Adjust method based on your API's needs
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`, // Include token in Authorization header
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch protected data.");
      }

      const data = await response.json();
      console.log("User data:", data);

      // Return the user data
      return data;
    } catch (error: any) {
      console.error("Error fetching user data:", error.message);
    }
  };

  // Exemple using token to get into protected routes and get to user private data
  // const fetchUserImages = async () => {
  //   try {
  //     const token = await SecureStore.getItemAsync("authToken");
  //     if (!token) throw new Error("No token found.");

  //     const response = await fetch(
  //       "https://your-nextjs-api-url/api/user/images",
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${JSON.parse(token)}`, // Add the token to the header
  //         },
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch images.");
  //     }

  //     const data = await response.json();
  //     console.log("User Images:", data.images); // Show or use the images

  //     return data.images;
  //   } catch (error: any) {
  //     console.error("Error fetching images:", error.message);
  //   }
  // };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://authjs-jade.vercel.app/api/authExpo/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed hhhhh");
      }

      const data = await response.json();
      const token = data.token;
      console.log("🚀 ~ handleLogin ~ token:", token);
      await login(token);
      // JSON-encode the token or user session before saving it in SecureStore
      // await SecureStore.setItemAsync("authToken", JSON.stringify(token));

      return token;
    } catch (error: any) {
      console.error("Login failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello!!</Text>
      <Text style={styles.title}></Text>
      <Button
        title={loading ? "fetching..." : "fetchUserData"}
        onPress={fetchUserData}
        disabled={loading}
      />

      <Button
        title={loading ? "login out..." : "logout"}
        onPress={logout}
        disabled={loading}
      />

      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title={loading ? "Logging in..." : "Login"}
          onPress={handleLogin}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "slate", // Light background for better readability
    padding: 20,
    // height: 3000,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    color: "white",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ddd",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 80,
  },
  button: {
    paddingHorizontal: 48,
    paddingVertical: 12,
    borderRadius: 5,
    backgroundColor: "#50B8E2",
    elevation: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "#eee",
  },
  errorContainer: {
    marginTop: 20,
    backgroundColor: "#FFCDD2", // Light red background for errors
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: "#D32F2F", // Red text color for error message
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    width: "100%",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userItem: {
    backgroundColor: "#fff", // White background for each item
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  userEmail: {
    fontSize: 16,
    color: "#333",
  },
});
