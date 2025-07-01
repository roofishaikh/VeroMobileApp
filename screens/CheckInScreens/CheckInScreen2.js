import { Text, View, StyleSheet, Dimensions, Image, SafeAreaView, ScrollView, Pressable, Platform} from "react-native";
import QuestionComponent from "../../components/QuestionComponent";
import PrimaryButton from "../../components/primaryButton";
import FocusCard from "../../components/FocusCard";
import Screen1QuesionsCard from "../../components/Screen1QuestiosCard";
import React, { useState } from "react";
import { useCheckIn } from "../../contexts/CheckInContext";



export default function CheckInScreen2() {
    const { checkInData, updateCheckInData } = useCheckIn();
    const [selectedTertiaryEmotion, setSelectedTertiaryEmotion] = useState(checkInData.tertiaryEmotion);

    const handleTertiaryEmotionPress = (emotion) => {
        setSelectedTertiaryEmotion(emotion);
        updateCheckInData('tertiaryEmotion', emotion);
    };

    const tertiaryEmotions = [
        'Let Down', 'Betrayed', 'Disrespected', 'Ridiculed', 'Indignant', 
        'Violated', 'Furious', 'Provoded', 'Hostile', 'Infuriated', 
        'Annoyed', 'Withdrawn', 'Numb', 'Skeptical', 'Dismissive'
    ];

    return(
        <SafeAreaView style={styles.outterContainer}>
             
             <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                    Which part of angry feels most true?
                </Text>
             </View>             

             <View style={styles.OptionsCard}>
                {tertiaryEmotions.map((emotion) => (
                    <Pressable
                        key={emotion}
                        style={({ pressed }) => [
                            styles.EmotionsButton,
                            pressed && styles.emotionPressed,
                            selectedTertiaryEmotion === emotion && styles.emotionSelected
                        ]}
                        onPress={() => handleTertiaryEmotionPress(emotion)}
                        android_ripple={{
                            color: 'rgba(0, 0, 0, 0.1)',
                            borderless: false,
                            radius: 25
                        }}
                    >
                        <Text style={styles.EmotionsButtonText}>{emotion}</Text>
                    </Pressable>
                ))}
             </View>

            <PrimaryButton 
              text="SAVE EMOTION"
              style={styles.startButton}
            />
            
        </SafeAreaView>
    ) ;
}

const height = Dimensions.get('window').height 
const width = Dimensions.get('window').width 
const styles = StyleSheet.create({

    outterContainer: {
        flex: 1,
        padding: width < 390 ? 10 : 24,    
        marginTop: height * 0.05,
        marginBottom: height * 0.15,
        width: width < 390 ? width * 0.9 : width * 0.95,
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
        
        // borderColor: '#000000',
        // borderWidth: 3,
        width: '100%',
        height: Dimensions.get("window").height < 880 ? 410 : 470 ,
        position: "absolute",
        bottom: 120,
        flexDirection: "row",
        flexWrap: "wrap",
    },

    EmotionsButton: {
        borderWidth: 2,
        borderColor: '#0000002b',
        borderRadius: 50,
        padding: 10,
        margin: 10,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
    },
    emotionPressed: {
        opacity: Platform.OS === 'ios' ? 0.6 : 1,
        transform: [{ scale: 0.95 }],
    },
    emotionSelected: {
        backgroundColor: 'rgba(52, 91, 222, 0.2)',
        borderColor: '#305bde',
        borderWidth: 2,
    },
    EmotionsButtonText: {
        fontSize: 20,
    }
    
    
   
   
})