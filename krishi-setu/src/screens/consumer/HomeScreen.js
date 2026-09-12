import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import useAuthStore from "../../store/authStore";
import useCartStore from "../../store/cartStore";
import { getProducts } from "../../services/product";
import ScreenContainer from "../../components/ScreenContainer";

const categories = [
  { name: "All", icon: "🌱" },
  { name: "Vegetables", icon: "🥬" },
  { name: "Fruits", icon: "🍎" },
  { name: "Grains", icon: "🌾" },
  { name: "Pulses", icon: "🫘" },
];

const sortOptions = [
  {
    label: "Recommended",
    value: "recommended",
  },
  {
    label: "Price: Low to High",
    value: "priceLow",
  },
  {
    label: "Price: High to Low",
    value: "priceHigh",
  },
  {
    label: "Name: A to Z",
    value: "nameAsc",
  },
  {
    label: "Name: Z to A",
    value: "nameDesc",
  },
];

const getProductIcon = (name) => {
  switch (name?.toLowerCase().replace(/\s+/g, "")) {
    // Fruits
    case "apple":
      return "🍎";
    case "banana":
      return "🍌";
    case "mango":
      return "🥭";
    case "orange":
      return "🍊";
    case "grapes":
      return "🍇";
    case "watermelon":
      return "🍉";
    case "pineapple":
      return "🍍";
    case "papaya":
      return "🍈";

    // Vegetables
    case "tomato":
      return "🍅";
    case "onion":
      return "🧅";
    case "potato":
      return "🥔";
    case "cabbage":
      return "🥬";
    case "cauliflower":
      return "🥦";
    case "eggplant":
      return "🍆";
    case "brinjal":
      return "🍆";

    // Grains
    case "rice":
      return "🌾";
    case "wheat":
      return "🌾";
    case "maize":
      return "🌽";

    // Pulses
    case "lentil":
      return "🫘";
    case "chickpea":
      return "🫘";
    case "pigeonpea":
      return "🫘";
    case "whitechickpea":
      return "🫘"
    case "horsegram":
      return "🫘";

    default:
      return "🌱";
  }
};

