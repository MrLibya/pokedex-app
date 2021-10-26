import React from 'react';
import { ImageBackground } from 'react-native';
import { Text, View, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { capitalizeFirstLetter, pokemonFullID } from '../services/utils';
import { Colors, Components, Typography } from '../styles';
import PokemonType from './PokemonType';

export const CARD_HEIGHT = 115;

class PokemonCard extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pokemonImage: { uri: this.props.pokemon.sprites.other['official-artwork']?.front_default },
            pokemonName: capitalizeFirstLetter(this.props.pokemon.name)
        }

        this.onImageError = this.onImageError.bind(this);
    }

    onImageError() {
        this.setState({
            pokemonImage: require('../../assets/images/pokeball.png')
        })
    }

    render() {
        const { pokemon } = this.props;

        return <View style={[
            styles.container,
            { backgroundColor: Colors.BackgroundColors[pokemon.types[0].type.name] }
        ]}>
            <View style={styles.pokemonInfoContainer}>
                <Text style={Typography.pokemonID}>#{pokemonFullID(pokemon.id)}</Text>
                <Text style={Typography.pokemonTitle}>{this.state.pokemonName}</Text>
                <View style={styles.pokemonTypesContainer}>
                    {pokemon.types.map((type, i) => <PokemonType key={i} type={type} />)}
                </View>
            </View>
            <Image
                source={require('../../assets/patterns/6x3.png')}
                resizeMode='contain'
                style={styles.patternImage}
                containerStyle={styles.patternContainer}
            />
            <ImageBackground
                source={require('../../assets/patterns/pokeball.png')}
                // resizeMode="contain"
                tintColor='white'
                opacity={0.2}
                style={styles.imageBackground}>
                <View style={styles.imageContainer}>
                    <FastImage
                        style={styles.pokeImage}
                        // resizeMode='contain'
                        source={this.state.pokemonImage}
                        onError={this.onImageError}
                    />
                </View>
            </ImageBackground>
        </View>
    }
}

const styles = StyleSheet.create({
    container: {
        height: CARD_HEIGHT,
        // width:335,
        // ...Components.Shadow,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    patternContainer: {
        position: 'absolute',
        right: '45%',
        top: 5,
        opacity: 0.2
    },
    patternImage: {
        height: 40,
        width: 80,
        tintColor: 'white'
    },
    imageBackground: {
        // width: 120,
        // height: "100%",
        width: 145,
        height: 145,
        // paddingRight: 10
    },
    imageContainer: {
        // marginTop: -20,
        // marginRight: -30,
        // backgroundColor:'red',
        position: 'absolute',
        top: -25
    },
    pokeImage: {
        width: 130,
        height: 130
    },
    pokemonInfoContainer: {
        flex: 1,
        padding: 20
    },
    pokemonTypesContainer: {
        // flex:1,
        // backgroundColor:'red',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    }
});

export default PokemonCard;