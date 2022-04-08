import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import ButtonRipple from "./components/ButtonRipple/ButtonRipple";

export default function App() {
  return (
    <View style={styles.container}>
      <ButtonRipple>
        <Text>ButtonRipple</Text>
      </ButtonRipple>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ff000040",
    alignItems: "center",
    justifyContent: "center",
  },
});
