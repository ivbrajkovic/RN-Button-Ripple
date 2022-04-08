import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import ButtonRipple from "./components/ButtonRipple/ButtonRipple";

export default function App() {
  const handlePress = () => console.log("pressed", new Date().toString());
  return (
    <View style={styles.container}>
      <ButtonRipple isOverlayLight title="Press me" onPress={handlePress} />
      <ButtonRipple title="Press me" onPress={handlePress} />

      <ButtonRipple
        isAnimation
        isOverlayLight
        title="Animated"
        onPress={handlePress}
      />
      <ButtonRipple isAnimation title="Animated" onPress={handlePress} />

      <ButtonRipple isDisabled title="Disabled" onPress={handlePress} />
      <ButtonRipple isLoading title="Press me" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fefefe",
    alignItems: "center",
    justifyContent: "center",
  },
});
