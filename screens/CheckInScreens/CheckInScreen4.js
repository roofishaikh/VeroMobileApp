import { Text, View, StyleSheet, Dimensions, Image} from "react-native";
import QuestionComponent from "../../components/QuestionComponent";
import PrimaryButton from "../../components/primaryButton";
import FocusCard from "../../components/FocusCard";
import Screen1QuesionsCard from "../../components/Screen1QuestiosCard";
import React from "react";



export default function CheckInScreen4() {

    return(
        <View style={styles.outterContainer}>
             
             <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                    What are you doing at the moment?
                </Text>
             </View>

            

             <View style={styles.emojisHolder}>
                <View style={styles.iconContainer}>
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/brain.png')} />
                    <Text style={styles.emojiText}>Deep Work</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/text-bubble.png')} />
                    <Text style={styles.emojiText}>Meeting</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/exercise.png')} />
                    <Text style={styles.emojiText}>Resting</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/exercise (1).png')} />
                    <Text style={styles.emojiText}>Exercising</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/work-from-home.png')} />
                    <Text style={styles.emojiText}>Shallow work</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/neutral.png')} />
                    <Text style={styles.emojiText}>Distracted</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/eating.png')} />
                    <Text style={styles.emojiText}>Eating</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/scrolling.png')} />
                    <Text style={styles.emojiText}>Scrolling</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/walking.png')} />
                    <Text style={styles.emojiText}>Walking</Text>
                </View>
             
             </View>

            <PrimaryButton style={styles.startButton}>
              { "Finish Check-In"}
            </PrimaryButton>
            
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
     //    borderColor: '#000000',
     //    borderWidth: 2,
        
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