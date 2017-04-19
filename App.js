import React from 'react';
import { StyleSheet, Text, View, Button, ListView  } from 'react-native';
import { StackNavigator } from 'react-navigation';


export default class App extends React.Component {
    render() {
        return (
            <Routes />
        );
    }
}

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome',
    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View>
                <Text>Welcome Home!</Text>
                <Button
                    onPress={() => navigate('Articles', { articles: [1, 2, 3] })}
                    title="Articles"
                />
            </View>
        );
    }
}

class ArticlesScreen extends React.Component {
    static navigationOptions = {
        title: 'Articles',
    };

    constructor(props) {
        super(props)
        this.state = {
            hasFetched: false,
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        };
    }
    componentDidMount(){
        makeFetch('https://jsonplaceholder.typicode.com/posts').then((data) => {
            this.setState(()=> {
                return {
                    hasFetched: true,
                    dataSource: this.state.dataSource.cloneWithRows(data)
                };
            })
        })
    }
    render() {
        const { hasFetched, dataSource } = this.state;
        return (
            <View>
                {hasFetched ?
                    <ListView
                        dataSource={dataSource}
                        renderRow={(rowData) => <Text style={listStyles.text}>{rowData.title}</Text>} // heyo!
                        renderSeparator={(sectionId, rowId) => <View key={rowId} style={listStyles.separator} />} // heyo!
                    />
                    : <Loader />
                }
            </View>
        );
    }
}

class Loader extends React.Component {
    render(){
        return (<Text>Loading...</Text>);
    }
}

const Routes = StackNavigator({
    Home: { screen: HomeScreen },
    Articles: { screen: ArticlesScreen },
});

const checkStatus = (response) => {
    if (!response.ok) { // status in the range 200-299 or not
        return Promise.reject(new Error(response.statusText || 'Status not OK'))
    }
    return response
}

const parseJSON = (response) => response.json()

const makeFetch = (url, options) => fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)

const listStyles = StyleSheet.create({
    text: {
        marginLeft: 12,
        fontSize: 16,
        padding: 20
    },
    separator: {
        flex: 1,
        height: StyleSheet.hairlineWidth,
        backgroundColor: '#8E8E8E',
    },
});
