import { Text, View, StyleSheet } from "react-native";
import FocusCard from "../../components/FocusCard";
import {Dimensions} from 'react-native';
import PrimaryButton from "../../components/primaryButton";
import Screen1QuestiosCard from "../../components/Screen1QuestiosCard";
import QuestionComponent from "../../components/QuestionComponent";

export default function Screen1(){

    return(
        <View style={styles.outterContainer}>
            <Text style={styles.titleText}>plan to rise and shine</Text>
            <FocusCard />
            <PrimaryButton style={styles.startButton}>
              { "COMPLETE RITUAL"}
            </PrimaryButton>
            <Screen1QuestiosCard>
                <Text>{"What am I grateful for today?"}</Text>
                <Text>{"What am I avoiding?"}</Text>  
                <Text>{"What am I excieted about today?"}</Text>  
                <Text>{"What is one thing i must accomplish today?"}</Text>  
            </Screen1QuestiosCard>
           
            
                
                
          
        </View>

    )
}

const styles=StyleSheet.create({

   outterContainer: {
     flex: 1,
    padding: 24,    
    marginTop: 60,
    marginBottom: 140,
    width: Dimensions.get("window").width < 390 ? 350 : 400 ,
    alignContent: "center",
    alignItems: "center",
    borderColor: '#000000',
    borderWidth: 3,
    borderRadius: 15,
    alignSelf: "center",
    

   },
   titleText: {
    fontWeight: "bold",
    fontSize: 24,
    color: '#ed9aed',    

   },
   

})