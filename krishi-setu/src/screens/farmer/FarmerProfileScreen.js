import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import useAuthStore from "../../store/authStore";
import ScreenContainer from "../../components/ScreenContainer";

export default function FarmerProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: logout,
        },
      ]
    );
  };

  return (
    <ScreenContainer style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0)?.toUpperCase() || "F"}
          </Text>
        </View>

        <Text style={styles.name}>
          {user?.name || "Farmer"}
        </Text>

        <Text style={styles.email}>
          {user?.email || ""}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Account Type</Text>
          <Text style={styles.value}>Farmer</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Aadhaar Status</Text>
          <Text style={styles.verified}>✓ Verified</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9F7",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 20,
  },

  profileCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  name: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#222",
  },

  email: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
  },

  infoCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },

  label: {
    fontSize: 15,
    color: "#666",
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },

  verified: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2E7D32",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEE",
  },

  logoutButton: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D32F2F",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  logoutText: {
    color: "#D32F2F",
    fontSize: 16,
    fontWeight: "bold",
  },
});
