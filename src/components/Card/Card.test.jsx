import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card'

describe('Card component', () => {
    const mockData = {
        title: 'Test Movie',
        poster_path: 'test-poster.jpg',
    }

    const mockFetchDetails = jest.fn();

    beforeEach(() => {
        mockFetchDetails.mockClear();
    })

    test('renders the image with correct src and alt text', () => {
        render(<Card data={mockData} fetchDetails={mockFetchDetails} />);

        const image = screen.getByRole('button', { name: /test movie/i })
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute(
            'src',
            'https://image.tmdb.org/t/p/w342/test-poster.jpg'
        )
        expect(image).toHaveAttribute('alt', 'Test Movie')
    })

    test('calls fetchdetails on click' , () => {
        render(<Card data={mockData} fetchDetails={mockFetchDetails} />)
        const image = screen.getByRole('button')
        fireEvent.click(image)
        expect(mockFetchDetails).toHaveBeenCalledTimes(1)
    })

    test('calls fetchDetails on Enter key press', () => {
        render(<Card data={mockData} fetchDetails={mockFetchDetails} />)
        const image = screen.getByRole('button');
        fireEvent.keyDown(image, { key: 'Enter', code: 'Enter' })
        expect(mockFetchDetails).toHaveBeenCalledTimes(1)
    })

    test('calls fetchDetails on Space key press', () => {
        render(<Card data={mockData} fetchDetails={mockFetchDetails} />)
        const image = screen.getByRole('button')
        fireEvent.keyDown(image, { key: ' ', code: 'Space' })
        expect(mockFetchDetails).toHaveBeenCalledTimes(1)
    })
})