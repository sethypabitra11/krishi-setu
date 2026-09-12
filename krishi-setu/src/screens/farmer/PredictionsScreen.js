import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";

const ML_API_URL = "https://krishi-ml-fixed-1.onrender.com";

const LOCATIONS = [
  "Patia",
  "Unit-1 Market",
  "Saheed Nagar",
  "Rasulgarh",
  "Khandagiri",
  "Old Town",
  "Vani Vihar",
];

const PRODUCTS = [
  "Tomato",
  "Potato",
  "Onion",
  "Cauliflower",
  "Cabbage",
  "Brinjal",
  "Spinach",
];

export default function PredictionsScreen() {
  const [location, setLocation] = useState("Patia");
  const [product, setProduct] = useState("Tomato");
  const [supply, setSupply] = useState("500");
  const [festival, setFestival] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [priceData, setPriceData] = useState(null);
  const [demandData, setDemandData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  const fetchPredictions = async () => {
    setLoading(true);
    setError(null);

    const payload = {
      location,
      product,
      market_supply_kg: Number(supply) || 500,
      festival_season: festival ? 1 : 0,
    };

    try {
      const [priceRes, demandRes, recRes] = await Promise.all([
        axios.post(`${ML_API_URL}/predict-price`, payload, { timeout: 45000 }),
        axios.post(`${ML_API_URL}/predict-demand`, payload, { timeout: 45000 }),
        axios.post(
          `${ML_API_URL}/recommend-products`,
          {
            location,
            festival_season: festival ? 1 : 0,
            product_supplies: {
              Tomato: 500,
              Potato: 500,
              Onion: 400,
            },
          },
          { timeout: 45000 }
        ),
      ]);

      setPriceData(priceRes.data);
      setDemandData(demandRes.data);
      setRecommendations(recRes.data?.recommendations || []);
    } catch (err) {
      console.error("ML error:", err);
      setError("Unable to connect to ML Model. Free tier instances may take 30-50s to wake up.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.badge}>✨ AI Harvest Forecaster</Text>
        <Text style={styles.title}>Mandi Price & Demand</Text>
        <Text style={styles.subtitle}>
          Powered by Krishi Setu ML Model on Render
        </Text>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Form Controls */}
      <View style={styles.card}>
        <Text style={styles.label}>Select Mandi / Market</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={location}
            onValueChange={(val) => setLocation(val)}
          >
            {LOCATIONS.map((loc) => (
              <Picker.Item key={loc} label={loc} value={loc} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Select Crop</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={product}
            onValueChange={(val) => setProduct(val)}
          >
            {PRODUCTS.map((prod) => (
              <Picker.Item key={prod} label={prod} value={prod} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Market Supply (kg)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={supply}
          onChangeText={setSupply}
          placeholder="500"
        />

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Festival Season (Multiplier)</Text>
          <Switch value={festival} onValueChange={setFestival} trackColor={{ true: "#2E7D32" }} />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={fetchPredictions}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Run AI Prediction</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Predictions Display */}
      <View style={styles.resultsGrid}>
        <View style={[styles.statCard, styles.greenCard]}>
          <Text style={styles.statLabel}>Expected Price ({product})</Text>
          <Text style={styles.statValue}>
            ₹{priceData ? priceData.expected_price_per_kg : "--"}{" "}
            <Text style={styles.unit}>/ kg</Text>
          </Text>
        </View>

        <View style={[styles.statCard, styles.amberCard]}>
          <Text style={styles.statLabel}>Expected Demand ({product})</Text>
          <Text style={styles.statValue}>
            {demandData ? demandData.expected_demand_kg : "--"}{" "}
            <Text style={styles.unit}>kg</Text>
          </Text>
        </View>
      </View>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <View style={styles.recSection}>
          <Text style={styles.sectionTitle}>🏆 Top Profitable Crops for {location}</Text>
          {recommendations.map((item, idx) => (
            <View key={item.product} style={styles.recCard}>
              <View style={styles.recHeader}>
                <Text style={styles.recRank}>#{idx + 1} {item.product}</Text>
                <Text style={styles.recPrice}>₹{item.expected_price_per_kg}/kg</Text>
              </View>
              <Text style={styles.recDetail}>
                Est. Demand: {item.expected_demand_kg} kg | Projected Revenue: ₹{item.expected_revenue}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 16, marginTop: 8 },
  badge: {
    color: "#15803d",
    fontSize: 12,
    fontWeight: "bold",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  title: { fontSize: 24, fontWeight: "900", color: "#0f172a" },
  subtitle: { fontSize: 13, color: "#64748b", marginTop: 2 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 16,
  },
  label: { fontSize: 12, fontWeight: "bold", color: "#475569", marginBottom: 6 },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    backgroundColor: "#f8fafc",
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  switchLabel: { fontSize: 13, fontWeight: "600", color: "#334155" },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: { color: "#ffffff", fontWeight: "bold", fontSize: 14 },
  errorBox: {
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fecaca",
    marginBottom: 14,
  },
  errorText: { color: "#991b1b", fontSize: 12 },
  resultsGrid: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  greenCard: { backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" },
  amberCard: { backgroundColor: "#fffbeb", borderColor: "#fde68a" },
  statLabel: { fontSize: 11, fontWeight: "bold", color: "#475569", marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: "900", color: "#0f172a" },
  unit: { fontSize: 12, fontWeight: "normal", color: "#64748b" },
  recSection: { marginTop: 8 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#0f172a", marginBottom: 10 },
  recCard: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 8,
  },
  recHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  recRank: { fontWeight: "bold", fontSize: 14, color: "#0f172a" },
  recPrice: { fontWeight: "800", color: "#2E7D32" },
  recDetail: { fontSize: 11, color: "#64748b" },
});