import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

import useAuthStore from "../../store/authStore";
import { addProduct } from "../../services/product";
import ScreenContainer from "../../components/ScreenContainer";

export default function AddProductScreen() {
  const token = useAuthStore((state) => state.token);

  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");

  const [loading, setLoading] = useState(false);

  const handleAddProduct = async () => {
    if (!category || !name || !quantity) {
      Alert.alert(
        "Missing Information",
        "Please fill all required fields."
      );
      return;
    }

    if (Number(quantity) <= 0) {
      Alert.alert(
        "Invalid Quantity",
        "Quantity must be greater than 0."
      );
      return;
    }

    try {
      setLoading(true);

      const data = await addProduct(
        {
          category,
          name,
          quantity: Number(quantity),
          unit,
        },
        token
      );

      Alert.alert(
        "Success",
        `Product added successfully.\n\nMarket Price: ₹${data.product.price}/${unit}`
      );

      // Reset form
      setCategory("");
      setName("");
      setQuantity("");
      setUnit("kg");
    } catch (error) {
      console.log(
        "Add product error:",
        error.response?.data
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to add product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer style={styles.container}>
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={styles.title}>Add Product</Text>

      <Text style={styles.subtitle}>
        List your produce on Krishi Setu
      </Text>

      {/* Category */}
      <Text style={styles.label}>Category *</Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(value) => {
            setCategory(value);
            setName("");
          }}
        >
          <Picker.Item
            label="Select a category"
            value=""
          />

          <Picker.Item
            label="Vegetables"
            value="vegetables"
          />

          <Picker.Item
            label="Fruits"
            value="fruits"
          />

          <Picker.Item
            label="Grains"
            value="grains"
          />

          <Picker.Item
            label="Pulses"
            value="pulses"
          />
        </Picker>
      </View>

      {/* Product Name */}
      <Text style={styles.label}>Product Name *</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Tomato"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      {/* Quantity */}
      <Text style={styles.label}>Quantity *</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. 500"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />

      {/* Unit */}
      <Text style={styles.label}>Unit</Text>

      <View style={styles.unitContainer}>
        {["kg", "quintal", "ton"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.unitButton,
              unit === item && styles.selectedUnit,
            ]}
            onPress={() => setUnit(item)}
          >
            <Text
              style={[
                styles.unitText,
                unit === item && styles.selectedUnitText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Market Price */}
      <Text style={styles.label}>
        Current Market Price
      </Text>

      <View style={styles.marketPriceBox}>
        <View style={styles.priceIcon}>
          <Text style={styles.priceIconText}>₹</Text>
        </View>

        <View style={styles.priceInfo}>
          <Text style={styles.marketPriceTitle}>
            35.00
          </Text>

          <Text style={styles.marketPriceSubtitle}>
            Based on current market data and AI model
          </Text>
        </View>
      </View>

      {/* Add Product Button */}
      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.disabledButton,
        ]}
        onPress={handleAddProduct}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading
            ? "Adding Product..."
            : "Add Product"}
        </Text>
      </TouchableOpacity>
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

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1B5E20",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 7,
    marginTop: 15,
  },

  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  unitContainer: {
    flexDirection: "row",
    gap: 10,
  },

  unitButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DDD",
  },

  selectedUnit: {
    backgroundColor: "#E8F5E9",
    borderColor: "#2E7D32",
  },

  unitText: {
    color: "#666",
    fontWeight: "600",
  },

  selectedUnitText: {
    color: "#2E7D32",
  },

  marketPriceBox: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  priceIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  priceIconText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2E7D32",
  },

  priceInfo: {
    flex: 1,
  },

  marketPriceTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E7D32",
  },

  marketPriceSubtitle: {
    fontSize: 11,
    color: "#777",
    marginTop: 3,
  },

  button: {
    backgroundColor: "#2E7D32",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 30,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
