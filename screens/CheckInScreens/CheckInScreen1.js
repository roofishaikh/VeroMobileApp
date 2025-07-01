import { Text, View, StyleSheet, Dimensions, Image, SafeAreaView, Pressable, Platform} from "react-native";
import QuestionComponent from "../../components/QuestionComponent";
import PrimaryButton from "../../components/primaryButton";
import FocusCard from "../../components/FocusCard";
import Screen1QuesionsCard from "../../components/Screen1QuestiosCard";
import React, { useState } from "react";
import OutterContainer from "../../components/OutterContainer";
import { useCheckIn } from "../../contexts/CheckInContext";



export default function CheckInScreen1() {
    const { checkInData, updateCheckInData } = useCheckIn();
    const [selectedEmotion, setSelectedEmotion] = useState(checkInData.primaryEmotion);

    const handleEmotionPress = (emotion) => {
        setSelectedEmotion(emotion);
        updateCheckInData('primaryEmotion', emotion);
        // Add any additional logic here for emotion selection
    };

    const emotions = [
        { id: 'happy', icon: require('../../assets/icons/happy-face.png'), label: 'Happy' },
        { id: 'neutral', icon: require('../../assets/icons/neutral.png'), label: 'Neutral' },
        { id: 'sad', icon: require('../../assets/icons/sad.png'), label: 'Sad' },
        { id: 'angry', icon: require('../../assets/icons/angry.png'), label: 'Angry' },
        { id: 'anxious', icon: require('../../assets/icons/anxious.png'), label: 'Anxious' },
        { id: 'numb', icon: require('../../assets/icons/neutral.png'), label: 'Numb' },
    ];

    return(
        <SafeAreaView style={styles.outterContainer}>
             
             <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                    Whats most true for you right now?
                </Text>
             </View>

             <View style={styles.FeelActButtonContainer}>
                <Text style={styles.FeelActButtonStyling}>Feeling</Text>
                <Text style={styles.FeelActButtonStyling}>Activity</Text>
             </View>

             <View style={styles.emojisHolder}>
                {emotions.map((emotion) => (
                    <Pressable
                        key={emotion.id}
                        style={({ pressed }) => [
                            styles.iconContainer,
                            pressed && styles.iconPressed,
                            selectedEmotion === emotion.id && styles.iconSelected
                        ]}
                        onPress={() => handleEmotionPress(emotion.id)}
                        android_ripple={{
                            color: 'rgba(0, 0, 0, 0.1)',
                            borderless: false,
                            radius: 45
                        }}
                    >
                        <Image style={styles.emojiStyling} source={emotion.icon} />
                        <Text style={styles.emojiText}>{emotion.label}</Text>
                    </Pressable>
                ))}
             
                
             <View style={styles.exploreFeelContainer}>
                <Text style={styles.emojiFeelContainerText}>
                    Explore this feeling deeper
                </Text>
             

             <Pressable
                style={({ pressed }) => [
                    styles.iconContainer,
                    pressed && styles.iconPressed
                ]}
                android_ripple={{
                    color: 'rgba(0, 0, 0, 0.1)',
                    borderless: false,
                    radius: 45
                }}
             >
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/neutral.png')} />
                    {/* <Text style={styles.emojiText}>Overwhelmed</Text> */}
             </Pressable>

                </View>

             </View>

            <PrimaryButton 
              text="SKIP"
              style={styles.startButton}
            />
            
        </SafeAreaView>
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
    borderRadius: 15,
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
    FeelActButtonContainer: {
        flexDirection: "row",
        borderWidth: 2,
        borderColor: '#000000',
        borderRadius: 15,
    },
    FeelActButtonStyling: {
        margin: 10,
        fontSize: 20,
    },
    iconContainer: {
        width: 90,
        height: 100,
        marginLeft:18,
        marginTop: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 45,
        // borderColor: '#000000',
        // borderWidth: 2,
        
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
        
        // borderColor: '#000000',
        // borderWidth: 3,
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
        alignSelf:"center",
        position: "absolute",
        bottom: 3,
        fontSize: 18,
    },
    exploreFeelContainer: {
        position: "absolute",
        bottom: Dimensions.get("window").height < 880 ? 0 : 18,
        alignSelf: "flex-start",
        marginLeft: 10,
        // borderColor: '#000000',
        // borderWidth: 2,
        
    },
    emojiFeelContainerText: {
        color: '#231bff',
        fontSize: 20,

    }
})