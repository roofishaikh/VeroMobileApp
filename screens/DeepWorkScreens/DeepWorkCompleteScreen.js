import { Text, View, StyleSheet, Dimensions, Image} from "react-native";
import QuestionComponent from "../../components/QuestionComponent";
import PrimaryButton from "../../components/primaryButton";
import FocusCard from "../../components/FocusCard";
import Screen1QuesionsCard from "../../components/Screen1QuestiosCard";
import React from "react";



export default function DeepWorkComplete() {

    return(
        <View style={styles.outterContainer}>
             
                        

             <View style={styles.OptionsCard}>
                
                    <View style={styles.title}>
                         <Text style={styles.titleText}>Deep Work</Text>
                    </View>

                     <View style={styles.resultCard}>

                       <View style={styles.GoalsCompletedChecklist}>
                    <Image source={require('../../assets/icons/VeroListening.png')}
                        style={{height: 80, width: 80, alignSelf: "flex-end"}}  />
                        <Text> Goal: from goalscard</Text>
                    </View>
                    
                        <View style={styles.DeepWorkSummaryContainer}>
                          <Text style={{fontWeight: "bold", textAlign: "center", color: 'turquoise'
                          }}>
                            Task completed in 22 mins! Well done.
                          </Text>
                          <Text style={{textAlign: "center", color:'blue' }}>Momentum is building</Text>
                          <Text >Goals from goalscard with checkbox</Text>
                       </View>
                    </View>
            </View>
                   
                    
                
            
             
                    
            <View style={styles.TimerContainer}>
              <View style={styles.pauseButton}>
                <Text style={styles.controlText}>Pause</Text>
              </View>

              <View style={styles.OutterTimer} >
                    <View style={styles.InnerTimer}>

                    </View>
              </View>

              <View style={styles.endButton}>
                <Text style={styles.controlText}>End</Text>
              </View>
            </View>
             
             
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
     
          // borderColor: '#000000',
          // borderWidth: 2,
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
    //  borderColor: '#000000',
    //  borderWidth: 2,
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
         top: 10,
         alignSelf: "center",
         width: '100%',
         height: "35%",
         flexDirection: "column"
   },
   DeepWorkSummaryContainer: {
    	//  borderColor: '#000000',
      //    borderWidth: 2,
         position: "absolute",
         bottom: 20,
         alignSelf: "center",
         width: '100%',
         
         height: Dimensions.get("window").height < 880 ? 200 : 250 ,
   },
   TimerContainer: {
    flexDirection: "row",
    // borderWidth: 1,
    // borderColor: '#000000',
    justifyContent: "space-between",
    height: 100,
    position: "absolute",
    bottom: 10,
    width: '100%'
   
   },
   pauseButton: {
   alignSelf: "center",
   backgroundColor:'#F67F69',
   width: 80,
   height: 40,
  //  borderColor: '#000000',
  //  borderWidth: 1,
   borderRadius: 20,
   
   },
   endButton: {
   alignSelf: "center",
   backgroundColor:'#F67F69',
   width: 80,
   height: 40,
  //  borderColor: '#000000',
  //  borderWidth: 1,
   borderRadius: 20, 
   
   },
   OutterTimer:{
   width: 100,
   height: 100,
  //  borderColor: '#192cff',
  //  borderWidth: 1, 
   alignSelf: "center",
   borderRadius: 50,
   justifyContent: "center",
   backgroundColor: 'blue'
    
   },
   InnerTimer: {
    width: 75,
   height: 75,
  //  borderColor: '#000000',
  //  borderWidth: 1,
   alignSelf: "center",
   borderRadius: 50,
   backgroundColor: 'white'
   },
   controlText: {
    textAlign: "center",
    padding: 5,
    fontWeight: "bold",
    fontSize: 18,

    
   }
    
})