import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Colors, Components, Typography } from '../styles';
import { unknownErrorToast } from '../services/common';
import API from '../services/api';
import { getPokemonID } from '../services/utils';
import PokemonCard, { CARD_HEIGHT } from '../components/PokemonCard';
import { SearchBar } from 'react-native-elements';

function HomeScreen({ route, navigation }) {
	const [loading, setLoading] = useState(false);
	// const [onEndReachedMomentum, setOnEndReachedMomentum] = useState(true);
	const [refresh, setRefresh] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [data, setData] = useState([]);
	// its better to make the search result in new screen for better memory mangment, but this for testing
	const [filterData, setFilterData] = useState([]);
	const [page, setPage] = useState(0);

	// async function will render on every set state value, so for less render we update outside
	const updateData = (fetechedData) => {
		var collectedData = [...(page ? data : [])];
		var nData = collectedData.concat(fetechedData);
		setData(nData);
		setFilterData(nData);
	}

	const loadData = async () => {
		if (loading)
			return;
		try {
			setLoading(true);
			// let loadPage = _page ?? page;
			// console.log(page)
			const response = await API.get('pokemon', {
				params: {
					offset: page * 20,
					limit: 20
				}
			});
			if (response.status == 200) {
				const { results } = response.data;
				// var collectedData = [...(page ? data : [])];
				const fetechedData = await Promise.all(results.map(async pokemon => {
					let id = getPokemonID(pokemon.url)
					const res = await API.get(`pokemon/${id}`);
					if (res.status == 200) {
						return res.data;
						// collectedData.push(res.data);
					}
				}));
				// await Promise.all(requests);
				updateData(fetechedData);
				// setData(collectedData.concat(fetechedData));

				// return Promise.all(requests).then(() => {
				// 	setData(collectedData);
				// });

			}
		} catch (error) {
			unknownErrorToast(error?.message);

		} finally {
			setLoading(false);
		}
	}

	const searchPokemon = async () => {
		if (loading)
			return;
		try {
			setLoading(true);
			let res = await API.get(`pokemon/${searchText}`)
			if (res.status == 200) {
				navigation.navigate('PokemonInfo', { pokemon: res.data })
			}
		} catch (error) {
			if (error?.response?.status == 404)
				unknownErrorToast('Wrong pokemon name or number !');
			else
				unknownErrorToast(error?.message);
		} finally {
			setLoading(false);

		}
	}

	const _onRefresh = async () => {
		setRefresh(true);
		setPage(0);
		setRefresh(false);
	}

	const _onEndReached = ({ distanceFromEnd }) => {
		// console.log("_onEndReached cur page: ", page, "distanceFromEnd: ", distanceFromEnd);
		if (distanceFromEnd < 0 || searchText.length)
			return;

		setPage(page + 1);

		// if (!onEndReachedMomentum) {
		// 	console.log("onEndReachedMomentum: ", page);
		// 	setPage(page + 1);
		// 	setOnEndReachedMomentum(true)
		// }
	}

	React.useEffect(() => {
		loadData();
	}, [page]);

	const onSearchChange = (text) => {
		setSearchText(text);
		if (!text.length)
			return setFilterData(data);
		const lower = text.toLowerCase();
		const number = !isNaN(lower);

		setFilterData(data.filter((poke) => number ? poke.id == lower : poke.name.startsWith(lower)))
	}

	const _renderItem = ({ item }) => (
		<TouchableOpacity
			style={[Components.Shadow, { borderRadius: 10 }]}
			onPress={() => navigation.navigate('PokemonInfo', { pokemon: item })}>
			<PokemonCard pokemon={item} />
		</TouchableOpacity>
	)

	// for some reasone the input on header will break if it was function, so i must use it and react element
	const _renderHeader = <View style={styles.headerContentContainer}>
		{/* <ImageBackground
					resizeMode="contain"
					style={{ width: '100%', height: SCREEN_HEIGHT / 4, }}
					tintColor='white'
					// opacity={0.2}

					source={require('../../assets/patterns/pokeball.png')}
				>
					<Text>hi</Text>
					here will add the filters icons in future
				</ImageBackground> */}

		<View style={styles.headerContentContainer}>
			<Text style={Typography.textTitle}>Pokedex</Text>
			<Text style={Typography.textSubTitle}>
				Search for Pokémon by name or using the National Pokédex number.
        			</Text>
			<View style={{ marginBottom: 25 }} />
			<SearchBar
				lightTheme
				placeholder='What Pokémon are you looking for?'
				value={searchText}
				onChangeText={onSearchChange}
				onSubmitEditing={searchPokemon}
				inputStyle={Typography.inputStyle}
				containerStyle={styles.searchBarContainer}
				inputContainerStyle={styles.searchBarInput}
			/>

		</View>
	</View>

	return (
		<View style={styles.container}>
			<FlatList
				data={filterData} // use data for no filter
				renderItem={_renderItem}
				// keyExtractor={(item, index) => index.toString()}
				keyExtractor={item => item.id.toString()}
				refreshing={refresh}
				onRefresh={_onRefresh}
				onEndReached={_onEndReached}
				onEndReachedThreshold={0.5}
				// onMomentumScrollBegin={() => setOnEndReachedMomentum(false)}
				getItemLayout={(data, index) => (
					{ length: CARD_HEIGHT, offset: (CARD_HEIGHT + 25) * index, index }
				)}
				showsVerticalScrollIndicator={false}
				style={styles.flatlistStyle}
				contentContainerStyle={styles.contentContainer}
				ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
				ListHeaderComponent={_renderHeader}
				ListFooterComponent={<ActivityIndicator size={50} animating={loading} color={Colors.Loading} />}
				ListEmptyComponent={!loading && <Text style={Typography.emptyData}>Theres no pokemon to show now !</Text>}
			/>

		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#FFFFFF'
		//padding: 15
	},
	flatlistStyle: {
		padding: 15,
		paddingHorizontal: 25,
		// paddingTop: 0
	},
	contentContainer: {
		paddingBottom: 15
		// justifyContent: 'center',
		// alignItems: 'center'
	},
	headerContentContainer: {
		marginBottom: 25
	},
	searchBarContainer: {
		// marginBottom:25
		backgroundColor: '#FFFFFF',
		borderTopWidth: 0,
		borderBottomWidth: 0,
	},
	searchBarInput: {
		backgroundColor: '#F2F2F2',
		borderRadius: 10,
		borderTopWidth: 0,
		borderBottomWidth: 0,
	}
});

export default HomeScreen;