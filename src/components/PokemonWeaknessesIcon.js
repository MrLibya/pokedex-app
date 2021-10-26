import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors} from '../styles';
import PokemonTypeIcon from './PokemonTypeIcon';

const PokemonWeaknessesIcon = ({ type,containerStyle }) => {
    return <View style={[
        styles.container,
        { backgroundColor: Colors.Types[type] },
        containerStyle && containerStyle
    ]}>
        <PokemonTypeIcon type={type}/>
    </View>
}

const styles = StyleSheet.create({
    container: {
        width:25,
        height:25,
        alignItems:'center',
        justifyContent:'center',
        borderRadius: 3,
        marginRight: 5,
        padding: 5,
    },
});

export default PokemonWeaknessesIcon;