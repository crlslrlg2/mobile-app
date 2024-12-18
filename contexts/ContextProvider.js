import React from "react";
import i18n from "../utils/i18next";
import { Store } from "../redux/Store";
import { ModalProvider } from "./ModalContext";
import { I18nextProvider } from "react-i18next";
import { ThemeProvider } from "../utils/prefrence";
import { AppStateProvider } from "./AppStateContext";
import { Provider as StoreProvider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const ContextProviders = ({ children }) => {
  return (
    <SafeAreaProvider>
      <StoreProvider store={Store}>
        <ModalProvider>
          <ThemeProvider>
            <I18nextProvider i18n={i18n}>
              <AppStateProvider>
                <NavigationContainer>{children}</NavigationContainer>
              </AppStateProvider>
            </I18nextProvider>
          </ThemeProvider>
        </ModalProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
};

export default ContextProviders;
