import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import React, { FC, memo } from "react";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  Easing,
  measure,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type ButtonRippleProps = {
  isLoading?: boolean;
  isDisabled?: boolean;
  isNoRadius?: boolean;
  isNoBackground?: boolean;
  title: string;
  loaderSize?: "small" | "large";
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  onPressUI?: () => void;
};

const ButtonRipple: FC<ButtonRippleProps> = memo(
  ({
    isLoading = false,
    isDisabled = false,
    isNoBackground = false,
    isNoRadius = false,
    loaderSize = "small",
    title = "",
    style,
    titleStyle,
    onPress,
    onPressUI,
  }) => {
    const aref = useAnimatedRef();
    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);
    const overlayProps = useSharedValue({ x: 0, y: 0, radius: 0 });

    const tapGesture = Gesture.Tap()
      .enabled(!isDisabled)
      .maxDuration(250)
      .onStart(({ x, y }) => {
        let radius;
        if (overlayProps.value.radius) {
          radius = overlayProps.value.radius;
        } else {
          const { width, height } = measure(aref);
          radius = Math.sqrt(height ** 2 + width ** 2);
        }
        scale.value = 0;
        opacity.value = 1;
        overlayProps.value = { radius, x, y };
        scale.value = withTiming(
          1,
          { duration: 300, easing: Easing.in(Easing.quad) },
          () => {
            opacity.value = withTiming(0, { duration: 200 });
          },
        );
      })
      .onEnd(() => {
        if (onPressUI) onPressUI();
        if (onPress) runOnJS(onPress)();
      });

    const rStyle = useAnimatedStyle(() => {
      const { x, y, radius } = overlayProps.value;
      return {
        borderRadius: radius,
        width: radius * 2,
        height: radius * 2,
        opacity: opacity.value,
        transform: [
          { translateX: x - radius },
          { translateY: y - radius },
          { scale: scale.value },
        ],
      };
    }, []);

    return (
      <GestureHandlerRootView>
        <GestureDetector gesture={tapGesture}>
          <View
            ref={aref}
            style={[
              styles.button,
              style,
              isNoRadius ? styles.noRadius : undefined,
              isDisabled || isLoading ? styles.disabled : undefined,
              isNoBackground ? styles.noBackground : undefined,
            ]}
          >
            {!isLoading ? (
              <Text style={[styles.title, titleStyle]}>{title}</Text>
            ) : null}
            <Animated.View
              pointerEvents="none"
              style={[styles.overlayStyle, rStyle]}
            />
          </View>
        </GestureDetector>
        {isLoading ? (
          <ActivityIndicator
            animating={isLoading}
            style={styles.activityIndicator}
            size={loaderSize}
          />
        ) : null}
      </GestureHandlerRootView>
    );
  },
);

export default ButtonRipple;

const styles = StyleSheet.create({
  button: {
    margin: 8,
    height: 50,
    width: 150,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: "lightblue",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  disabled: { opacity: 0.6 },
  noRadius: { borderRadius: 0 },
  noBackground: { backgroundColor: "transparent" },
  overlayStyle: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  activityIndicator: {
    ...StyleSheet.absoluteFillObject,
  },
});
