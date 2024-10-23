import React, {ReactElement, useCallback, useEffect} from 'react';
import {RefreshControl, StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {connect} from 'react-redux';

import {BasicStyle, ITweet, RootState} from './../../../types';
import {Tweet} from './../../../features/Tweet/ui/Tweet';
import {useAppDispatch} from './../../../hooks';
import {fetchUserTweets} from './../../../features/TweetList/state/tweets.thunk';
import {
  loadMoreTweets,
  refreshTweets,
} from './../../../features/TweetList/state/tweets.slice';

interface ITweetListProps {
  tweets: Array<ITweet>;
  isRefreshing: boolean;
}

function TweetListComponent({
  tweets,
  isRefreshing,
}: ITweetListProps): ReactElement {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserTweets());
  }, [dispatch]);

  const handleLoadMore = useCallback(() => {
    dispatch(loadMoreTweets());
  }, [dispatch]);

  const refreshTweetsList = useCallback(() => {
    dispatch(refreshTweets());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <FlatList
        data={tweets}
        style={styles.list}
        renderItem={tweet => <Tweet tweet={tweet.item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.08}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshTweetsList}
          />
        }
      />
    </View>
  );
}

const mapStateToProps = (state: RootState) =>
  ({
    tweets: state.tweets.displayedTweets,
    isRefreshing: state.tweets.isRefreshing,
  } as ITweetListProps);

export const TweetList = connect(mapStateToProps)(TweetListComponent);

const styles: Partial<BasicStyle> = StyleSheet.create<Partial<BasicStyle>>({
  container: {
    flex: 1,
    paddingBottom: 8,
    paddingHorizontal: 8,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  list: {
    width: '100%',
  },
});
