import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import useAuthStore from "../../store/authStore";
import {
  deleteProduct,
  getMyProducts,
} from "../../services/product";

const ProductCard = ({ product, onDelete }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>
          {product.name}
        </Text>

        <Text style={styles.category}>
          {product.category}
        </Text>
      </View>

      <View style={styles.status}>
        <Text style={styles.statusText}>
          {product.available ? "Available" : "Unavailable"}
        </Text>
      </View>
    </View>

    <View style={styles.divider} />

    <View style={styles.details}>
      <View>
        <Text style={styles.label}>Quantity</Text>

        <Text style={styles.value}>
          {product.quantity} {product.unit}
        </Text>
      </View>

      <View>
        <Text style={styles.label}>Market Price</Text>

        <Text style={styles.price}>
          ₹{product.price}/{product.unit}
        </Text>
      </View>
    </View>

    <Text style={styles.note}>
      Price determined by Krishi Setu
    </Text>

    <TouchableOpacity
      style={styles.deleteButton}
      activeOpacity={0.8}
      onPress={() => onDelete(product)}
    >
      <Text style={styles.deleteText}>
        Delete Listing
      </Text>
    </TouchableOpacity>
  </View>
);

export default function MyProductsScreen() {
  const token = useAuthStore((state) => state.token);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadProducts = useCallback(async () => {
    if (!token) return;

    try {
      const data = await getMyProducts(token);
      setProducts(data.products || []);
    } catch (error) {
      console.log(
        "Get products error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts();
  };

  const handleDelete = (product) => {
    Alert.alert(
      "Delete Listing",
      `Are you sure you want to remove ${product.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmDelete(product._id),
        },
      ]
    );
  };

  const confirmDelete = async (productId) => {
    try {
      setDeletingId(productId);

      await deleteProduct(productId, token);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product._id !== productId
        )
      );

      Alert.alert(
        "Deleted",
        "Your product listing has been removed."
      );
    } catch (error) {
      console.log(
        "Delete product error:",
        error.response?.data || error.message
      );

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Unable to delete the product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#2E7D32"
        />

        <Text style={styles.loadingText}>
          Loading products...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>
          {products.length}{" "}
          {products.length === 1 ? "product" : "products"} listed
        </Text>
      </View>

      {products.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🌾</Text>

          <Text style={styles.emptyTitle}>
            No products yet
          </Text>

          <Text style={styles.emptyText}>
            Add your first produce from the Add Product tab.
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onDelete={handleDelete}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={["#2E7D32"]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8F5",
  },

  header: {
    padding: 20,
    paddingBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1B5E20",
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },

  list: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  productInfo: {
    flex: 1,
    marginRight: 10,
  },

  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    textTransform: "capitalize",
  },

  category: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
    textTransform: "capitalize",
  },

  status: {
    backgroundColor: "#E8F5E9",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  statusText: {
    color: "#2E7D32",
    fontSize: 11,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEE",
    marginVertical: 14,
  },

  details: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2E7D32",
  },

  note: {
    fontSize: 11,
    color: "#999",
    marginTop: 12,
  },

  deleteButton: {
    borderWidth: 1,
    borderColor: "#E53935",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
    marginTop: 14,
  },

  deleteText: {
    color: "#E53935",
    fontSize: 14,
    fontWeight: "600",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  loadingText: {
    color: "#777",
    marginTop: 10,
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },

  emptyText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});