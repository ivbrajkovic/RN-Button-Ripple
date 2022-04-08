import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import React, { FC } from "react";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  measure,
  useAnimatedRef,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

type ButtonRippleProps = {
  style?: StyleProp<ViewStyle>;
};

const getMeasure = (ref) => {
  "worklet";
  const { width, height } = measure(ref);
  console.log(width, height);
};

const ButtonRipple: FC<ButtonRippleProps> = ({ style, children }) => {
  const aref = useAnimatedRef();

  // const measures = useDerivedValue(() => {
  //   const measured = getMeasure(aref);
  //   return measured;
  // });

  const coordinates = useSharedValue({ x: 0, y: 0 });
  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .onStart(() => {
      const measured = measure(aref);
      console.log("onStart", measured);
    });
  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={tapGesture}>
        <Animated.View ref={aref} style={styles.button}>
          <>{children}</>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default ButtonRipple;

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 150,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
