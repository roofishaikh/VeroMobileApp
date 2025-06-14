import { View, Text, StyleSheet, Pressable, Platform } from "react-native";

function PrimaryButton({ children, onPress }) {
  return (
    <View style={styles.outerWrapper}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.button,
          pressed && Platform.OS === 'ios' && styles.pressed, // iOS opacity on press
        ]}
        android_ripple={{ color: '#ffe5dc' }} // ripple effect for Android
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  outerWrapper: {
    borderRadius: 50,
    overflow: Platform.OS === 'android' ? 'hidden' : 'visible', // Required for Android ripple to be clipped to rounded corners
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#F67F69',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: 22,
  },
  pressed: {
    opacity: 0.75,
  },
});
