import { Text, View, StyleSheet } from "react-native";
import FocusCard from "../../components/FocusCard";
import {Dimensions} from 'react-native';
import PrimaryButton from "../../components/primaryButton";
import Screen1QuestiosCard from "../../components/Screen1QuestiosCard";
import QuestionComponent from "../../components/QuestionComponent";
import OutterContainer from "../../components/OutterContainer";
import GradientScreenWrapper from "../../components/GradientScreenWrapper";

export default function Screen1({navigation}){ 

    function PressHandler() {
        navigation.navigate('deepWorkScreen2')
    } ;
    return(
        <GradientScreenWrapper>
        <OutterContainer>
            <Text style={styles.titleText}>plan to rise and shine</Text>
            <FocusCard />
            <PrimaryButton onPress={PressHandler}>
              { "COMPLETE RITUAL"}
            </PrimaryButton>
            <Screen1QuestiosCard>
                <Text>{"What am I grateful for today?"}</Text>
                <Text>{"What am I avoiding?"}</Text>  
                <Text>{"What am I excieted about today?"}</Text>  
                <Text>{"What is one thing i must accomplish today?"}</Text>  
            </Screen1QuestiosCard>
           
            
                
                
        
        </OutterContainer>
        </GradientScreenWrapper>
    )
}

const screenWidth = Dimensions.get("window").width ;
const screenHeight = Dimensions.get("window").height ;

const styles=StyleSheet.create({

  
   titleText: {
    fontWeight: "bold",
    fontSize: 24,
    color: '#ed9aed',    

   },
   

})