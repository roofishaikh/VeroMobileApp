import { Text, View, StyleSheet, Dimensions, Image} from "react-native";
import QuestionComponent from "../../components/QuestionComponent";
import PrimaryButton from "../../components/primaryButton";
import FocusCard from "../../components/FocusCard";
import Screen1QuesionsCard from "../../components/Screen1QuestiosCard";
import React, { useEffect } from "react";
import { useCheckIn, markCheckInComplete } from "../../contexts/CheckInContext";



export default function CheckInScreen5() {
    const { checkInData } = useCheckIn();
    useEffect(() => { markCheckInComplete(); }, []);

    // Helper function to format the data for display
    const formatDisplayValue = (value) => {
        if (!value || value === '') return 'Skipped';
        
        // Format activity labels
        if (value === 'deep-work') return 'Deep Work';
        if (value === 'shallow-work') return 'Shallow Work';
        
        // Capitalize first letter for other values
        return value.charAt(0).toUpperCase() + value.slice(1);
    };

    // Helper function to get emotion label
    const getEmotionLabel = (emotionId) => {
        if (!emotionId || emotionId === '') return 'Skipped';
        
        const emotionMap = {
            'happy': 'Happy',
            'neutral': 'Neutral',
            'sad': 'Sad',
            'angry': 'Angry',
            'anxious': 'Anxious',
            'numb': 'Numb'
        };
        return emotionMap[emotionId] || 'Skipped';
    };

    return(
        <View style={styles.outterContainer}>
             
            <View >
                <Image style={styles.ImageContainer}  source={require('../../assets/icons/plant.png')} />
            </View>             

             <View style={styles.OptionsCard}>
                
                    <View style={styles.title}>
                         <Text style={styles.titleText}>Check-In Complete!</Text>
                    </View>

                     <View style={styles.resultCard}>

                       <View style={styles.resultCardProps}>
                         <Text style={styles.resultText1}>Primary Emotion</Text>
                        <Text style={styles.resultText2}>{getEmotionLabel(checkInData.primaryEmotion)}</Text>
                       </View>

                       <View style={styles.resultCardProps}>
                         <Text style={styles.resultText1}>Tertiary Emotion</Text>
                        <Text style={styles.resultText2}>{formatDisplayValue(checkInData.tertiaryEmotion)}</Text>
                       </View>

                       <View style={styles.resultCardProps}>
                         <Text style={styles.resultText1}>Energy</Text>
                        <Text style={styles.resultText2}>{formatDisplayValue(checkInData.energyLevel)}</Text>
                       </View>

                       <View style={styles.resultCardProps}>
                         <Text style={styles.resultText1}>Focus</Text>
                        <Text style={styles.resultText2}>{formatDisplayValue(checkInData.mentalClarity)}</Text>
                       </View>

                       <View style={styles.resultCardProps}>
                         <Text style={styles.resultText1}>Activity</Text>
                        <Text style={styles.resultText2}>{formatDisplayValue(checkInData.currentActivity)}</Text>
                       </View>
                    </View>

                   
                    
                
             </View>

            <PrimaryButton 
              text="Write a Thought"
              style={styles.startButton}
            />
            
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
    // borderWidth: 3,
    },

   
   
    OptionsCard: {
        
        // borderColor: '#000000',
        // borderWidth: 3,
        width: '100%',
        height: Dimensions.get("window").height < 880 ? 410 : 420 ,
        position: "absolute",
        bottom: 120,
        
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
     borderRadius: 25,
    flexDirection: "column"
    },
    resultCardProps:{
         borderColor: '#000000',
         borderWidth: 2,
         flexDirection: "row",
         marginTop: 15,
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
    ImageContainer:{
        height: 150,
        width: 150,
        alignSelf: "center",
        borderRadius: 100,
        position: "absolute",
        top: 0,
        
    },
    
})