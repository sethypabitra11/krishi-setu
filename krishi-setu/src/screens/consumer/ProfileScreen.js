import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import ScreenContainer from "../../components/ScreenContainer";

import useAuthStore from "../../store/authStore";
import { getUserProfile } from "../../services/user";

export default function ProfileScreen({ navigation }) {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getUserProfile(token);

      setUser(data.user);
    } catch (error) {
      console.log(
        "Profile error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#2E7D32"
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.title}>My Profile</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>

          <Text style={styles.name}>
            {user?.name || "User"}
          </Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              Consumer
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Name
            </Text>

            <Text style={styles.infoValue}>
              {user?.name || "-"}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Email
            </Text>

            <Text style={styles.infoValue}>
              {user?.email || "-"}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Location
            </Text>

            <Text style={styles.infoValue}>
              Bhubaneswar
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8F5",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F5F8F5",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#777",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  backText: {
    fontSize: 32,
    lineHeight: 34,
    color: "#333",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B5E20",
  },

  headerSpacer: {
    width: 40,
  },

  content: {
    padding: 20,
  },

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    alignItems: "center",
    paddingVertical: 25,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 34,
    fontWeight: "700",
    color: "#2E7D32",
  },

  name: {
    fontSize: 21,
    fontWeight: "700",
    color: "#333",
  },

  roleBadge: {
    backgroundColor: "#E8F5E9",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginTop: 8,
  },

  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2E7D32",
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },

  infoLabel: {
    fontSize: 13,
    color: "#888",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    maxWidth: "65%",
    textAlign: "right",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 8,
  },

  logoutButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E53935",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
  },

  logoutText: {
    color: "#E53935",
    fontSize: 14,
    fontWeight: "700",
  },
});