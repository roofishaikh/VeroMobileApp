import { Text, View, StyleSheet, Dimensions, Image, Pressable, Platform} from "react-native";
import QuestionComponent from "../../components/QuestionComponent";
import PrimaryButton from "../../components/primaryButton";
import FocusCard from "../../components/FocusCard";
import Screen1QuesionsCard from "../../components/Screen1QuestiosCard";
import React, { useState } from "react";
import { useCheckIn } from "../../contexts/CheckInContext";
import { useNavigation } from "@react-navigation/native";



export default function CheckInScreen4() {
    const { checkInData, updateCheckInData } = useCheckIn();
    const navigation = useNavigation();
    const [selectedActivity, setSelectedActivity] = useState(checkInData.currentActivity);

    const handleActivityPress = (activity) => {
        setSelectedActivity(activity);
        updateCheckInData('currentActivity', activity);
        // Navigate to summary screen after recording the activity
        navigation.navigate('CheckInCompleteScreen5');
    };

    const handleSkip = () => {
        // Record empty string for skipped current activity
        updateCheckInData('currentActivity', '');
        // Navigate to summary screen
        navigation.navigate('CheckInCompleteScreen5');
    };

    const activities = [
        { id: 'deep-work', icon: require('../../assets/icons/brain.png'), label: 'Deep Work' },
        { id: 'meeting', icon: require('../../assets/icons/text-bubble.png'), label: 'Meeting' },
        { id: 'resting', icon: require('../../assets/icons/exercise.png'), label: 'Resting' },
        { id: 'exercising', icon: require('../../assets/icons/exercise (1).png'), label: 'Exercising' },
        { id: 'shallow-work', icon: require('../../assets/icons/work-from-home.png'), label: 'Shallow work' },
        { id: 'distracted', icon: require('../../assets/icons/neutral.png'), label: 'Distracted' },
        { id: 'eating', icon: require('../../assets/icons/eating.png'), label: 'Eating' },
        { id: 'scrolling', icon: require('../../assets/icons/scrolling.png'), label: 'Scrolling' },
        { id: 'walking', icon: require('../../assets/icons/walking.png'), label: 'Walking' },
    ];

    return(
        <View style={styles.outterContainer}>
             
             <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                    What are you doing at the moment?
                </Text>
             </View>

            

             <View style={styles.emojisHolder}>
                {activities.map((activity) => (
                    <Pressable
                        key={activity.id}
                        style={({ pressed }) => [
                            styles.iconContainer,
                            pressed && styles.iconPressed,
                            selectedActivity === activity.id && styles.iconSelected
                        ]}
                        onPress={() => handleActivityPress(activity.id)}
                        android_ripple={{
                            color: 'rgba(0, 0, 0, 0.1)',
                            borderless: false,
                            radius: 50
                        }}
                    >
                        <Image style={styles.emojiStyling} source={activity.icon} />
                        <Text style={styles.emojiText}>{activity.label}</Text>
                    </Pressable>
                ))}
             </View>

            <PrimaryButton 
              text="SKIP"
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
    marginTop: 60,
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
      
    
    iconContainer: {
        width: 100,
        height: 100,
        marginLeft:6,
        marginRight: 6,
        marginTop: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
     //    borderColor: '#000000',
     //    borderWidth: 2,
        
    },
    iconPressed: {
        opacity: Platform.OS === 'ios' ? 0.6 : 1,
        transform: [{ scale: 0.95 }],
    },
    iconSelected: {
        backgroundColor: 'rgba(52, 91, 222, 0.2)',
        borderWidth: 2,
        borderColor: '#305bde',
    },
    emojisHolder: {
        
     //    borderColor: '#000000',
     //    borderWidth: 3,
        width: '100%',
        height: Dimensions.get("window").height < 880 ? 340 : 410 ,
        position: "absolute",
        bottom: 120,
        flexDirection: "row",
        flexWrap: "wrap",
        
        

    },
    emojiStyling: {
        width: 60,
        height: 60,
        alignSelf: "center",
    },
    emojiText: {
     //    borderColor: '#000000',
     //    borderWidth: 3,     
        fontSize: 18,
        textAlign: "center"
    },
   
})