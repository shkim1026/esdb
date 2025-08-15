import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Header from './Header';
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { getDoc, setDoc, doc } from 'firebase/firestore';

jest.mock('../../../firebase/firebase', () => ({
  auth: {},
  db: {},
  googleProvider: {},
  gitHubProvider: {},
}));

// Mock Firebase methods
jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signInWithPopup: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback({ uid: '123', displayName: 'TestUser' });
  }),
  signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
}));

describe('Header component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    // Default mock for onAuthStateChanged: no user signed in
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);
      return () => {};
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  })

  test('renders login button when not authenticated', () => {
    render(<Header />);
    expect(screen.getByTestId('login-button-desktop')).toBeVisible();
    expect(screen.getByTestId('login-button-mobile')).toBeVisible();
  });

  test('opens login modal on login button click', async () => {
    render(<Header />);

    fireEvent.click(screen.getByTestId('login-button-desktop'));
    const modalDesktop = await screen.findByTestId('login-modal-desktop')
    expect(modalDesktop).toBeVisible();

    fireEvent.click(screen.getByTestId('login-modal-close-desktop'));
    expect(modalDesktop).not.toBeVisible();

    fireEvent.click(screen.getByTestId('login-button-mobile'));
    const modalMobile = await screen.findByTestId('login-modal-desktop')
    expect(modalMobile).toBeVisible();
  });

  test('switches from login modal to signup modal', async () => {
    render(<Header />);
    fireEvent.click(screen.getByTestId('login-button-desktop'));
    const loginModal = await screen.findByTestId('login-modal-desktop')
    expect(loginModal).toBeVisible();

    const switchToSignupBtn = screen.getByTestId('switch-to-signup-btn-desktop')
    fireEvent.click(switchToSignupBtn);

    expect(screen.queryByTestId('login-modal-desktop')).not.toBeInTheDocument();
    expect(await screen.findByTestId('signup-modal-desktop')).toBeVisible();
  });

  test('calls handleLogin on login submit', async () => {
    const mockUser = { email: 'test@example.com' };
    signInWithEmailAndPassword.mockResolvedValue({ user: mockUser });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<Header />);

    fireEvent.click(screen.getByTestId('login-button-desktop'));

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByTestId('submit-login-desktop'));

    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.any(Object),
        'test@example.com',
        'password123'
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        'Login attempt with:', 
        'test@example.com', 
        'password123'
      );
    });
    consoleSpy.mockRestore();
  });

  test('calls Google sign in and creates user doc if new', async () => {
    const fakeUser = { uid: '123', displayName: 'Google User' };
    const fakeDocRef = { id: 'mocked-user-ref'};

    signInWithPopup.mockResolvedValue({ user: fakeUser });
    getDoc.mockResolvedValue({ exists: () => false });
    setDoc.mockResolvedValue();
    doc.mockReturnValue(fakeDocRef);

    render(<Header />);
    fireEvent.click(screen.getByTestId('login-button-desktop'));
    fireEvent.click(screen.getByTestId('google-signin-desktop'));

    await waitFor(() => {
      expect(setDoc).toHaveBeenCalledWith(expect.anything(), {
        username: fakeUser.displayName,
        createdAt: expect.anything(),
      });
    });
  });

  // test('displays username when user is authenticated', async () => {
  //   const fakeUser = { uid: '123' };
  //   const userDocData = { username: 'TestUser' };

  //   onAuthStateChanged.mockImplementation((auth, callback) => {
  //     callback(fakeUser);
  //     return () => {};
  //   });

  //   getDoc.mockImplementation(() =>
  //     Promise.resolve({ exists: () => true, data: () => userDocData })
  //   );

  //   render(<Header user={fakeUser}/>);

  //   fireEvent.click(screen.getByTestId('open-hamburger-menu'));

  //   await waitFor(() => {
  //     expect(screen.getByTestId('username-mobile')).toHaveTextContent('TestUser');
  //   });
  // });

  // test('displays username when user is authenticated', async () => {
  //   const fakeUser = { uid: '123' };
  //   const userDocData = { username: 'TestUser' };

  //   onAuthStateChanged.mockImplementation((auth, callback) => {
  //     callback(fakeUser);
  //     return () => {};
  //   });

  //   getDoc.mockResolvedValue({
  //     exists: () => true,
  //     data: () => userDocData,
  //   });

  //   render(<Header user={fakeUser} />);
  //   fireEvent.click(screen.getByTestId('open-hamburger-menu'));

  //   const usernameEl = await screen.findByTestId('username-mobile');
  //   expect(usernameEl).toHaveTextContent('TestUser');
  // });

  // test('displays username when user is authenticated', async () => {
  //   const fakeUser = { uid: '123', email: 'test@example.com' };
  //   const userDocData = { username: 'TestUser' };

  //   onAuthStateChanged.mockImplementation((auth, callback) => {
  //     callback(fakeUser);
  //     return () => {};
  //   });

  //   getDoc.mockResolvedValue({
  //     exists: () => true,
  //     data: () => userDocData,
  //   });

  //   await act(async () => {
  //     render(<Header />);
  //   })
  //   screen.debug();

  //   fireEvent.click(screen.getByTestId('open-hamburger-menu'));
  //   screen.debug();
  //   const usernameEl = await screen.findByTestId('username-mobile');
  //   expect(usernameEl).toHaveTextContent('TestUser');
  // });

  test('displays username when user is authenticated', async () => {
    onAuthStateChanged.mockImplementation((_auth, callback) => {
      callback({ uid: '123' })
      return () => {};
    });

    getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({ username: 'TestUser' }),
    });

    window.innerWidth = 375;
    window.dispatchEvent(new Event('resize'));

    render(<Header />);

    await waitFor(() => {
      expect(screen.queryByTestId('signout-button-mobile')).toBeInTheDocument();
    }, { timeout: 5000 });

    fireEvent.click(screen.getByTestId('open-hamburger-menu'));

    await waitFor(() => {
      expect(screen.getByTestId('username-mobile')).toHaveTextContent('TestUser');
    });
  });

  test('signs out user and hides hamburger menu', async () => {
    signOut.mockResolvedValue();

    render(<Header user={{ uid: '123', displayName: 'TestUser' }} />);
    fireEvent.click(screen.getByTestId('open-hamburger-menu'));

    const signoutBtn = await screen.findByTestId('signout-button-mobile');
    expect(signoutBtn).toBeInTheDocument();
    fireEvent.click(signoutBtn);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled();
    });
  });

  test('profile nav dropdown shows/hides on mouse events', async () => {
    const fakeUser = { uid: '123' };

    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback({ uid: '123' });
      return () => {};
    });

    render(<Header user={fakeUser}/>);
  
    const profileWrapper = screen.getByTestId('profile-wrapper-desktop');
    fireEvent.mouseEnter(profileWrapper);
    expect(screen.getByRole('menu')).toBeVisible();
  
    fireEvent.mouseLeave(profileWrapper);

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    );
  });

});


