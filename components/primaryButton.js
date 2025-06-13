import { View, Text, StyleSheet, Pressable } from "react-native";


function PrimaryButton({ children, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{children}</Text>
    </Pressable>
  );
}


export default PrimaryButton ;

const styles = StyleSheet.create({

    buttonText: {

        textAlign: "center",
        color: 'white',
        fontWeight: "semibold",
        fontSize: 22 ,

    },
    pressed: {
        opacity: 0.75
    },
   button: {
  backgroundColor: '#F67F69',
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 50,
  alignItems: 'center',
  position: "absolute",
  bottom: 60,  
}


})