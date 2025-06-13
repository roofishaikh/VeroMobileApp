import { Text, View, StyleSheet, Dimensions} from "react-native";
import QuestionComponent from "./QuestionComponent";



export default function Screen1QuesionsCard({children}) {

    return(
        <View style={styles.outterContainer}>
            <QuestionComponent>
                {children}
            </QuestionComponent>
           
        </View>
    ) ;
}

const styles = StyleSheet.create({

    outterContainer: {
        flexDirection: "column",
        borderColor: '#000000',
        width: '100%',
        borderWidth: 3,
        height: Dimensions.get("window").height < 880 ? 240 : 310 ,
        position: "absolute",
        bottom: 120,
    }
})