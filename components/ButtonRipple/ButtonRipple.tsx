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
  withSequence,
  withTiming,
} from "react-native-reanimated";

type ButtonRippleProps = {
  isLoading?: boolean;
  isDisabled?: boolean;
  isNoRadius?: boolean;
  isNoShadow?: boolean;
  isAnimation?: boolean;
  isOverlayLight?: boolean;
  isNoBackground?: boolean;
  title: string;
  testID?: string;
  debounceTimeout?: number;
  overlayColor?: string;
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
    isOverlayLight = false,
    isNoShadow = false,
    isAnimation = false,
    loaderSize = "small",
    title = "",
    debounceTimeout = 300,
    testID = "button",
    overlayColor,
    style,
    titleStyle,
    onPress,
    onPressUI,
  }) => {
    const aref = useAnimatedRef();
    const called = useSharedValue(0);
    const buttonScale = useSharedValue(1);
    const overlayScale = useSharedValue(0);
    const overlayOpacity = useSharedValue(0);
    const overlayProps = useSharedValue({ x: 0, y: 0, radius: 0 });

    const tapGesture = Gesture.Tap()
      .enabled(!isDisabled)
      .maxDuration(250)
      .onStart(({ x, y }) => {
        if (called.value > 0) return;
        called.value = 1;
        called.value = withTiming(0, { duration: debounceTimeout });

        let radius;
        if (overlayProps.value.radius) {
          radius = overlayProps.value.radius;
        } else {
          const { width, height } = measure(aref);
          radius = Math.sqrt(height ** 2 + width ** 2);
        }

        overlayScale.value = 0;
        overlayOpacity.value = 1;
        overlayProps.value = { radius, x, y };

        overlayScale.value = withTiming(
          1,
          { duration: 300, easing: Easing.in(Easing.quad) },
          () => {
            overlayOpacity.value = withTiming(0, { duration: 200 });
          },
        );

        if (isAnimation)
          buttonScale.value = withSequence(
            withTiming(1.05, { duration: 200, easing: Easing.back(10) }),
            withTiming(1, { duration: 100 }),
          );

        if (onPressUI) onPressUI();
        if (onPress) runOnJS(onPress)();
      });

    const rRootStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: buttonScale.value }],
      };
    });

    const rStyle = useAnimatedStyle(() => {
      const { x, y, radius } = overlayProps.value;
      return {
        borderRadius: radius,
        width: radius * 2,
        height: radius * 2,
        opacity: overlayOpacity.value,
        transform: [
          { translateX: x - radius },
          { translateY: y - radius },
          { scale: overlayScale.value },
        ],
      };
    }, []);

    return (
      <GestureHandlerRootView
        style={[styles.root, isNoShadow ? styles.noShadow : undefined]}
      >
        <GestureDetector gesture={tapGesture}>
          <Animated.View
            ref={aref}
            testID={testID}
            style={[
              styles.button,
              style,
              isNoRadius ? styles.noRadius : undefined,
              isDisabled || isLoading ? styles.disabled : undefined,
              isNoBackground ? styles.noBackground : undefined,
              rRootStyle,
            ]}
          >
            {!isLoading ? (
              <Text style={[styles.title, titleStyle]}>{title}</Text>
            ) : null}
            <Animated.View
              pointerEvents="none"
              style={[
                styles.overlayStyle,
                overlayColor ? { backgroundColor: overlayColor } : undefined,
                isOverlayLight ? styles.overlayLight : undefined,
                rStyle,
              ]}
            />
          </Animated.View>
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
  root: {
    // iOS
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    // Android
    elevation: 5,
  },
  noShadow: {
    // iOS
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    // Android
    elevation: 0,
  },
  button: {
    margin: 16,
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
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  overlayLight: { backgroundColor: "rgba(255,255,255,0.4)" },
  activityIndicator: {
    ...StyleSheet.absoluteFillObject,
  },
});
