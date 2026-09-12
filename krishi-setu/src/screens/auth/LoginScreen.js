import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { loginUser } from "../../services/auth";
import useAuthStore from "../../store/authStore";

import React, { useState } from "react";


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Please enter email and password");
    return;
  }

  try {
    const data = await loginUser({
      email,
      password,
    });

    await login(data.user, data.token);

    Alert.alert(
      "Success",
      `Welcome ${data.user.name}!`
    );
  } catch (error) {
    console.log(error.response?.data);

    Alert.alert(
      "Login Failed",
      error.response?.data?.message || "Something went wrong"
    );
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌱</Text>

      <Text style={styles.title}>Krishi Setu</Text>

      <Text style={styles.subtitle}>
        Fresh produce directly from trusted farmers
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={styles.signupText}>
          Don't have an account? <Text style={styles.bold}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },

  logo: {
    fontSize: 55,
    textAlign: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 35,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },

  loginButton: {
    height: 52,
    backgroundColor: "#2E7D32",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
  },

  loginText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },

  signupText: {
    textAlign: "center",
    color: "#666",
  },

  bold: {
    fontWeight: "bold",
    color: "#2E7D32",
  },
});