import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import useCartStore from "../../store/cartStore";
import ScreenContainer from "../../components/ScreenContainer";

const getProductIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "fruits":
      return "🍎";
    case "grains":
      return "🌾";
    case "pulses":
      return "🫘";
    default:
      return "🥬";
  }
};

export default function CartScreen({ navigation }) {
  const items = useCartStore((state) => state.items);
  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity
  );
  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity
  );
  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  );
  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  const totalItems = items.reduce(
    (total, item) => total + item.cartQuantity,
    0
  );

  const totalAmount = items.reduce(
    (total, item) =>
      total + item.price * item.cartQuantity,
    0
  );

  const handleRemove = (item) => {
    Alert.alert(
      "Remove item",
      `Remove ${item.name} from your cart?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFromCart(item._id),
        },
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      "Order Successful 🎉",
      `Your order of ₹${totalAmount} has been placed successfully!`,
      [
        {
          text: "Continue Shopping",
          onPress: () => {
            clearCart();
            navigation.navigate("ConsumerHome");
          },
        },
      ]
    );
  };

  if (items.length === 0) {
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.title}>My Cart</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>

          <Text style={styles.emptyTitle}>
            Your cart is empty
          </Text>

          <Text style={styles.emptyText}>
            Add fresh produce from the marketplace to
            get started.
          </Text>

          <TouchableOpacity
            style={styles.shopButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.shopButtonText}>
              Browse Products
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
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

        <View>
          <Text style={styles.title}>My Cart</Text>

          <Text style={styles.itemCount}>
            {totalItems}{" "}
            {totalItems === 1 ? "item" : "items"}
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {items.map((item) => (
          <View key={item._id} style={styles.cartCard}>
            <View style={styles.productImage}>
              <Text style={styles.productEmoji}>
                {getProductIcon(item.category)}
              </Text>
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.productName}>
                {item.name}
              </Text>

              <Text style={styles.category}>
                {item.category}
              </Text>

              <Text style={styles.price}>
                ₹{item.price}/{item.unit}
              </Text>

              <View style={styles.quantityRow}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() =>
                    decreaseQuantity(item._id)
                  }
                >
                  <Text style={styles.quantityButtonText}>
                    −
                  </Text>
                </TouchableOpacity>

                <Text style={styles.quantity}>
                  {item.cartQuantity}
                </Text>

                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() =>
                    increaseQuantity(item._id)
                  }
                >
                  <Text style={styles.quantityButtonText}>
                    +
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.rightSection}>
              <Text style={styles.itemTotal}>
                ₹{item.price * item.cartQuantity}
              </Text>

              <TouchableOpacity
                onPress={() => handleRemove(item)}
              >
                <Text style={styles.removeText}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>
            Order Summary
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Items
            </Text>

            <Text style={styles.summaryValue}>
              {totalItems}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Delivery
            </Text>

            <Text style={styles.freeText}>
              FREE
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.totalAmount}>
              ₹{totalAmount}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          activeOpacity={0.8}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutText}>
            Place Order
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

  itemCount: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
    marginTop: 2,
  },

  headerSpacer: {
    width: 40,
  },

  content: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },

  cartCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },

  productImage: {
    width: 82,
    height: 82,
    borderRadius: 14,
    backgroundColor: "#F1F7F1",
    alignItems: "center",
    justifyContent: "center",
  },

  productEmoji: {
    fontSize: 40,
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
  },

  productName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    textTransform: "capitalize",
  },

  category: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
    textTransform: "capitalize",
  },

  price: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2E7D32",
    marginTop: 6,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
  },

  quantityButtonText: {
    fontSize: 19,
    color: "#2E7D32",
    fontWeight: "600",
  },

  quantity: {
    width: 32,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },

  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingVertical: 2,
  },

  itemTotal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
  },

  removeText: {
    fontSize: 11,
    color: "#E53935",
    fontWeight: "600",
  },

  summary: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
    marginBottom: 14,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#777",
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
  },

  freeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2E7D32",
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 4,
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2E7D32",
  },

  checkoutButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },

  checkoutText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 35,
  },

  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "700",
    color: "#333",
  },

  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },

  shopButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 11,
    paddingHorizontal: 22,
    paddingVertical: 12,
    marginTop: 20,
  },

  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});