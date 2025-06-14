import { View, StyleSheet, Text } from "react-native";
import React from 'react';


export default function QuestionComponent({children}) {

    return(
        <View style={styles.outterContainer}>
          {React.Children.map(children, (child, index) => (
        <View style={[styles.childWrapper, index === 0 && { marginTop: 0 }]}>
         <Text style={styles.textProps}>{child}</Text> 
        </View>
      ))}
        </View>
    ) ;
}


const styles = StyleSheet.create({

    outterContainer: {

        borderWidth: 1,
        borderColor: '#000000',
        alignSelf: "flex-start",
        fontSize: 24,
        width: '100%' ,
         
        flexDirection: "column",
        flexWrap: "wrap",
        marginTop: 10,
        marginBottom: 10,
        
    } ,

    textProps: {

       
        padding: 0,
        fontWeight: 'semibold',
        fontSize: 22,
        color: '#aa0a9d'
    },
     childWrapper: {
    margin: 10,
  },

})