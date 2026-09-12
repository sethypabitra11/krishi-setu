import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import useAuthStore from "../../store/authStore";
import { getMyProducts } from "../../services/product";
import ScreenContainer from "../../components/ScreenContainer";

const todayForecast = [
  { name: "Tomato", current: 28, predicted: 34 },
  { name: "Onion", current: 32, predicted: 39 },
  { name: "Potato", current: 24, predicted: 29 },
];

const StatCard = ({ value, label }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ForecastCard = ({ name, current, predicted }) => (
  <View style={styles.forecastCard}>
    <Text style={styles.forecastName}>{name}</Text>

    <Text style={styles.currentPrice}>₹{current}</Text>

    <Text style={styles.currentLabel}>Current price</Text>

    <View style={styles.predictionBox}>
      <Text style={styles.predictionLabel}>Today's possible high</Text>

      <Text style={styles.predictionPrice}>₹{predicted}</Text>
    </View>
  </View>
);

export default function FarmerDashboardScreen({ navigation }) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    if (!token) return;

    try {
      const data = await getMyProducts(token);
      setProducts(data.products || []);
    } catch (error) {
      console.log(
        "Dashboard products error:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts]),
  );

  const productCount = products.length;

  const totalSale = products.reduce(
    (total, product) => total + product.quantity * product.price,
    0,
  );

  const farmerName = user?.name || "Farmer";

  return (
    <ScreenContainer style={styles.container}>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.greeting}>Hello, {farmerName} 👋</Text>

          <Text style={styles.subtitle}>
            Welcome to your Krishi Setu dashboard
          </Text>
        </View>

        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>✓ Verified</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <StatCard value={loading ? "..." : productCount} label="My Products" />

        <StatCard
          value={loading ? "..." : `₹${Math.round(totalSale)}`}
          label="Total Sale"
        />
      </View>

      {/* My Products */}
      <TouchableOpacity
        style={styles.myProductsCard}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("MyProducts")}
      >
        <View style={styles.myProductsText}>
          <Text style={styles.myProductsTitle}>My Products</Text>

          <Text style={styles.myProductsSubtitle}>
            {productCount
              ? `${productCount} ${
                  productCount === 1 ? "product" : "products"
                } listed`
              : "View your listed produce"}
          </Text>
        </View>

        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* Today's Forecast */}
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => navigation.navigate("Predictions")}
      >
        <Text style={styles.sectionTitle}>Today's Price Forecast</Text>

        <Text style={styles.aiLabel}>OPEN AI MODEL ›</Text>
      </TouchableOpacity>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.forecastList}
      >
        {todayForecast.map((item) => (
          <ForecastCard key={item.name} {...item} />
        ))}
      </ScrollView>

      {/* Future Outlook */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Future Price Outlook</Text>

        <Text style={styles.demoLabel}>DEMO</Text>
      </View>

      <View style={styles.futureCard}>
        <View style={styles.futureHeader}>
          <View>
            <Text style={styles.futureProduct}>Tomato</Text>

            <Text style={styles.futureCurrent}>Current: ₹28/kg</Text>
          </View>

          <Text style={styles.futureIcon}>📈</Text>
        </View>

        <View style={styles.futurePrices}>
          <View style={styles.futurePriceBox}>
            <Text style={styles.futurePeriod}>3 Months</Text>

            <Text style={styles.futurePrice}>₹42</Text>
          </View>

          <View style={styles.futurePriceBox}>
            <Text style={styles.futurePeriod}>6 Months</Text>

            <Text style={styles.futurePrice}>₹48</Text>
          </View>
        </View>

        <Text style={styles.futureNote}>
          Estimated highest price the produce may reach.
        </Text>
      </View>

      <Text style={styles.disclaimer}>
        Prices shown are demo predictions. Actual market prices may vary.
        AI-based live predictions will be connected later.
      </Text>
    </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8F5",
  },

  content: {
    padding: 20,
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 10,
  },

  headerText: {
    flex: 1,
    marginRight: 10,
  },

  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1B5E20",
  },

  subtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 5,
  },

  verifiedBadge: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  verifiedText: {
    color: "#2E7D32",
    fontSize: 11,
    fontWeight: "700",
  },

  statsContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 16,
  },

  statValue: {
    fontSize: 23,
    fontWeight: "700",
    color: "#2E7D32",
  },

  statLabel: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

  myProductsCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
  },

  myProductsText: {
    flex: 1,
  },

  myProductsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E7D32",
  },

  myProductsSubtitle: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

  arrow: {
    fontSize: 30,
    color: "#2E7D32",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 26,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  aiLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#2E7D32",
  },

  demoLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#888",
  },

  forecastList: {
    gap: 12,
  },

  forecastCard: {
    width: 175,
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
  },

  forecastName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },

  currentPrice: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginTop: 10,
  },

  currentLabel: {
    fontSize: 11,
    color: "#888",
  },

  predictionBox: {
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    padding: 10,
    marginTop: 14,
  },

  predictionLabel: {
    fontSize: 10,
    color: "#2E7D32",
  },

  predictionPrice: {
    fontSize: 19,
    fontWeight: "700",
    color: "#2E7D32",
    marginTop: 3,
  },

  futureCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
  },

  futureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  futureProduct: {
    fontSize: 19,
    fontWeight: "700",
    color: "#333",
  },

  futureCurrent: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },

  futureIcon: {
    fontSize: 28,
  },

  futurePrices: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
  },

  futurePriceBox: {
    flex: 1,
    backgroundColor: "#F5F8F5",
    borderRadius: 12,
    padding: 14,
  },

  futurePeriod: {
    fontSize: 12,
    color: "#777",
  },

  futurePrice: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E7D32",
    marginTop: 4,
  },

  futureNote: {
    fontSize: 11,
    color: "#888",
    marginTop: 14,
  },

  disclaimer: {
    fontSize: 11,
    color: "#999",
    lineHeight: 17,
    textAlign: "center",
    marginTop: 22,
  },
});
