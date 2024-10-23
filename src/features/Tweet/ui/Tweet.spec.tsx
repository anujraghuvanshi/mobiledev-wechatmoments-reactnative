import renderer, { act } from 'react-test-renderer';
import React from 'react';

import {Tweet} from './Tweet';
import {ITweet} from '../../../types';

describe('Tweet', () => {
  const testTweet: ITweet = {
    sender: {
      nick: 'john',
      username: 'John Smith',
      avatar: 'test-image.url',
    },
    content: 'tweet content',
    images: [{url: 'image1.url'}, {url: 'image2.url'}],
    comments: [
      {
        content: 'Great tweet!',
        sender: {nick: 'user1', username: 'User One', avatar: 'avatar1.url'},
      },
      {
        content: 'I agree',
        sender: {nick: 'user2', username: 'User Two', avatar: 'avatar2.url'},
      },
    ],
  };

  it('should match component snapshots', () => {
    const component = renderer.create(<Tweet tweet={testTweet} />).toJSON();
    expect(component).toMatchSnapshot();
  });

  it('should render component', () => {
    const component = renderer.create(<Tweet tweet={testTweet} />);
    const containerElement = component.root.findByProps({
      testID: 'tweet-wrapper',
    });
    expect(containerElement).toBeTruthy();
  });

  it('should render error text on Unknown Error', () => {
    const tweet = {'unknown error': 'STARCRAFT2'};
    const component = renderer.create(<Tweet tweet={tweet} />);
    const containerElement = component.root.findByProps({
      testID: 'error-text',
    });
    expect(containerElement.props.children[1]).toBe('STARCRAFT2');
  });

  it('should render error text on normal Errors', () => {
    const tweet = {error: 'losted'};
    const component = renderer.create(<Tweet tweet={tweet} />);
    const containerElement = component.root.findByProps({
      testID: 'error-text',
    });
    expect(containerElement.props.children[1]).toEqual('losted');
  });

  it('should render the right content', () => {
    const component = renderer.create(<Tweet tweet={testTweet} />);
    const element = component.root.findByProps({
      testID: 'tweet-content',
    });
    expect(element.props.children).toBe('tweet content');
  });

  it('should verify whether read more is being called', () => {
    const component = renderer.create(<Tweet tweet={testTweet} />);
    const element = component.root.findByProps({
      testID: 'read-more-trigger',
    });
    act(() => {
      element.props.onPress();
    });
    expect(element).toHaveBeenCalled();
  });

  it("should render the sender's avatar", () => {
    const component = renderer.create(<Tweet tweet={testTweet} />);
    const avatarElement = component.root.findByProps({
      testID: 'sender-image',
    });
    expect(avatarElement.props.source.uri).toBe('test-image.url');
  });

  it("should render the sender's avatar when no image", () => {
    const tweetWithoutImages = {...testTweet, sender: {}};
    const component = renderer.create(
      <Tweet tweet={tweetWithoutImages as any} />,
    );
    const avatarElement = component.root.findByProps({
      testID: 'sender-image',
    });
    expect(avatarElement.props.source.uri).toBe('');
  });

  it('should render the images container if the tweet has images', () => {
    const component = renderer.create(<Tweet tweet={testTweet} />);
    const containerElement = component.root.findByProps({
      testID: 'tweet-images-wrapper',
    });
    expect(containerElement).toBeTruthy();
  });

  it('should render the images with blank url when tweet image is not present', () => {
    const tweetWithBlankImageObj = {...testTweet, images: [{url: null}]};
    const component = renderer.create(
      <Tweet tweet={tweetWithBlankImageObj as any} />,
    );
    const containerElement = component.root.findByProps({
      testID: 'tweet-image',
    });
    expect(containerElement.props.source.uri).toBe('');
  });

  it('should not render images container when tweet has no images', () => {
    const tweetWithoutImages = {...testTweet, images: []};
    const component = renderer.create(<Tweet tweet={tweetWithoutImages} />);
    expect(() => {
      component.root.findByProps({
        testID: 'tweet-images-wrapper',
      });
    }).toThrow();
  });

  it('should render the comments wrapper when comments exist', () => {
    const component = renderer.create(<Tweet tweet={testTweet} />);
    const commentsWrapper = component.root.findByProps({
      testID: 'tweet-comments-wrapper',
    });
    expect(commentsWrapper).toBeTruthy();
  });

  it('should not render comments wrapper when there are no comments', () => {
    const tweetWithoutComments = {...testTweet, comments: undefined};
    const component = renderer.create(<Tweet tweet={tweetWithoutComments} />);
    expect(() => {
      component.root.findByProps({
        testID: 'tweet-comments-wrapper',
      });
    }).toThrow();
  });
});