// Search input tests
describe('Header search results rendering', () => {

  beforeEach(() => {
    global.fetch = jest.fn(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  test('shows "No results found" when query has no matching results and input is focused', async () => {
    render(<Header />);

    const input = screen.getByPlaceholderText(/search/i);

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'gibberishsearchquery' } });

    const noResults = await screen.findByText(/no results found/i);
    expect(noResults).toBeInTheDocument();
  });

  test('does not show "No results found" if query is empty', async () => {
    render(<Header />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.focus(input);

    const noResults = screen.queryByText(/no results found/i);
    expect(noResults).not.toBeInTheDocument();
  });

  test('renders filtered search results (excluding "person" media types)', async () => {
    const mockResults = {
      results: [
        {
          id: 1,
          title: 'Inception',
          media_type: 'movie',
          release_date: '2010-07-16',
          poster_path: '/inception.jpg',
        },
        {
          id: 2,
          name: 'Breaking Bad',
          media_type: 'tv',
          first_air_date: '2008-01-20',
          poster_path: '/breakingbad.jpg',
        },
        {
          id: 3,
          name: 'Some Actor',
          media_type: 'person', // Should be excluded
          profile_path: '/actor.jpg',
        },
      ]
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResults),
      })
    );

    render(<Header />);

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'test' } });

    expect(await screen.findByText(/Inception/i)).toBeInTheDocument();
    expect(await screen.findByText(/Breaking Bad/i)).toBeInTheDocument();
    expect(screen.queryByText(/Some Actor/i)).not.toBeInTheDocument();
  });
  
});