import { Text, View, StyleSheet, Dimensions, Image} from "react-native";
import QuestionComponent from "../../components/QuestionComponent";
import PrimaryButton from "../../components/primaryButton";
import FocusCard from "../../components/FocusCard";
import Screen1QuesionsCard from "../../components/Screen1QuestiosCard";
import React from "react";



export default function CheckInScreen3() {

    return(
        <View style={styles.outterContainer}>
             
             <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                    Where are you right now - in engergy and focus?
                </Text>
             </View>             

             <View style={styles.OptionsCard}>
                
                    <View style={styles.energyLevelContainer}>
                         <Text style={styles.EnergyLevelText}>Energy Level</Text>
                    </View>
                         <View style={styles.energyMeterContainer}>
                              <Text>Energy meter</Text>
                         </View>

                    <View style={styles.energyLevelContainer}>
                         <Text style={styles.EnergyLevelText}>Mental Clarity</Text>
                    </View>
                         <View style={styles.mentalClarityContainer}>
                              <Text style={styles.mentalClarityButtons} >Scattered</Text>
                              <Text style={styles.mentalClarityButtons}>Balanced</Text>
                              <Text style={styles.mentalClarityButtons}>Focused</Text>
                         </View>
                    
                
             </View>

            <PrimaryButton style={styles.startButton}>
              { "NEXT"}
            </PrimaryButton>
            
        </View>
    ) ;
}

const styles = StyleSheet.create({

    outterContainer: {
       flex: 1,
    padding: Dimensions.get("window").width < 390 ? 10 : 24,    
    marginTop: 80,
    marginBottom: 140,
    width: Dimensions.get("window").width < 390 ? 350 : 400 ,
    alignContent: "center",
    alignItems: "center",
    borderRadius: 45,
    alignSelf: "center",
    backgroundColor: 'beige',

    //  borderColor: '#000000',
    // borderWidth: 3,
    },

    titleContainer: {

        // borderColor: '#000000',
        // borderWidth: 3,
        height: 80,
        width: '100%',
        marginBottom: 20,
        },
    titleText: {
        fontWeight: "bold",
        fontSize: 30,
        flexDirection: "row",
        flexWrap: "wrap",
        textAlign: "center"
    },
   
    OptionsCard: {
        
     //    borderColor: '#000000',
     //    borderWidth: 3,
        width: '100%',
        height: Dimensions.get("window").height < 880 ? 410 : 470 ,
        position: "absolute",
        bottom: 120,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    energyLevelContainer: {
     
          // borderColor: '#000000',
          // borderWidth: 2,
          
    },
    EnergyLevelText: {
     fontWeight: "bold",
     fontSize: 30,
     marginTop: 20,
     marginBottom: 20,

    },
    energyMeterContainer: {
     width: '100%',
     height: 100,
     borderColor: '#000000',
     borderWidth: 2,
    },
    mentalClarityContainer: {
     width: '100%',
     height: 60,
     flexDirection: "row",
     alignItems: "center",
     // borderColor: '#000000',
     // borderWidth: 2,
    },
    mentalClarityButtons: {
     marginLeft: 10,
     padding: 10,
     backgroundColor: '#305bde',
     borderRadius: 20,
     fontSize: 18,
     fontWeight: "bold",
     color: 'white'

    }


   
   
    
    
   
   
})