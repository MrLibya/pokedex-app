import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Typography } from '../styles';
import PokemonTypeIcon from './PokemonTypeIcon';

const PokemonType = ({ type: { type } }) => {
    return <View style={[
        styles.container,
        { backgroundColor: Colors.Types[type.name] }
    ]}>
        <PokemonTypeIcon type={type.name}/>
        <View style={{paddingHorizontal:2}} />
        <Text style={Typography.pokemonType}>{`${type.name[0].toUpperCase()}${type.name.slice(1)}`}</Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 3,
        marginRight: 5,
        padding: 5,
        marginTop: 3
    },
});

export default PokemonType;