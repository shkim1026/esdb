import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmbedVideoModal from './EmbedVideoModal';
import '@testing-library/jest-dom';

describe('EmbedVideoModal', () => {
  const sampleUrl = 'https://www.youtube.com/embed/test123';
  const sampleTitle = 'Sample Video';

  test('renders "Watch Now" button', () => {
    render(<EmbedVideoModal url={sampleUrl} title={sampleTitle} />);
    const button = screen.getByRole('button', { name: /watch video now/i });
    expect(button).toBeInTheDocument();
  });

  test('opens modal with iframe when "Watch Now" is clicked', () => {
    render(<EmbedVideoModal url={sampleUrl} title={sampleTitle} />);
    
    fireEvent.click(screen.getByRole('button', { name: /watch video now/i }));

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-hidden', 'false');

    const iframe = screen.getByTitle(sampleTitle);
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', sampleUrl);
  });

  test('closes modal when overlay is clicked', () => {
    render(<EmbedVideoModal url={sampleUrl} title={sampleTitle} />);
    
    fireEvent.click(screen.getByRole('button', { name: /watch video now/i }));
    const overlay = screen.getByRole('dialog');
    
    fireEvent.click(overlay);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('closes modal when close button is clicked', () => {
    render(<EmbedVideoModal url={sampleUrl} title={sampleTitle} />);
    
    fireEvent.click(screen.getByRole('button', { name: /watch video now/i }));
    const closeBtn = screen.getByRole('button', { name: /close video modal/i });

    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
