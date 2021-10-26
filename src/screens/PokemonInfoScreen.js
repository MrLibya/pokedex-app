import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { fontNormalize, unknownErrorToast } from '../services/common';
import { Colors, Components, Typography } from '../styles';
import FastImage from 'react-native-fast-image';
import PokemonType from '../components/PokemonType';
import { ButtonGroup, Icon, Image } from 'react-native-elements';
import axios from 'axios';
import API from '../services/api';
import { PokemonTypesStats, capitalizeFirstLetter, getPokemonID, pokemonFullID } from '../services/utils';
import PokemonWeaknessesIcon from '../components/PokemonWeaknessesIcon';
import { ImageBackground } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';

const SPACENING = 22;

const PokemonInfoScreen = ({ navigation, route }) => {
    const { pokemon } = route.params;
    const pokemonName = capitalizeFirstLetter(pokemon.name);
    const pokemonType = pokemon.types[0].type;
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState({});
    const [pokemonImage, setPokemonImage] = useState({ uri: pokemon.sprites.other['official-artwork']?.front_default });
    const [selectedTab, setSelectedTab] = useState(0);

    React.useEffect(() => {
        let source = axios.CancelToken.source();
        let unmounted = false;
        const initData = async () => {
            try {
                var pokeData = {};
                let pokeDesc = API.get(`pokemon-species/${pokemon.id}`, { cancelToken: source.token });
                let pokeDmg = API.get(`type/${pokemonType.name}`, { cancelToken: source.token });

                let response = await axios.all([pokeDesc, pokeDmg]);
                if (response[0].status == 200) {
                    const species = response[0].data;
                    pokeData.capture_rate = species.capture_rate;
                    pokeData.base_happiness = species.base_happiness;
                    pokeData.egg_groups = species.egg_groups;
                    if (species.flavor_text_entries.length)
                        pokeData.description = species.flavor_text_entries[0].flavor_text;

                    let pokeEvolution = await axios.get(species.evolution_chain.url, { cancelToken: source.token });
                    if (pokeEvolution.status == 200) {
                        const { chain } = pokeEvolution.data;
                        pokeData.evolutionChain = chain;
                    }

                    let pokeGrowth = await axios.get(species.growth_rate.url, { cancelToken: source.token });
                    if (pokeGrowth == 200) {
                        const { damage_relations: { double_damage_from, half_damage_from, no_damage_from } } = pokeGrowth;
                        let dmg = {};
                        double_damage_from.map((from) => {
                            dmg[from.name] = '2';
                        });
                        half_damage_from.map((from) => {
                            dmg[from.name] = '½';
                        });
                        pokeData.damage_from = dmg;
                    }
                }

                if (response[1].status == 200) {
                    const { name } = response[1].data;
                    pokeData.growthRate = name;
                }

                setData(pokeData);

            } catch (error) {
                console.log(error.response)
                if (!axios.isCancel(error)) {
                    unknownErrorToast();
                    // navigation.pop();
                }
            } finally {
                if (!unmounted) {
                    setLoading(false);
                }
            }
        }

        initData();

        return () => {
            unmounted = true;
            source.cancel();
        };
    }, [])

    const onImageError = () => {
        setPokemonImage(require('../../assets/images/pokeball.png'));
    }

    const aboutTab = () => (<View style={styles.tabsContainer}>
        {selectedTab == 0 &&
            <Image
                source={require('../../assets/patterns/pokeball.png')}
                // resizeMode="contain"
                tintColor='white'
                opacity={0.2}
                style={styles.tabsBackgroundImage}
                containerStyle={styles.tabsBackgroundImageContainer}
            />
        }
        <Text style={[
            styles.tabsText,
            selectedTab == 0 && { color: '#fff' }
        ]}>About</Text>

    </View>)

    const statsTab = () => (<View style={styles.tabsContainer}>
        {selectedTab == 1 &&
            <Image
                source={require('../../assets/patterns/pokeball.png')}
                // resizeMode="contain"
                tintColor='white'
                opacity={0.2}
                style={styles.tabsBackgroundImage}
                containerStyle={styles.tabsBackgroundImageContainer}
            />
        }
        <Text style={[
            styles.tabsText,
            selectedTab == 1 && { color: '#fff' }
        ]}>Stats</Text>

    </View>)

    const evolutionTab = () => (<View style={styles.tabsContainer}>
        {selectedTab == 2 &&
            <Image
                source={require('../../assets/patterns/pokeball.png')}
                // resizeMode="contain"
                tintColor='white'
                opacity={0.2}
                style={styles.tabsBackgroundImage}
                containerStyle={styles.tabsBackgroundImageContainer}
            />
        }
        <Text style={[
            styles.tabsText,
            selectedTab == 2 && { color: '#fff' }
        ]}>Evolution</Text>

    </View>)

    const _renderAboutView = () => {
        return (
            <View>
                <Text style={Typography.pokemonDescription}>{data.description}</Text>
                <View style={{ marginTop: 30 }} />
                <Text style={[
                    styles.infoTitle,
                    { color: Colors.Types[pokemonType.name] }
                ]}
                >Pokédex Data</Text>
                <View style={{ marginTop: SPACENING }}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoRowTitle}>Species</Text>
                        <Text style={styles.infoRowSubTitle}>{pokemon.species.name}</Text>

                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoRowTitle}>Height</Text>
                        <Text style={styles.infoRowSubTitle}>{pokemon.height}m</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoRowTitle}>Weight</Text>
                        <Text style={styles.infoRowSubTitle}>{pokemon.weight}kg</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoRowTitle}>Abilities</Text>
                        <View style={{ flex: 3 }}>
                            {pokemon.abilities.map((ability, i) => (
                                <Text key={i} style={styles.infoRowSubTitle}>
                                    {ability.slot}. {ability.ability.name} {ability.is_hidden && '(hidden ability)'}
                                </Text>
                            ))}

                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoRowTitle}>Weaknesses</Text>
                        <View style={styles.weaknessesView}>
                            {PokemonTypesStats[pokemonType.name].weaknesses.map((weakType, i) => (
                                <PokemonWeaknessesIcon key={i} type={weakType} />
                            ))

                            }
                        </View>
                    </View>
                </View>

                <Text style={[
                    styles.infoTitle,
                    { color: Colors.Types[pokemonType.name] }
                ]}
                >Training</Text>
                <View style={{ marginTop: SPACENING }}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoRowTitle}>EV Yield</Text>
                        <Text style={styles.infoRowSubTitle}>1 Special Attack</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoRowTitle}>Catch Rate</Text>
                        <Text style={styles.infoRowSubTitle}>{data.capture_rate}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoRowTitle}>Base Friendship</Text>
                        <Text style={styles.infoRowSubTitle}>{data.base_happiness}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoRowTitle}>Base Exp</Text>
                        <Text style={styles.infoRowSubTitle}>{pokemon.base_experience}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoRowTitle}>Growth Rate</Text>
                        <Text style={styles.infoRowSubTitle}>{data.growthRate}</Text>
                    </View>
                </View>

                <Text style={[
                    styles.infoTitle,
                    { color: Colors.Types[pokemonType.name] }
                ]}
                >Breeding</Text>
                <View style={{ marginTop: SPACENING }}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoRowTitle}>Gender</Text>
                        <Text style={styles.infoRowSubTitle}>♀ 87.5%, ♂ 12.5%</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoRowTitle}>Egg Groups</Text>
                        <Text style={styles.infoRowSubTitle}>
                            {data?.egg_groups?.map((egg, i) => <Text key={i}>{capitalizeFirstLetter(egg.name)}{data.egg_groups.length != i + 1 && ', '}</Text>)

                            }
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoRowTitle}>Egg Cycles</Text>
                        <Text style={styles.infoRowSubTitle}>{data.base_happiness}</Text>
                    </View>
                </View>
            </View>
        )
    }

    const _renderStatsView = () => {
        return (
            <View>
                <Text style={[
                    styles.infoTitle,
                    { color: Colors.Types[pokemonType.name] }
                ]}
                >Base Stats</Text>
                <View style={{ marginTop: SPACENING }} />
                {pokemon.stats.map((stat, i) => <View key={i} style={styles.infoRow}>
                    <Text style={[styles.infoRowTitle, { flex: 2 }]}>{capitalizeFirstLetter(stat.stat.name)}</Text>
                    <Text style={[styles.infoRowSubTitle, { flex: 1, marginStart: 5 }]}>{stat.base_stat}</Text>
                    <View style={[
                        styles.statsLineView,
                        { backgroundColor: Colors.Types[pokemonType.name] }
                    ]} />
                </View>)
                }
                <View style={{ marginTop: 12 }} />
                <Text style={Typography.pokemonDescription}>The ranges shown on the right are for a level 100 Pokémon. Maximum values are based on a beneficial nature, 252 EVs, 31 IVs; minimum values are based on a hindering nature, 0 EVs, 0 IVs.</Text>

                <View style={{ marginTop: SPACENING }} />
                <Text style={[
                    styles.infoTitle,
                    { color: Colors.Types[pokemonType.name] }
                ]}
                >Type Defenses</Text>
                <View style={{ marginTop: 5 }} />
                <Text style={Typography.pokemonDescription}>The effectiveness of each type on {pokemonName}</Text>
                {console.log(data?.damage_from)}
                <View style={styles.typeDefensesView}>
                    {Object.keys(PokemonTypesStats).slice(0, 9).map((type, i) => <View key={i}
                        style={{ marginRight: 13 }}>
                        <PokemonWeaknessesIcon type={type} containerStyle={{ marginRight: 0 }} />
                        <Text style={[Typography.pokemonDescription, { textAlign: 'center' }]}>{data?.damage_from?.[type] || ''}</Text>
                    </View>)

                    }
                </View>

                <View style={styles.typeDefensesView}>
                    {Object.keys(PokemonTypesStats).slice(9).map((type, i) => <View key={i}
                        style={{ marginRight: 13 }}>
                        <PokemonWeaknessesIcon type={type} containerStyle={{ marginRight: 0 }} />
                        <Text style={[Typography.pokemonDescription, { textAlign: 'center' }]}>{data?.damage_from?.[type] || ''}</Text>
                    </View>)

                    }
                </View>
            </View>
        )
    }

    const _renderEvolutionView = () => {
        return (
            <View>
                <Text style={[
                    styles.infoTitle,
                    { color: Colors.Types[pokemonType.name] }
                ]}
                >Evolution Chart</Text>
                <View style={{ marginTop: SPACENING }} />
                {deepEvolutionChainRender(data?.evolutionChain)}
            </View>
        )
    }

    // This Recursion function beacus of poke api return evolution chain in form of nodes
    const deepEvolutionChainRender = (evolutionChain) => {
        if (!evolutionChain?.evolves_to || !evolutionChain.evolves_to?.length)
            return null;

        const { evolves_to } = evolutionChain;
        const evolvesFromID = getPokemonID(evolutionChain.species.url);
        const evolvesToID = getPokemonID(evolves_to[0].species.url);
        const evolvesFromName = capitalizeFirstLetter(evolutionChain.species.name);
        const evolvesToName = capitalizeFirstLetter(evolves_to[0].species.name);
        // i should make it load from the api, but this is stander for all pokemon so why not xd
        const evolvesFromImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolvesFromID}.png`;
        const evolvesToImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolvesToID}.png`;
        return <View>
            <View style={styles.evolveRow}>
                <View>
                    <ImageBackground
                        source={require('../../assets/patterns/pokeball.png')}
                        // resizeMode="contain"
                        tintColor='#F5F5F5'
                        // opacity={0.1}
                        style={styles.evolutionImageBackground}>
                        <FastImage
                            style={styles.evolutionPokeImage}
                            // resizeMode='contain'
                            source={{ uri: evolvesFromImage }}
                            onError={onImageError}
                        />
                    </ImageBackground>
                    <Text style={Typography.pokemonEvolveID}>#{pokemonFullID(evolvesFromID)}</Text>
                    <Text style={Typography.pokemonEvolveITitle}>{evolvesFromName}</Text>
                </View>
                <View>
                    <Icon name='arrowright' type='antdesign' tintColor='#F5F5F5' />
                    <Text style={Typography.pokemonID}>(Level {evolves_to[0].evolution_details[0].min_level})</Text>
                </View>
                <View>
                    <ImageBackground
                        source={require('../../assets/patterns/pokeball.png')}
                        // resizeMode="contain"
                        tintColor='#F5F5F5'
                        // opacity={0.1}
                        style={styles.evolutionImageBackground}>
                        <FastImage
                            style={styles.evolutionPokeImage}
                            // resizeMode='contain'
                            source={{ uri: evolvesToImage }}
                            onError={onImageError}
                        />
                    </ImageBackground>
                    <Text style={Typography.pokemonEvolveID}>#{pokemonFullID(evolvesToID)}</Text>
                    <Text style={Typography.pokemonEvolveITitle}>{evolvesToName}</Text>
                </View>
            </View>
            {deepEvolutionChainRender(evolves_to[0])}
        </View>
    }

    return <View style={styles.container}>

        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
                // styles.container,
                { backgroundColor: Colors.BackgroundColors[pokemonType.name] }
            ]}>
            <HeaderBackButton
                onPress={navigation.goBack}
                labelVisible={false}
                tintColor='white'
                style={{ position: 'absolute' }}
            />

            <Text numberOfLines={1} ellipsizeMode='clip' style={styles.bgTitleText}>{pokemon.name.toUpperCase()}</Text>

            <View style={styles.pokemonContainer}>
                <View style={styles.circle} >
                    <FastImage
                        style={styles.pokeImage}
                        // resizeMode='contain'
                        source={pokemonImage}
                        onError={onImageError}
                    />
                </View>
                <View style={styles.pokemonInfoContainer}>
                    <Text style={Typography.pokemonID}>#{pokemonFullID(pokemon.id)}</Text>
                    <Text style={Typography.pokemonTitle}>{pokemonName}</Text>
                    <View style={styles.pokemonTypesContainer}>
                        {pokemon.types.map((type, i) => <PokemonType key={i} type={type} />)}
                    </View>
                </View>
                <Image
                    source={require('../../assets/patterns/10x5.png')}
                    // resizeMode='contain'
                    style={styles.patternImage}
                    containerStyle={styles.patternContainer}
                />
            </View>

            <ButtonGroup
                // buttons={['حول','احصائيات','تطويرات']}
                buttons={[{ element: aboutTab }, { element: statsTab }, { element: evolutionTab }]}
                Component={TouchableOpacity}
                selectedIndex={selectedTab}
                onPress={setSelectedTab}
                // textStyle={{color:'white'}}
                selectedButtonStyle={{ backgroundColor: 'transparent' }}
                innerBorderStyle={{ color: 'transparent' }}
                containerStyle={[styles.btnGroupContainer, { backgroundColor: 'transparent' }
                ]}
            />

            <View style={styles.dataContainer}>
                {selectedTab == 0 ?
                    _renderAboutView()
                    : selectedTab == 1 ?
                        _renderStatsView()
                        :
                        _renderEvolutionView()
                }
            </View>
        </ScrollView>
        <ActivityIndicator size={50} animating={loading} style={Components.ActivityIndicator} color={Colors.Loading} />

    </View>
}


