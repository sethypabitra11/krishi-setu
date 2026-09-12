import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { signupUser, verifyAadhaar } from "../../services/auth";
import useAuthStore from "../../store/authStore";
import ScreenContainer from "../../components/ScreenContainer";

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [aadhaarVerified, setAadhaarVerified] = useState(false);

  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);

  const login = useAuthStore((state) => state.login);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);

    // Reset Aadhaar verification when switching away from farmer
    if (selectedRole !== "farmer") {
      setAadhaarNumber("");
      setAadhaarVerified(false);
    }
  };

  const handleAadhaarVerification = async () => {
    if (!aadhaarNumber) {
      Alert.alert("Error", "Please enter your Aadhaar number");
      return;
    }

    if (aadhaarNumber.length !== 12) {
      Alert.alert("Error", "Aadhaar number must contain 12 digits");
      return;
    }

    try {
      setVerifyingAadhaar(true);

      const data = await verifyAadhaar(aadhaarNumber);

      if (data.verified) {
        setAadhaarVerified(true);
        Alert.alert("Verified", "Aadhaar verification successful");
      }
    } catch (error) {
      console.log(
        "Aadhaar verification error:",
        error.response?.data || error.message
      );

      setAadhaarVerified(false);

      Alert.alert(
        "Verification Failed",
        error.response?.data?.message ||
          "Aadhaar verification failed"
      );
    } finally {
      setVerifyingAadhaar(false);
    }
  };

  const handleSignup = async () => {
    if (!name || !email || !password || !role) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (role === "farmer" && !aadhaarVerified) {
      Alert.alert(
        "Aadhaar Verification Required",
        "Please verify your Aadhaar before creating a farmer account."
      );
      return;
    }

    try {
      setCreatingAccount(true);

      const data = await signupUser({
        name,
        email,
        password,
        role,
        aadhaarVerified: role === "farmer" ? true : false,
      });

      // Automatically log the user in
      await login(data.user, data.token);

      console.log("Account created:", data.user);

      
    } catch (error) {
      console.log(
        "Signup error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Signup Failed",
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setCreatingAccount(false);
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

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

      <Text style={styles.roleTitle}>I am a:</Text>

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "consumer" && styles.selectedRole,
          ]}
          onPress={() => handleRoleChange("consumer")}
        >
          <Text
            style={[
              styles.roleText,
              role === "consumer" && styles.selectedRoleText,
            ]}
          >
            Consumer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            role === "farmer" && styles.selectedRole,
          ]}
          onPress={() => handleRoleChange("farmer")}
        >
          <Text
            style={[
              styles.roleText,
              role === "farmer" && styles.selectedRoleText,
            ]}
          >
            Farmer
          </Text>
        </TouchableOpacity>
      </View>

      {role === "farmer" && (
        <View style={styles.verificationContainer}>
          <Text style={styles.verificationTitle}>
            Farmer Verification
          </Text>

          <TextInput
            style={styles.input}
            placeholder="12-digit Aadhaar number"
            value={aadhaarNumber}
            onChangeText={(text) => {
              setAadhaarNumber(text.replace(/[^0-9]/g, ""));
              setAadhaarVerified(false);
            }}
            keyboardType="numeric"
            maxLength={12}
          />

          <TouchableOpacity
            style={[
              styles.verifyButton,
              aadhaarVerified && styles.verifiedButton,
            ]}
            onPress={handleAadhaarVerification}
            disabled={verifyingAadhaar || aadhaarVerified}
          >
            {verifyingAadhaar ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.verifyButtonText}>
                {aadhaarVerified
                  ? "✓ Aadhaar Verified"
                  : "Verify Aadhaar"}
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.demoText}>
            Demo verification: use 123456789012
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.signupButton,
          creatingAccount && styles.disabledButton,
        ]}
        onPress={handleSignup}
        disabled={creatingAccount}
      >
        {creatingAccount ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.signupButtonText}>
            Create Account
          </Text>
        )}
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
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

  roleTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
    marginBottom: 10,
  },

  roleContainer: {
    flexDirection: "row",
    gap: 12,
  },

  roleButton: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  selectedRole: {
    backgroundColor: "#2E7D32",
  },

  roleText: {
    color: "#2E7D32",
    fontSize: 16,
    fontWeight: "600",
  },

  selectedRoleText: {
    color: "#fff",
  },

  verificationContainer: {
    marginTop: 20,
  },

  verificationTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 10,
  },

  verifyButton: {
    height: 48,
    backgroundColor: "#555",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  verifiedButton: {
    backgroundColor: "#2E7D32",
  },

  verifyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  demoText: {
    fontSize: 12,
    color: "#888",
    marginTop: 7,
  },

  signupButton: {
    height: 52,
    backgroundColor: "#2E7D32",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  disabledButton: {
    opacity: 0.7,
  },

  signupButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});