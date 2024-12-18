import React from "react";
import SignupScreen from "../screens/auth/SignupScreen";
import SigninScreen from "../screens/auth/SigninScreen";
import { createStackNavigator } from "@react-navigation/stack";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
import { customInterpolator } from "../utils/helper";

const Stack = createStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator
      initialRouteName="Signin"
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: customInterpolator,
      }}
    >
      <Stack.Screen name="Signin" component={SigninScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