// border-image-source: linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 76.04%);



const styles = StyleSheet.create({
    container: {
        flex: 1,
        // padding: 15
    },
    linearGradient: {
        backgroundColor: 'transparent'
        // flex: 1,
        // paddingLeft: 15,
        // paddingRight: 15,
        // borderRadius: 5
    },
    bgTitleText: {
        position: 'absolute',
        top: 25,
        width: 400,
        ...Typography.pokemonTitle,
        fontSize: fontNormalize(80),
        lineHeight: 119,
        letterSpacing: 15,
        fontWeight: '700',
        textAlign: 'center',
        alignSelf: 'center',
        opacity: 0.1,
    },
    pokemonContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        marginStart: 40,
        marginTop: 105
    },
    pokemonInfoContainer: {
        marginStart: 20,
        alignSelf: 'center'
    },
    circle: {
        width: 125,
        height: 125,
        borderRadius: 125 / 2,
        borderWidth: 5,
        // borderColor: '#fff',
        // opacity: 0.2,
        borderColor: '#FFFFFF30',
        borderTopColor: '#FFFFFF00',
        borderRightColor: '#FFFFFF00',
        borderStartColor: '#FFFFFF00',
        // borderBottomColor:'#FFFFFF00',
        // bordercolo
    },
    pokeImage: {
        width: 125,
        height: 125,
        marginLeft: -5
    },
    pokemonTypesContainer: {
        // flex:1,
        // backgroundColor:'red',
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    patternImage: {
        flex: 1,
        width: 140,
        height: 65,
        resizeMode: 'contain',
        tintColor: 'white'
    },
    patternContainer: {
        // backgroundColor:'red',
        position: 'absolute',
        // left: '45%',
        top: 75,
        right: '-20%',
        opacity: 0.2
    },
    btnGroupContainer: {
        marginTop: 30,
        borderWidth: 0
    },
    tabsContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabsText: {
        fontFamily: 'Sf-Pro-Display-Medium',
        fontSize: fontNormalize(12)
    },
    tabsBackgroundImage: {
        width: 50,
        height: 50
    },
    tabsBackgroundImageContainer: {
        // backgroundColor:'red',
        position: 'absolute',
        top: 10
        // right:'-10%',
    },
    dataContainer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 40
    },
    infoTitle: {
        fontFamily: 'Sf-Pro-Display-Bold',
        fontSize: fontNormalize(15)
    },
    infoRow: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        // justifyContent: 'space-between',
        marginBottom: 10,
    },
    infoRowTitle: {
        flex: 2,
        // backgroundColor:'red',
        fontFamily: 'Sf-Pro-Display-Bold',
        fontSize: fontNormalize(12),
        color: '#17171B'
    },
    infoRowSubTitle: {
        flex: 3,
        // backgroundColor:'green',
        fontFamily: 'Sf-Pro-Display-Regular',
        fontSize: fontNormalize(14),
        color: '#747476',
        // alignSelf:'flex-start'
        // textAlign: 'left'
    },
    weaknessesView: {
        flex: 3,
        flexDirection: 'row',
        // justifyContent: 'space-between'
    },
    statsLineView: {
        flex: 3,
        width: 30,
        height: 4,
        alignSelf: 'center'
    },
    typeDefensesView: {
        flexDirection: 'row',
        marginTop: 20
    },
    evolveRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30
    },
    evolutionImageBackground: {
        width: 100,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5
    },
    evolutionPokeImage: {
        width: 75,
        height: 75,
    }
});

export default PokemonInfoScreen;