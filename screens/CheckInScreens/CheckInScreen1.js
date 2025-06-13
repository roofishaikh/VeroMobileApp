import { Text, View, StyleSheet, Dimensions, Image, SafeAreaView} from "react-native";
import QuestionComponent from "../../components/QuestionComponent";
import PrimaryButton from "../../components/primaryButton";
import FocusCard from "../../components/FocusCard";
import Screen1QuesionsCard from "../../components/Screen1QuestiosCard";
import React from "react";
import OutterContainer from "../../components/OutterContainer";



export default function CheckInScreen1() {

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
                <View style={styles.iconContainer}>
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/happy-face.png')} />
                    <Text style={styles.emojiText}>Happy</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/neutral.png')} />
                    <Text style={styles.emojiText}>Neutral</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/sad.png')} />
                    <Text style={styles.emojiText}>Sad</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/angry.png')} />
                    <Text style={styles.emojiText}>Angry</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/anxious.png')} />
                    <Text style={styles.emojiText}>Anxious</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/neutral.png')} />
                    <Text style={styles.emojiText}>Numb</Text>
                </View>
             
                
             <View style={styles.exploreFeelContainer}>
                <Text style={styles.emojiFeelContainerText}>
                    Explore this feeling deeper
                </Text>
             

             <View style={styles.iconContainer}>
                    <Image style={styles.emojiStyling} source={require('../../assets/icons/neutral.png')} />
                    {/* <Text style={styles.emojiText}>Overwhelmed</Text> */}
                </View>

                </View>

             </View>

            <PrimaryButton style={styles.startButton}>
              { "NEXT"}
            </PrimaryButton>
            
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
        // borderColor: '#000000',
        // borderWidth: 2,
        
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