import React from 'react';
import { StyleSheet} from 'react-native';
import { Image } from 'react-native-elements';

const iconSource = (type ) => {
    switch (type) {
        case 'bug':
            return require('../../assets/types/Bug.png');
        case 'dark':
            return require('../../assets/types/Dark.png');
        case 'dragon':
            return require('../../assets/types/Dragon.png');
        case 'electric':
            return require('../../assets/types/Electric.png');
        case 'fairy':
            return require('../../assets/types/Fairy.png');
        case 'fighting':
            return require('../../assets/types/Fighting.png');
        case 'fire':
            return require('../../assets/types/Fire.png');
        case 'flying':
            return require('../../assets/types/Flying.png');
        case 'ghost':
            return require('../../assets/types/Ghost.png');
        case 'grass':
            return require('../../assets/types/Grass.png');
        case 'ground':
            return require('../../assets/types/Ground.png');
        case 'ice':
            return require('../../assets/types/Ice.png');
        case 'normal':
            return require('../../assets/types/Normal.png');
        case 'poison':
            return require('../../assets/types/Poison.png');
        case 'psychic':
            return require('../../assets/types/Psychic.png');
        case 'rock':
            return require('../../assets/types/Rock.png');
        case 'steel':
            return require('../../assets/types/Steel.png');
        case 'water':
            return require('../../assets/types/Water.png');

        default:
            return require('../../assets/types/Grass.png');
    }
}

const PokemonTypeIcon = ({type}) => {

    return <Image
        source={iconSource(type)}
        style={styles.pokemonTypeIcon}
        containerStyle={{ paddingHorizontal: 0, alignSelf: 'center' }}
    />
};

const styles = StyleSheet.create({
    pokemonTypeIcon: {
        height: 15,
        width: 15,
        tintColor: 'white'
    }
});

export default PokemonTypeIcon;