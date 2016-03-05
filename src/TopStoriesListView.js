import React, {
  Component,
  AppState,
  Linking,
  StyleSheet,
  Text,
  View,
  ListView,
  RefreshControl,
  TouchableHighlight,
  Platform,
} from 'react-native';
import SafariView from 'react-native-safari-view';

const RELOAD_THRESHOLD = 1000 * 60 * 10; // 10min

class TopStoriesListView extends Component {

  constructor() {
    super();

    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows([]),
      lastLoad: 0,
      isLoading: false,
    };

    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentWillMount() {
    this.loadStories();
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }
  
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(currentAppState) {
    if (currentAppState == 'active' && 
      Date.now() >= this.state.lastLoad + RELOAD_THRESHOLD) {
      this.loadStories();
    }
  }

  openURL(url) {
    if (Platform.OS == 'ios') {
      SafariView.show({
        url: url,
      });
    } else {
      Linking.openURL(url);
    }
  }

  handlePressRow(rowData) {
    let url = rowData.url;
    if (url == null || !url.match(/^https?:\/\//)) {
      url = `https://news.ycombinator.com/item?id=${rowData.id}`;
    }
    this.openURL(url);
  }

  handlePressRowTitle(rowData) {
    this.openURL(`https://news.ycombinator.com/item?id=${rowData.id}`);
  }

  loadStories() {
    this.setState({ isLoading: true });
    fetch('http://node-hnapi-eus.azurewebsites.net/news')
      .then(res => res.json())
      .then(stories => {
        this.setState({
          lastLoad: Date.now(),
          dataSource: this.state.dataSource.cloneWithRows(stories),
          isLoading: false,
        });
      }, () => {
        this.setState({ isLoading: false });
      });
  }


  renderRow(rowData, sectionID, rowID) {
    return <TouchableHighlight onPress={this.handlePressRow.bind(this, rowData)} underlayColor='#ddd'>
      <View style={styles.row}>
        <View style={styles.rowNumber}>
          <Text style={styles.rowNumberText}>{parseInt(rowID) + 1}</Text>
        </View>
        <View style={styles.rowStory}>
          <Text style={styles.rowStoryTitle}>{rowData.title}</Text>
          <Text style={styles.rowStoryDomain}>{rowData.domain}</Text>
          <Text style={styles.rowStoryMeta}>{rowData.points + ' points by ' + rowData.user}</Text>
          <Text style={styles.rowStoryMeta} onPress={this.handlePressRowTitle.bind(this, rowData)}>
            {rowData.time_ago + ' · ' + rowData.comments_count + ' comments'}
          </Text>
        </View>
      </View>
    </TouchableHighlight>;
  }

  render() {
    return <ListView
      dataSource={this.state.dataSource}
      renderRow={this.renderRow.bind(this)}
      style={styles.container}
      initialListSize={10}
      refreshControl={
        <RefreshControl
          refreshing={this.state.isLoading}
          onRefresh={this.loadStories.bind(this)}
          enabled={true}
        />
      }
    />;
  }
}


const styles = StyleSheet.create({
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
    color: '#8e8e93',
  },
});

export default TopStoriesListView;
