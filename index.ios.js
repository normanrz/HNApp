'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  NavigatorIOS,
} = React;
var SafariView = require('react-native-safari-view');
var RefreshableListView = require('react-native-refreshable-listview')


var HNApp = React.createClass({
  render() {
    return (
      <NavigatorIOS
        ref='nav'
        style={styles.container}
        translucent={true}
        initialRoute={{
          component: TopStoriesListView,
          title: 'Top Stories',
          passProps: {},
        }}
      />
    );
  }
});


var TopStoriesListView = React.createClass({

  getInitialState() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    return {
      dataSource: ds.cloneWithRows([]),
    };
  },

  loadStories() {
    fetch('http://node-hnapi-eus.azurewebsites.net/news')
      .then(function (res) {
        return res.json();
      })
      .then((stories) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(stories),
        });
      });
  },

  componentWillMount() {
    this.loadStories();
  },

  render() {
    return (
      <RefreshableListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
        style={styles.container}
        loadData={this.loadStories}
      />
    );
  },

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableHighlight onPress={() => this.onPressRow(rowData)} underlayColor='#ddd'>
        <View style={styles.row}>
          <View style={styles.rowNumber}>
            <Text style={styles.rowNumberText}>{parseInt(rowID) + 1}</Text>
          </View>
          <View style={styles.rowStory}>
            <Text style={styles.rowStoryTitle}>{rowData.title}</Text>
            <Text style={styles.rowStoryDomain}>{rowData.domain}</Text>
            <Text style={styles.rowStoryMeta}>{rowData.points + ' points by ' + rowData.user}</Text>
            <Text style={styles.rowStoryMeta}>{rowData.time_ago + ' · ' + rowData.comments_count + ' comments'}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  },

  onPressRow(rowData) {
    SafariView.show({
      url: rowData.url
    });
  },
});


var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
    paddingLeft: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c8c7cc',
  },
  rowNumber: {
    width: 22,
  },
  rowNumberText: {
    color: '#8e8e93',
  },
  rowStory: {
    flex: 1,
  },
  rowStoryTitle: {
    fontSize: 17,
  },
  rowStoryDomain: {
    color: '#003d80',
  },
  rowStoryMeta: {
    color: '#8e8e93'
  },
});


AppRegistry.registerComponent('HNApp', () => HNApp);
