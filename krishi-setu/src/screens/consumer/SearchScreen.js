import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import products from "../../data/products";

const categories = [
  "All",
  "Vegetables",
  "Fruits",
  "Grains",
  "Pulses",
];

const ProductCard = ({ product }) => {
  const getProductIcon = () => {
    switch (product.category) {
      case "Fruits":
        return "🍎";

      case "Grains":
        return "🌾";

      case "Pulses":
        return "🫘";

      default:
        return "🥬";
    }
  };

  return (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.8}
    >
      <View style={styles.productImage}>
        <Text style={styles.productEmoji}>
          {getProductIcon()}
        </Text>
      </View>

      <Text style={styles.productName}>
        {product.name}
      </Text>

      <Text style={styles.productCategory}>
        {product.category}
      </Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>
          ₹{product.price}
        </Text>

        <Text style={styles.unit}>
          /{product.unit}
        </Text>
      </View>

      <Text style={styles.available}>
        {product.quantity} {product.unit} available
      </Text>

      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.8}
        onPress={() => {}}
      >
        <Text style={styles.addButtonText}>
          Add to Cart
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default function SearchScreen() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}

        <View style={styles.header}>
          <Text style={styles.title}>
            Find Produce
          </Text>

          <Text style={styles.subtitle}>
            Fresh produce available near you
          </Text>
        </View>

        {/* Search */}

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>
            ⌕
          </Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search vegetables, fruits..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
            >
              <Text style={styles.clearText}>
                ✕
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}

        <Text style={styles.filterTitle}>
          Categories
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((category) => {
            const selected =
              selectedCategory === category;

            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selected &&
                    styles.categoryButtonSelected,
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  setSelectedCategory(category)
                }
              >
                <Text
                  style={[
                    styles.categoryButtonText,
                    selected &&
                      styles.categoryButtonTextSelected,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Results Header */}

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            Available Produce
          </Text>

          <Text style={styles.resultCount}>
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1
              ? "item"
              : "items"}
          </Text>
        </View>

        {/* Products */}

        {filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              🔍
            </Text>

            <Text style={styles.emptyTitle}>
              No products found
            </Text>

            <Text style={styles.emptyText}>
              Try a different product name or category.
            </Text>

            <TouchableOpacity
              style={styles.resetButton}
              activeOpacity={0.8}
              onPress={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
            >
              <Text style={styles.resetButtonText}>
                Clear Filters
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.productGrid}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
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

  /* Header */

  header: {
    marginTop: 8,
  },

  title: {
    fontSize: 27,
    fontWeight: "700",
    color: "#1B5E20",
  },

  subtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  /* Search */

  searchContainer: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  searchIcon: {
    fontSize: 27,
    color: "#666",
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  clearText: {
    fontSize: 15,
    color: "#888",
    paddingLeft: 8,
  },

  /* Categories */

  filterTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
    marginTop: 25,
    marginBottom: 12,
  },

  categoryList: {
    gap: 9,
  },

  categoryButton: {
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  categoryButtonSelected: {
    backgroundColor: "#2E7D32",
    borderColor: "#2E7D32",
  },

  categoryButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#555",
  },

  categoryButtonTextSelected: {
    color: "#FFFFFF",
  },

  /* Results */

  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 27,
    marginBottom: 13,
  },

  resultsTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#333",
  },

  resultCount: {
    fontSize: 12,
    color: "#888",
  },

  /* Products */

  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  productCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 14,
  },

  productImage: {
    height: 105,
    backgroundColor: "#F1F7F1",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  productEmoji: {
    fontSize: 52,
  },

  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    textTransform: "capitalize",
  },

  productCategory: {
    fontSize: 11,
    color: "#888",
    marginTop: 3,
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 9,
  },

  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E7D32",
  },

  unit: {
    fontSize: 11,
    color: "#777",
  },

  available: {
    fontSize: 10,
    color: "#888",
    marginTop: 4,
  },

  addButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 9,
    paddingVertical: 9,
    alignItems: "center",
    marginTop: 11,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  /* Empty */

  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 35,
    alignItems: "center",
    marginTop: 5,
  },

  emptyIcon: {
    fontSize: 38,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
    marginTop: 10,
  },

  emptyText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 6,
  },

  resetButton: {
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 15,
  },

  resetButtonText: {
    color: "#2E7D32",
    fontSize: 12,
    fontWeight: "700",
  },
});