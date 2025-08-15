import { renderHook, act, waitFor } from '@testing-library/react';
import useFavorites from './useFavorites';
import { auth } from '../../firebase/firebase';
import {
  doc as mockDoc,
  getDoc as mockGetDoc,
  setDoc as mockSetDoc,
  deleteDoc as mockDeleteDoc
} from 'firebase/firestore';

// 🔧 Mock Firebase auth and db
let mockCurrentUser = { uid: 'test-user-id' };
const mockDb = {};

jest.mock('../../firebase/firebase', () => ({
  auth: {
    get currentUser() {
      return mockCurrentUser;
    }
  },
  db: mockDb,
}));

// 🔧 Mock Firestore methods
jest.mock('firebase/firestore', () => ({
  __esModule: true,
  doc: jest.fn((db, collection1, userId, collection2, itemId) => ({
    path: `${collection1}/${userId}/${collection2}/${itemId}`
  })),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  deleteDoc: jest.fn()
}));

describe('useFavorites', () => {
  const itemId = '123';

  beforeEach(() => {
    jest.clearAllMocks();
    mockCurrentUser = { uid: 'test-user-id' };

    mockGetDoc.mockResolvedValue({
      exists: () => true,
    });
  });

  test('should default to not favorite if no user is logged in', async () => {
    mockCurrentUser = null;
    mockGetDoc.mockResolvedValueOnce({ exists: () => false });

    const { result } = renderHook(() => useFavorites(itemId));

    await waitFor(() => {
      expect(result.current.isFavorite).toBe(false);
    });
  });

  test("should set isFavorite to true if item is in favorites", async () => {
    const itemId = "123";

    mockCurrentUser = { uid: "test-user-id"};

    const mockSnap = { exists: () => true };
    mockGetDoc.mockResolvedValueOnce(mockSnap);

    const { result } = renderHook(() => useFavorites(itemId));

    await waitFor(() => expect(result.current.isFavorite).toBe(true), {
      timeout: 1500, // add timeout buffer
    });

    expect(mockDoc).toHaveBeenCalledWith(mockDb, "users", "test-user-id", "favorites", itemId);
  });



  test('addToFavorites should call setDoc and set isFavorite true', async () => {
    const item = { id: 123, title: 'Test Movie' };
    const mediaType = 'movie';

    mockSetDoc.mockResolvedValueOnce();

    const { result } = renderHook(() => useFavorites(itemId));

    await act(async () => {
      await result.current.addToFavorites(item, mediaType);
    });

    expect(mockSetDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        ...item,
        mediaType,
        addedAt: expect.any(String),
      })
    );

    expect(result.current.isFavorite).toBe(true);
  });

  test('removeFromFavorites should call deleteDoc and set isFavorite false', async () => {
    mockDeleteDoc.mockResolvedValueOnce();

    const { result } = renderHook(() => useFavorites(itemId));

    await act(async () => {
      await result.current.removeFromFavorites();
    });

    expect(mockDeleteDoc).toHaveBeenCalled();
    expect(result.current.isFavorite).toBe(false);
  });

  test('addToFavorites should alert if no user is logged in', async () => {
    global.alert = jest.fn();
    mockCurrentUser = null;

    const { result } = renderHook(() => useFavorites(itemId));

    await act(async () => {
      await result.current.addToFavorites({ id: 123 }, 'movie');
    });

    expect(global.alert).toHaveBeenCalledWith("Please sign in to add items to your list.");
  });

  test('removeFromFavorites should alert if no user is logged in', async () => {
    global.alert = jest.fn();
    mockCurrentUser = null;

    const { result } = renderHook(() => useFavorites(itemId));

    await act(async () => {
      await result.current.removeFromFavorites();
    });

    expect(global.alert).toHaveBeenCalledWith("You must be signed in to remove favorites.");
  });
});
