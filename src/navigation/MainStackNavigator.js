import React from 'react';
import { StyleSheet } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Typography } from '../styles';
import HomeScreen from '../screens/HomeScreen';
import PokemonInfoScreen from '../screens/PokemonInfoScreen';

const MainStackNavigator = () => {
    const MainStack = createNativeStackNavigator();
    return (
        <MainStack.Navigator
            screenOptions={{
                //headerTintColor: Colors.Secondary,
                // cardStyle: { backgroundColor: '#FFFFFF' },
                // headerTintColor: 'white',
                headerTitleAlign: 'center',
                headerTitleStyle: Typography.screenTitle,
                
            }}
        >
            <MainStack.Screen name="Home" component={HomeScreen}
                options={{
                    headerShown:false,
                }}
            />

            <MainStack.Screen name="PokemonInfo" component={PokemonInfoScreen}
                options={{
                    headerShown:false
                }}
            />
        </MainStack.Navigator>
    )

}


const styles = StyleSheet.create({

});

export default MainStackNavigator;