import { Children } from "react";
import { View, StyleSheet, Dimensions } from "react-native";


export default function OutterContainer({children}) {

    return(
        <View style={styles.outterContainer}>
            {children}
        </View>
    )
}

const screenWidth = Dimensions.get("window").width ;
const screenHeight = Dimensions.get("window").height ;
const styles = StyleSheet.create({

    outterContainer: {
     flex: 1,
    padding: 10,    
    marginTop: 55,
    marginBottom: 110,
    width: screenWidth < 390 ? 350 : 400 ,
    alignContent: "center",
    alignItems: "center",
    // borderColor: '#000000',
    // borderWidth: 3,
    borderRadius: 15,
    alignSelf: "center",
    

   },
})