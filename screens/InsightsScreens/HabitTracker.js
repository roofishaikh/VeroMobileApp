import { Text, View, StyleSheet, Dimensions, Image, FlatList, ScrollView } from "react-native";
import PrimaryButton from "../../components/primaryButton";
import React from "react";
import OutterContainer from "../../components/OutterContainer";



function HabitTracker() {

    const topRow = [
        { key: '1', title: 'Habit' },
        { key: '2', title: 'Mo' },
        { key: '3', title: 'TU' },
        { key: '4', title: 'WE' },
        { key: '5', title: 'TH' },
        { key: '6', title: 'FR' },
        { key: '7', title: 'SA' },
        { key: '8', title: 'SU' },
        { key: '9', title: 'TOTAL' },
        { key: '10', title: 'Morning Ritual' },
        { key: '11', title: 'CKBX' },
        { key: '12', title: 'CKBX' },
        { key: '13', title: 'CKBX' },
        { key: '14', title: 'CKBX' },
        { key: '15', title: 'CKBX' },
        { key: '16', title: 'CKBX' },
        { key: '17', title: 'CKBX' },
        { key: '18', title: 'CKBX' },
        { key: '19', title: 'Check Ins' },
        { key: '20', title: 'CKBX' },
        { key: '21', title: 'CKBX' },
        { key: '22', title: 'CKBX' },
        { key: '23', title: 'CKBX' },
        { key: '24', title: 'CKBX' },
        { key: '25', title: 'CKBX' },
        { key: '26', title: 'CKBX' },
        { key: '27', title: 'CKBX' },
        { key: '28', title: 'Evening Reflection' },
        { key: '29', title: 'CKBX' },
        { key: '30', title: 'CKBX' },
        { key: '31', title: 'CKBX' },
        { key: '32', title: 'CKBX' },
        { key: '33', title: 'CKBX' },
        { key: '34', title: 'CKBX' },
        { key: '35', title: 'CKBX' },
        { key: '36', title: 'CKBX' },
        { key: '37', title: 'Goal 1' },
        { key: '38', title: 'CKBX' },
        { key: '39', title: 'CKBX' },
        { key: '40', title: 'CKBX' },
        { key: '41', title: 'CKBX' },
        { key: '42', title: 'CKBX' },
        { key: '43', title: 'CKBX' },
        { key: '44', title: 'CKBX' },
        { key: '46', title: 'CKBX' },
        { key: '47', title: 'Goal 1' },
        { key: '48', title: 'CKBX' },
        { key: '49', title: 'CKBX' },
        { key: '50', title: 'CKBX' },
        { key: '51', title: 'CKBX' },
        { key: '52', title: 'CKBX' },
        { key: '53', title: 'CKBX' },
        { key: '54', title: 'CKBX' },
        { key: '56', title: 'CKBX' },

    ];
    

    const renderItem = ({ item }) => (
        <View style={styles.scrollBox}>
            <Text style={{ textAlign: "center" }}>{item.title}</Text>
        </View>
    );




    return (
        <View style={styles.outterContainer}>

            <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                    Habit Tracker
                </Text>

                <Text style={styles.titleCaption}>
                    Track your core rituals and goals
                </Text>
            </View>

            <View style={styles.OptionsCard}>
                
                <View style={styles.headingRow}>
                    <ScrollView horizontal={true}>
                    <FlatList
                        data={topRow}
                        renderItem={renderItem}
                        numColumns={9}
                    />
                </ScrollView>
        <Text>Tap any cell to edit. Goals track Deep Work Sessions</Text>
                </View>
            </View>

        </View>


    );
}

export default HabitTracker


const styles = StyleSheet.create({

    outterContainer: {
        flex: 1,
        padding: Dimensions.get("window").width < 390 ? 10 : 20,
        marginTop: 60,
        marginBottom: 140,
        width: Dimensions.get("window").width < 390 ? 350 : 400,
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
    titleCaption: {
        // fontWeight: "bold",
        fontSize: 15,
        flexDirection: "row",
        flexWrap: "wrap",
        textAlign: "center"
    },
    OptionsCard: {

        // borderColor: '#000000',
        // borderWidth: 3,
        width: '100%',
        height: Dimensions.get("window").height < 880 ? 410 : 580,
        position: "absolute",
        bottom: 50,
        padding: 10,
    },
    headingRow:{
        width: '100%',
        height: '90%',
        // borderWidth:1,
        // borderColor: '#000000',
        alignSelf:"center",
        position: "absolute",
        top: 20,
        
    },
    scrollBox: { 
        padding: 3,
        borderWidth: 1,
        margin: 3,
        width: 60,
        marginTop:9,
    
    }

})



