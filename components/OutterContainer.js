import { Children } from "react";
import { View, StyleSheet, Dimensions } from "react-native";


export default function OutterContainer({Children}) {

    return(
        <View style={styles.outterContainer}>
            {Children}
        </View>
    )
}

const styles = StyleSheet.create({

    outterContainer: {
           flex: 1,
        padding: Dimensions.get("window").width < 390 ? 10 : 24,    
        marginTop: 60,
        marginBottom: 140,
        width: Dimensions.get("window").width < 390 ? 350 : 400 ,
        alignContent: "center",
        alignItems: "center",
        borderRadius: 15,
        alignSelf: "center",
        backgroundColor: 'beige',
    
        //  borderColor: '#000000',
        // borderWidth: 3,
        },
})