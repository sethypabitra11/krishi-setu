import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import useAuthStore from "../store/authStore";

import ConsumerHomeScreen from "../screens/consumer/HomeScreen";
import ProfileScreen from "../screens/consumer/ProfileScreen";
import CartScreen from "../screens/consumer/CartScreen";
import FarmerTabNavigator from "./FarmerTabNavigator";

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  const user = useAuthStore((state) => state.user);

  return (
    <Stack.Navigator>
      {user?.role === "farmer" ? (
        <Stack.Screen
          name="FarmerApp"
          component={FarmerTabNavigator}
          options={{
            headerShown: false,
          }}
        />
      ) : (
        <>
          <Stack.Screen
            name="ConsumerHome"
            component={ConsumerHomeScreen}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Cart"
            component={CartScreen}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
