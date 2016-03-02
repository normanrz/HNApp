import React, {
  Navigator,
} from 'react-native';
import TopStoriesListView from './TopStoriesListView';
import ExNavigator from '@exponent/react-native-navigator';

const HNApp = () =>
  <ExNavigator
    style={{ flex: 1 }}
    initialRoute={{
      getSceneClass() { return TopStoriesListView; },
      getTitle() { return 'Top Stories'; },
    }}
    sceneStyle={{ paddingTop: Navigator.NavigationBar.Styles.General.TotalNavHeight }}
  />;

HNApp.displayName = 'HNApp';

export default HNApp;