function ProductCard({ product, navigation }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart(product);

    Alert.alert(
      "Added to Cart",
      `${product.name} has been added to your cart.`,
      [
        {
          text: "Continue Shopping",
          style: "cancel",
        },
        {
          text: "View Cart",
          onPress: () => navigation.navigate("Cart"),
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.9}
      onPress={() =>
        navigation.navigate("ProductDetails", {
          productId: product._id,
        })
      }
    >
      <View style={styles.productImage}>
        <Text style={styles.productEmoji}>
          {getProductIcon(product.name)}
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
        onPress={handleAddToCart}
      >
        <Text style={styles.addButtonText}>
          Add to Cart
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }) {
  const token = useAuthStore((state) => state.token);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [sortModalVisible, setSortModalVisible] =
    useState(false);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const data = await getProducts(token);

      setProducts(data.products || []);
    } catch (error) {
      console.log(
        "Consumer products error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [loadProducts])
  );

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        product.category?.toLowerCase() ===
          selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    if (sortBy === "priceLow") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortBy === "priceHigh") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortBy === "nameAsc") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sortBy === "nameDesc") {
      result.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }

    return result;
  }, [
    products,
    search,
    selectedCategory,
    sortBy,
  ]);

  const selectedSortLabel =
    sortOptions.find(
      (option) => option.value === sortBy
    )?.label || "Recommended";

  const handleSort = (value) => {
    setSortBy(value);
    setSortModalVisible(false);
  };

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Top Bar */}

        <View style={styles.topBar}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>
              📍
            </Text>

            <View>
              <Text style={styles.locationLabel}>
                Delivering to
              </Text>

              <Text style={styles.locationText}>
                Bhubaneswar
              </Text>
            </View>
          </View>

          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("Cart")
              }
            >
              <Text style={styles.actionIcon}>
                🛒
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("Profile")
              }
            >
              <Text style={styles.actionIcon}>
                👤
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>
            🔍
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

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Categories
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Search")
            }
          >
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((category) => {
            const isSelected =
              selectedCategory === category.name;

            return (
              <TouchableOpacity
                key={category.name}
                style={[
                  styles.categoryCard,
                  isSelected &&
                    styles.selectedCategoryCard,
                ]}
                activeOpacity={0.8}
                onPress={() =>
                  setSelectedCategory(category.name)
                }
              >
                <View
                  style={[
                    styles.categoryIconContainer,
                    isSelected &&
                      styles.selectedCategoryIconContainer,
                  ]}
                >
                  <Text style={styles.categoryIcon}>
                    {category.icon}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.categoryName,
                    isSelected &&
                      styles.selectedCategoryName,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Products Header */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Fresh Produce
            </Text>

            <Text style={styles.resultCount}>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.sortButton}
            activeOpacity={0.8}
            onPress={() =>
              setSortModalVisible(true)
            }
          >
            <Text style={styles.sortIcon}>
              ⇅
            </Text>

            <Text style={styles.sortText}>
              Sort
            </Text>
          </TouchableOpacity>
        </View>

        {/* Products */}

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#2E7D32"
            />

            <Text style={styles.loadingText}>
              Loading fresh produce...
            </Text>
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              🌾
            </Text>

            <Text style={styles.emptyTitle}>
              No products available
            </Text>

            <Text style={styles.emptyText}>
              {search
                ? "Try searching for another produce."
                : selectedCategory !== "All"
                ? `No ${selectedCategory.toLowerCase()} are available right now.`
                : "Fresh produce will appear here when farmers list them."}
            </Text>

            {(search ||
              selectedCategory !== "All") && (
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setSearch("");
                  setSelectedCategory("All");
                }}
              >
                <Text style={styles.resetButtonText}>
                  Show All Products
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.productGrid}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                navigation={navigation}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Sort Modal */}

      <Modal
        visible={sortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setSortModalVisible(false)
        }
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() =>
            setSortModalVisible(false)
          }
        >
          <View style={styles.sortModal}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Sort Products
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setSortModalVisible(false)
                }
              >
                <Text style={styles.modalClose}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {sortOptions.map((option) => {
              const isSelected =
                sortBy === option.value;

              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.sortOption,
                    isSelected &&
                      styles.selectedSortOption,
                  ]}
                  activeOpacity={0.8}
                  onPress={() =>
                    handleSort(option.value)
                  }
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      isSelected &&
                        styles.selectedSortOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>

                  {isSelected && (
                    <Text style={styles.checkIcon}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}

            <Text style={styles.currentSort}>
              Currently: {selectedSortLabel}
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingTop: 18,
    paddingBottom: 40,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationIcon: {
    fontSize: 22,
    marginRight: 8,
  },

  locationLabel: {
    fontSize: 11,
    color: "#888",
  },

  locationText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: 2,
  },

  topActions: {
    flexDirection: "row",
    gap: 8,
  },

  actionButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth:0.5,
    borderColor: "#006c05",
    alignItems: "center",
    justifyContent: "center",
  },

  actionIcon: {
    fontSize: 20,
  },

  searchContainer: {
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 24,
  },

  searchIcon: {
    fontSize: 18,
    color: "#777",
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },

  clearText: {
    fontSize: 16,
    color: "#777",
    padding: 5,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#333",
  },

  seeAll: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2E7D32",
  },

  resultCount: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },

  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  sortIcon: {
    fontSize: 20,
    color: "#2E7D32",
    marginRight: 5,
  },

  sortText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2E7D32",
  },

  categoryList: {
    paddingTop: 18,
    paddingBottom: 18,
  },

  categoryCard: {
    width: 82,
    alignItems: "center",
  },

  selectedCategoryCard: {
    transform: [{ scale: 1.03 }],
  },

  categoryIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
    borderWidth: 2,
    borderColor: "transparent",
  },

  selectedCategoryIconContainer: {
    backgroundColor: "#E8F5E9",
    borderColor: "#2E7D32",
  },

  categoryIcon: {
    fontSize: 30,
  },

  categoryName: {
    fontSize: 11,
    color: "#555",
    fontWeight: "600",
  },

  selectedCategoryName: {
    color: "#2E7D32",
    fontWeight: "700",
  },

  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },

  productCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 10,
    marginBottom: 4,
  },

  productImage: {
    height: 120,
    borderRadius: 12,
    backgroundColor: "#F1F7F1",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  productEmoji: {
    fontSize: 52,
  },

  productName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    textTransform: "capitalize",
  },

  productCategory: {
    fontSize: 11,
    color: "#888",
    marginTop: 3,
    textTransform: "capitalize",
  },

  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 7,
  },

  price: {
    fontSize: 17,
    fontWeight: "700",
    color: "#2E7D32",
  },

  unit: {
    fontSize: 11,
    color: "#777",
    marginLeft: 2,
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
    marginTop: 10,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#777",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    paddingHorizontal: 25,
  },

  emptyIcon: {
    fontSize: 50,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },

  emptyText: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6,
    textAlign: "center",
  },

  resetButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 15,
  },

  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "flex-end",
  },

  sortModal: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },

  modalHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D5D5D5",
    alignSelf: "center",
    marginBottom: 18,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#333",
  },

  modalClose: {
    fontSize: 18,
    color: "#777",
    padding: 5,
  },

  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 4,
  },

  selectedSortOption: {
    backgroundColor: "#E8F5E9",
  },

  sortOptionText: {
    fontSize: 14,
    color: "#444",
  },

  selectedSortOptionText: {
    color: "#2E7D32",
    fontWeight: "700",
  },

  checkIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E7D32",
  },

  currentSort: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
  },
});