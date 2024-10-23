import renderer, {act} from 'react-test-renderer';
import React from 'react';
import {HeaderComponent, Header} from './Header';
import {IUser, RequestStatus} from '../../../types';
import {Provider} from 'react-redux';
import {store} from '../../../store';

jest.mock('../../../hooks', () => ({
  useAppDispatch: jest.fn(() => jest.fn()),
}));

describe('Header', () => {
  const user: IUser = {
    nick: 'john smith',
    username: 'john',
    avatar: 'avatar.url',
    'profile-image': 'profile-image.url',
  };

  describe('Presentational Component Tests', () => {
    it('should render component', () => {
      let component;
      act(() => {
        component = renderer.create(
          <Provider store={store}>
            <HeaderComponent user={user} />
          </Provider>,
        );
      });

      const containerElement = component!.root.findByProps({
        testID: 'header-container',
      });
      expect(containerElement).toBeTruthy();
    });

    it('should match component snapshots', () => {
      const tree = renderer
        .create(
          <Provider store={store}>
            <HeaderComponent user={user} />
          </Provider>,
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('should render the correct name', () => {
      let component;
      act(() => {
        component = renderer.create(
          <Provider store={store}>
            <HeaderComponent user={user} />
          </Provider>,
        );
      });

      const usernameElement = component!.root.findByProps({
        testID: 'header-username',
      });
      expect(usernameElement.props.children).toBe(user.nick);
    });
  });

  describe('Connected Component and mapStateToProps Tests', () => {
    beforeEach(() => {
      act(() => {
        store.dispatch({
          type: 'users/fetchUser/pending',
          payload: {
            status: RequestStatus.IDLE,
            data: {},
          },
        });
      });
    });

    it('should correctly map user data from state to props', () => {
      store.dispatch({
        type: 'users/fetchUser/fulfilled',
        payload: user,
      });

      let component;
      act(() => {
        component = renderer.create(
          <Provider store={store}>
            <Header />
          </Provider>,
        );
      });

      const usernameElement = component!.root.findByProps({
        testID: 'header-username',
      });
      expect(usernameElement.props.children).toBe(user.nick);
    });

    it('should update component when store data changes', () => {
      let component;
      act(() => {
        component = renderer.create(
          <Provider store={store}>
            <Header />
          </Provider>,
        );
      });

      const initialUsername = component!.root.findByProps({
        testID: 'header-username',
      });

      expect(initialUsername.props.children).toBe(undefined);

      const newUser = {
        ...user,
        nick: 'jane doe',
      };

      act(() => {
        store.dispatch({
          type: 'users/fetchUser/fulfilled',
          payload: newUser,
        });
      });

      const updatedUsername = component!.root.findByProps({
        testID: 'header-username',
      });
      expect(updatedUsername.props.children).toBe('jane doe');
    });

    it('should handle empty user data in store', () => {
      act(() => {
        store.dispatch({
          type: 'users/fetchUser/fulfilled',
          payload: {},
        });
      });

      let component;
      act(() => {
        component = renderer.create(
          <Provider store={store}>
            <Header />
          </Provider>,
        );
      });

      const usernameElement = component!.root.findByProps({
        testID: 'header-username',
      });
      expect(usernameElement.props.children).toBe(undefined);
    });

    it('should handle API Failure store', () => {
      act(() => {
        store.dispatch({
          type: 'users/fetchUser/rejected',
        });
      });

      let component;
      act(() => {
        component = renderer.create(
          <Provider store={store}>
            <Header />
          </Provider>,
        );
      });

      const usernameElement = component!.root.findByProps({
        testID: 'header-username',
      });
      expect(usernameElement.props.children).toBe(undefined);
    });

    it('should map all required user properties from state', () => {
      act(() => {
        store.dispatch({
          type: 'users/fetchUser/fulfilled',
          payload: user,
        });
      });

      let component;
      act(() => {
        component = renderer.create(
          <Provider store={store}>
            <Header />
          </Provider>,
        );
      });

      const usernameElement = component!.root.findByProps({
        testID: 'header-username',
      });
      expect(usernameElement.props.children).toBe(user.nick);

      const avatarElement = component!.root.findByProps({
        testID: 'user-image',
      });
      expect(avatarElement.props.source.uri).toBe(user.avatar);

      const containerElement = component!.root.findByProps({
        testID: 'header-container',
      });
      const backgroundImage = containerElement.props.children;
      expect(backgroundImage.props.source.uri).toBe(user['profile-image']);
    });
  });
});
