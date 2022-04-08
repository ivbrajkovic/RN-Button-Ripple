import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import ButtonRipple from "./components/ButtonRipple/ButtonRipple";

export default function App() {
  const handlePress = () => console.log("pressed", Date.now());
  return (
    <View style={styles.container}>
      <ButtonRipple title="Press me" onPress={handlePress} />
      <ButtonRipple title="Press me" onPress={handlePress} />
      <ButtonRipple title="Press me" onPress={handlePress} />
      <ButtonRipple title="Press me" onPress={handlePress} />
      <ButtonRipple title="Press me" onPress={handlePress} />
      <ButtonRipple title="Press me" onPress={handlePress} />
      <ButtonRipple title="Press me" onPress={handlePress} />
      <ButtonRipple isDisabled title="Press me" onPress={handlePress} />
      <ButtonRipple isLoading title="Press me" onPress={handlePress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
});
