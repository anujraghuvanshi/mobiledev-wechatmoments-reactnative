import React, {ReactElement, useState} from 'react';
import {
  Image,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TextStyle,
} from 'react-native';

import {BasicStyle, ITweet} from '../../../types';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface ITweetProps {
  tweet: ITweet;
}

export function Tweet({tweet}: ITweetProps): ReactElement {
  const [showAllImages, setshowAllImages] = useState<boolean>(
    tweet.images && tweet?.images.length <= 4 ? true : false,
  );
  const [isReadingMore, setisReadingMore] = useState(false);

  return (
    <View testID="tweet-wrapper" style={styles.container}>
      {tweet.error || tweet['unknown error'] ? (
        <Text testID="error-text">
          Tweet with error: {tweet.error || tweet['unknown error']}{' '}
        </Text>
      ) : (
        <>
          <Image
            style={styles.image}
            testID="sender-image"
            source={{
              uri: tweet?.sender?.avatar || '',
              width: 40,
              height: 40,
            }}
          />
          <View style={styles.tweetContainer}>
            <View>
              <Text style={styles.sender}>
                {tweet?.sender?.nick || tweet?.sender?.username}
              </Text>
              {tweet?.content && (
                <View style={styles.contentWrapper}>
                  <Text
                    testID="tweet-content"
                    style={styles.text}
                    numberOfLines={isReadingMore ? undefined : 2}>
                    {tweet.content}
                  </Text>
                  <Text
                    style={styles.readMore}
                    testID="read-more-trigger"
                    onPress={() => {
                      setisReadingMore(!isReadingMore);
                    }}>
                    {isReadingMore ? 'Read Less' : 'Read more'}
                  </Text>
                </View>
              )}
            </View>
            {tweet?.images?.length && (
              <View style={styles.tweetImageContainer}>
                <View
                  testID="tweet-images-wrapper"
                  style={styles.imagesWrapper}>
                  {(showAllImages
                    ? tweet.images
                    : tweet.images.slice(0, 4)
                  ).map((image, index) => (
                    <Image
                      testID="tweet-image"
                      key={`image-${image?.url?.split('/').pop()}-${index}`}
                      style={styles.image}
                      source={{
                        uri: image?.url || '',
                        width: 64,
                        height: 64,
                      }}
                    />
                  ))}
                </View>
                {tweet?.images?.length > 4 && (
                  <TouchableOpacity
                    onPress={() => {
                      setshowAllImages(!showAllImages);
                    }}>
                    <Text>Show All Images</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            {tweet.comments && (
              <View testID="tweet-comments-wrapper" style={styles.commentsWrap}>
                {tweet.comments.map((comment, index) => (
                  <View
                    key={`${index}-${comment.sender.username}`}
                    style={styles.comment}>
                    <Text style={styles.commentSender}>
                      {comment.sender.nick}:{' '}
                    </Text>
                    <Text>{comment.content}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
}

interface AdditionalStyle {
  imagesWrapper: ViewStyle;
  tweetContainer: ViewStyle;
  sender: TextStyle;
  commentsWrap: ViewStyle;
  comment: ViewStyle;
  commentSender: TextStyle;
  tweetImageContainer: ViewStyle;
  contentWrapper: ViewStyle;
  readMore: TextStyle;
}

const styles: Partial<BasicStyle> & AdditionalStyle = StyleSheet.create<
  Partial<BasicStyle> & AdditionalStyle
>({
  container: {
    flex: 1,
    alignContent: 'space-between',
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingBottom: 8,
    paddingTop: 8,
    paddingRight: 8,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  },
  image: {
    marginRight: 16,
    marginBottom: 16,
    backgroundColor: '#e4f0f5',
  },
  imagesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 8,
  },
  tweetContainer: {
    flexShrink: 1,
    flex: 1,
  },
  text: {
    flexWrap: 'wrap',
    flexShrink: 1,
    color: '#a1a1a1',
  },
  sender: {
    color: '#4152c9',
    fontWeight: '600',
  },
  commentsWrap: {
    paddingTop: 8,
    flex: 1,
    flexDirection: 'column',
  },
  comment: {
    flex: 1,
    width: '100%',
    marginBottom: 4,
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    padding: 2,
  },
  commentSender: {
    fontWeight: 'bold',
    color: '#000',
  },
  tweetImageContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  contentWrapper: {
    flexDirection: 'column',
  },
  readMore: {
    color: 'blue',
  },
});
