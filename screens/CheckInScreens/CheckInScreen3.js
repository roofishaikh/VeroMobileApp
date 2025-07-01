import { Text, View, StyleSheet, Dimensions, Image, Pressable, Platform} from "react-native";
import QuestionComponent from "../../components/QuestionComponent";
import PrimaryButton from "../../components/primaryButton";
import FocusCard from "../../components/FocusCard";
import Screen1QuesionsCard from "../../components/Screen1QuestiosCard";
import React, { useState } from "react";
import { useCheckIn } from "../../contexts/CheckInContext";
import { useNavigation } from "@react-navigation/native";



export default function CheckInScreen3() {
    const { checkInData, updateCheckInData } = useCheckIn();
    const navigation = useNavigation();
    const [selectedEnergyLevel, setSelectedEnergyLevel] = useState(checkInData.energyLevel);
    const [selectedMentalClarity, setSelectedMentalClarity] = useState(checkInData.mentalClarity);

    const handleEnergyLevelPress = (level) => {
        setSelectedEnergyLevel(level);
        updateCheckInData('energyLevel', level);
        // Navigate to next screen after recording energy level
        navigation.navigate('CheckInScreen4');
    };

    const handleMentalClarityPress = (clarity) => {
        setSelectedMentalClarity(clarity);
        updateCheckInData('mentalClarity', clarity);
        // Navigate to next screen after recording mental clarity
        navigation.navigate('CheckInScreen4');
    };

    const handleSkip = () => {
        // Record empty strings for skipped energy and mental clarity
        updateCheckInData('energyLevel', '');
        updateCheckInData('mentalClarity', '');
        // Navigate to next screen
        navigation.navigate('CheckInScreen4');
    };

    const energyLevels = ['Low', 'Medium', 'High'];
    const mentalClarityOptions = ['Scattered', 'Balanced', 'Focused'];

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
                        {energyLevels.map((level) => (
                            <Pressable
                                key={level}
                                style={({ pressed }) => [
                                    styles.energyButton,
                                    pressed && styles.optionPressed,
                                    selectedEnergyLevel === level && styles.optionSelected
                                ]}
                                onPress={() => handleEnergyLevelPress(level)}
                                android_ripple={{
                                    color: 'rgba(0, 0, 0, 0.1)',
                                    borderless: false,
                                    radius: 25
                                }}
                            >
                                <Text style={styles.energyButtonText}>{level}</Text>
                            </Pressable>
                        ))}
                    </View>

                    <View style={styles.energyLevelContainer}>
                         <Text style={styles.EnergyLevelText}>Mental Clarity</Text>
                    </View>
                    <View style={styles.mentalClarityContainer}>
                        {mentalClarityOptions.map((clarity) => (
                            <Pressable
                                key={clarity}
                                style={({ pressed }) => [
                                    styles.mentalClarityButtons,
                                    pressed && styles.optionPressed,
                                    selectedMentalClarity === clarity && styles.optionSelected
                                ]}
                                onPress={() => handleMentalClarityPress(clarity)}
                                android_ripple={{
                                    color: 'rgba(0, 0, 0, 0.1)',
                                    borderless: false,
                                    radius: 25
                                }}
                            >
                                <Text style={styles.mentalClarityButtonText}>{clarity}</Text>
                            </Pressable>
                        ))}
                    </View>
                    
                
             </View>

            <PrimaryButton 
              text="NEXT"
              style={styles.startButton}
              onTap={handleSkip}
            />
            
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
     flexDirection: 'row',
     justifyContent: 'space-around',
     alignItems: 'center',
     paddingHorizontal: 20,
    },
    energyButton: {
        padding: 15,
        backgroundColor: '#305bde',
        borderRadius: 20,
        minWidth: 80,
        alignItems: 'center',
    },
    energyButtonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: 'white',
    },
    mentalClarityContainer: {
     width: '100%',
     height: 60,
     flexDirection: "row",
     alignItems: "center",
     justifyContent: 'space-around',
     paddingHorizontal: 20,
     // borderColor: '#000000',
     // borderWidth: 2,
    },
    mentalClarityButtons: {
     padding: 10,
     backgroundColor: '#305bde',
     borderRadius: 20,
     minWidth: 80,
     alignItems: 'center',
    },
    mentalClarityButtonText: {
     fontSize: 18,
     fontWeight: "bold",
     color: 'white',
    },
    optionPressed: {
        opacity: Platform.OS === 'ios' ? 0.6 : 1,
        transform: [{ scale: 0.95 }],
    },
    optionSelected: {
        backgroundColor: '#1e3a8a',
        borderWidth: 2,
        borderColor: '#ffffff',
    },
})