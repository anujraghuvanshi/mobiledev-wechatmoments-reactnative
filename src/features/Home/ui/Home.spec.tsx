import React from 'react';
import renderer from 'react-test-renderer';
import Home from './Home';
import {Header} from '../../Header/ui/Header';
import {TweetList} from '../../TweetList/ui/TweetList';

jest.mock('../../Header/ui/Header', () => ({
  Header: 'Header',
}));

jest.mock('../../TweetList/ui/TweetList', () => ({
  TweetList: 'TweetList',
}));

describe('Home Component', () => {
  it('should render component', () => {
    const tree = renderer.create(<Home />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('contains the correct testID', () => {
    const instance = renderer.create(<Home />).root;
    const viewWithTestID = instance.findByProps({testID: 'home-page'});
    expect(viewWithTestID).toBeTruthy();
  });

  it('renders Header and TweetList components', () => {
    const testRenderer = renderer.create(<Home />).root;
    const headerComponent = testRenderer.findByType(Header);
    const tweetListComponent = testRenderer.findByType(TweetList);

    expect(headerComponent).toBeTruthy();
    expect(tweetListComponent).toBeTruthy();
  });
});
