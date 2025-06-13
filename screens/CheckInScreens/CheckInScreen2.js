import { Text, View, StyleSheet, Dimensions, Image, SafeAreaView, ScrollView} from "react-native";
import QuestionComponent from "../../components/QuestionComponent";
import PrimaryButton from "../../components/primaryButton";
import FocusCard from "../../components/FocusCard";
import Screen1QuesionsCard from "../../components/Screen1QuestiosCard";
import React from "react";



export default function CheckInScreen2() {

    return(
        <SafeAreaView style={styles.outterContainer}>
             
             <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                    Which part of angry feels most true?
                </Text>
             </View>             

             <View style={styles.OptionsCard}>
                
               <View style={styles.EmotionsButton}>
                    <Text style={styles.EmotionsButtonText}>Let Down</Text>
               </View>
               <View style={styles.EmotionsButton}>
                    <Text style={styles.EmotionsButtonText}>Betrayed</Text>
               </View>
               <View style={styles.EmotionsButton}>
                    <Text style={styles.EmotionsButtonText}>Disrespected</Text>
               </View>
               <View style={styles.EmotionsButton}>
                    <Text style={styles.EmotionsButtonText}>Ridiculed</Text>
               </View>
               <View style={styles.EmotionsButton}>
                    <Text style={styles.EmotionsButtonText}>Indignant</Text>
               </View>
               <View style={styles.EmotionsButton}>
                    <Text style={styles.EmotionsButtonText}>Violated</Text>
               </View>
               <View style={styles.EmotionsButton}>
                    <Text style={styles.EmotionsButtonText}>Furious</Text>
               </View>
               <View style={styles.EmotionsButton}>
                    <Text style={styles.EmotionsButtonText}>Provoded</Text>
               </View>
               <View style={styles.EmotionsButton}>
                    <Text style={styles.EmotionsButtonText}>Hostile</Text>
               </View>
               <View style={styles.EmotionsButton}>
                    <Text style={styles.EmotionsButtonText}>Infuriated</Text>
               </View>
               <View style={styles.EmotionsButton}>
                    <Text style={styles.EmotionsButtonText}>Annoyed</Text>
               </View>
               <View style={styles.EmotionsButton}>
                    <Text style={styles.EmotionsButtonText}>Withdrawn</Text>
               </View>
               <View style={styles.EmotionsButton}>
                    <Text style={styles.EmotionsButtonText}>Numb</Text>
               </View>
               <View style={styles.EmotionsButton}>
                    <Text style={styles.EmotionsButtonText}>Skeptical</Text>
               </View>
               <View style={styles.EmotionsButton}>
                    <Text style={styles.EmotionsButtonText}>Dismissive</Text>
               </View>

             </View>

            <PrimaryButton style={styles.startButton}>
              { "SAVE EMOTION"}
            </PrimaryButton>
            
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
               
        
    },
    EmotionsButtonText: {
        fontSize: 20,

    }
    
    
   
   
})