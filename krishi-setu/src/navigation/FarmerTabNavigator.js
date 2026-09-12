import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FarmerDashboardScreen from "../screens/farmer/FarmerDashboardScreen";
import AddProductScreen from "../screens/farmer/AddProductScreen";
import FarmerProfileScreen from "../screens/farmer/FarmerProfileScreen";
import MyProductsScreen from "../screens/farmer/MyProductsScreen";
import PredictionsScreen from "../screens/farmer/PredictionsScreen";

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="FarmerDashboard"
        component={FarmerDashboardScreen}
        options={{ headerShown: false }}
      />

      <HomeStack.Screen
        name="MyProducts"
        component={MyProductsScreen}
        options={{
          title: "My Products",
          headerTintColor: "#2E7D32",
        }}
      />

      <HomeStack.Screen
        name="Predictions"
        component={PredictionsScreen}
        options={{
          title: "AI Crop Predictions",
          headerTintColor: "#2E7D32",
        }}
      />
    </HomeStack.Navigator>
  );
}

const getTabIcon = (routeName) => {
  switch (routeName) {
    case "Home":
      return "⌂";

    case "AddProduct":
      return "＋";

    case "Profile":
      return "○";

    default:
      return "●";
  }
};

export default function FarmerTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: "#2E7D32",
        tabBarInactiveTintColor: "#888",

        tabBarStyle: {
          height: 65,
          paddingTop: 5,
          paddingBottom: 8,
        },

        tabBarIcon: ({ color, focused }) => (
          <Text
            style={{
              color,
              fontSize: route.name === "AddProduct" ? 28 : 22,
              fontWeight: focused ? "bold" : "normal",
            }}
          >
            {getTabIcon(route.name)}
          </Text>
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
      />

      <Tab.Screen
        name="AddProduct"
        component={AddProductScreen}
        options={{
          tabBarLabel: "Add Product",
        }}
      />

      <Tab.Screen
        name="Profile"
        component={FarmerProfileScreen}
      />
    </Tab.Navigator>
  );
}