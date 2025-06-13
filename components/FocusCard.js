import { Text, View, StyleSheet } from "react-native";



export default function FocusCard() {

    return(
    <View style={styles.focusOutterContainer}>
        <View style={styles.innerContainer}>
            <Text style={styles.innerText}>FOCUS</Text>
        </View>
    </View>
    )
}

const styles = StyleSheet.create({

    focusOutterContainer: {
        alignSelf: "center",
        height: 210,
        width: 210,
        position: "absolute",
        top: 60,
        backgroundColor: '#ff3636',
        flex: 1,
        marginTop: 20,
        borderRadius: 120,
        alignContent:"center",
        alignItems: "center"
        
    },
    innerContainer: {

        height: 190,
        width: 190,
        backgroundColor: '#e5cd84',
        borderRadius: 120,
        alignSelf: "center",
        position: "absolute",
        top: 10,
    },
    innerText: {

        fontWeight: "bold",
        fontSize: 40,
        position:"absolute",
        top: 65,
        alignSelf: "center"
    }
})