import { Text, View, StyleSheet, Dimensions, Image} from "react-native";
import QuestionComponent from "../../components/QuestionComponent";
import PrimaryButton from "../../components/primaryButton";
import FocusCard from "../../components/FocusCard";
import Screen1QuesionsCard from "../../components/Screen1QuestiosCard";
import React from "react";
import { useRoute } from '@react-navigation/native';



export default function DeepWorkSummary() {
    const route = useRoute();
    const goalTitle = route.params?.goalTitle || 'No goal selected';
    const focusedTime = route.params?.focusedTime || '--:--';
    const completedSubgoals = route.params?.completedSubgoals ?? 0;
    const totalSubgoals = route.params?.totalSubgoals ?? 0;
    const sessionCount = route.params?.sessionCount ?? 0;

    return(
        <View style={styles.outterContainer}>
             
                        

             <View style={styles.OptionsCard}>
                
                    <View style={styles.title}>
                         <Text style={styles.titleText}>What did you Complete?</Text>
                    </View>

                     <View style={styles.resultCard}>
                    <Image source={require('../../assets/icons/VeroListening.png')}
                        style={{height: 40, width: 40, alignSelf: "flex-end"}}  />
                    <View style={styles.GoalsCompletedChecklist}>
                        <Text>{goalTitle}</Text>
                    </View>
                        <View style={styles.DeepWorkSummaryContainer}>

                       <View style={styles.resultCardProps}>
                         <Text style={styles.resultText1}>Time Focused</Text>
                        <Text style={styles.resultText2}>{focusedTime}</Text>
                       </View>

                       <View style={styles.resultCardProps}>
                         <Text style={styles.resultText1}>Tasks Completed</Text>
                        <Text style={styles.resultText2}>{`${completedSubgoals}/${totalSubgoals}`}</Text>
                       </View>

                       <View style={styles.resultCardProps}>
                         <Text style={styles.resultText1}>Deep Work Sessions</Text>
                        <Text style={styles.resultText2}>{sessionCount}</Text>
                       </View>

                       <View style={{marginTop: 10}}>
                         <Text style={{fontSize: 18,}} >You showed up. That's what builds momentum</Text>
                        
                       </View>

                      
                       </View>
                    </View>

                   
                    
                
            <Text style={{textAlign:"center",fontSize:20,color:'blue',fontWeight: 'semibold'}}>Momentum Activated.</Text>
             </View>
            <PrimaryButton style={styles.startButton}>
              { "Return to Home"}
            </PrimaryButton>
            
        </View>
    ) ;
}

const styles = StyleSheet.create({

    outterContainer: {
    flex: 1,
    padding: Dimensions.get("window").width < 390 ? 10 : 24,    
    marginTop: 30,
    marginBottom: 140,
    width: Dimensions.get("window").width < 390 ? 350 : 400 ,
    alignContent: "center",
    alignItems: "center",
    borderRadius: 45,
    alignSelf: "center",
    //backgroundColor: 'beige',
    //  borderColor: '#000000',
    // borderWidth: 2,
    },

   
   
    OptionsCard: {
        
        // borderColor: '#000000',
        // borderWidth: 1,
        width: '100%',
        height: Dimensions.get("window").height < 880 ? 510 : 570 ,
        position: "absolute",
        bottom: 120,
        //backgroundColor: 'beige',
        borderRadius: 45,
    },
    title: {
     
        //   borderColor: '#000000',
        //   borderWidth: 2,
          width: '100%'
    },
    titleText: {
     fontWeight: "bold",
     fontSize: 30,
     marginTop: 20,
     marginBottom: 20,
     textAlign: "center"

    },
    resultCard: {
     width: '100%',
     flex: 1,
     padding: 15,
     borderColor: '#000000',
     borderWidth: 2,
     marginTop: 0,
     borderRadius: 45,
    flexDirection: "column",
    backgroundColor: 'beige',
    },
    resultCardProps:{
        //  borderColor: '#000000',
        //  borderWidth: 2,
         flexDirection: "row",
         marginTop: 5,
         padding: 8,
         justifyContent: 'space-between',
        
    },
    resultText1: {
        color: '#00000061',
        fontWeight: 'bold',
        fontSize: 18,
               
       
    },
    resultText2: {
        color: '#000000ff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    GoalsCompletedChecklist: { 
        // borderColor: '#000000',
        //  borderWidth: 2,
         position: "absolute",
         top: 60,
         alignSelf: "center",
         width: '100%',
         height: "45%"
   },
   DeepWorkSummaryContainer: {
    	//  borderColor: '#000000',
        //  borderWidth: 2,
         position: "absolute",
         bottom: 20,
         alignSelf: "center",
         width: '100%',
   },
   subGoal: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  done: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
    
})