import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import MainStackNavigator from './src/navigation/MainStackNavigator';
import Toast, { SuccessToast, ErrorToast, InfoToast } from 'react-native-toast-message';
import { Typography } from './src/styles';

const toastConfig = {
    success: ({ hide, ...rest }) => (
        <SuccessToast
            {...rest} onTrailingIconPress={hide}
            text1Style={Typography.toastText1}
            text2Style={Typography.toastText2}
        />
    ),
    error: ({ hide, ...rest }) => (
        <ErrorToast
            {...rest} onTrailingIconPress={hide}
            text1Style={Typography.toastText1}
            text2Style={Typography.toastText2}
        />
    ),
    info: ({ hide, ...rest }) => (
        <InfoToast
            {...rest} onTrailingIconPress={hide}
            text1Style={Typography.toastText1}
            text2Style={Typography.toastText2}
        />
    ),

}

export default class App extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {

	}

	render() {
		return (
			<NavigationContainer  >
				<MainStackNavigator />
				<Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
			</NavigationContainer>
		);
	}
};