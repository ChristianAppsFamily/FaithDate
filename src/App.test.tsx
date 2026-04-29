import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('FaithDate app shell', () => {
  it('renders the launch experience and switches profile cards', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(
      screen.getByRole('heading', { name: /meet someone who shares your walk with god/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/values-led matching/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create your profile/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next match/i }));

    expect(screen.getByText(/Grace, 27/i)).toBeInTheDocument();
    expect(screen.getByText(/Bible study host/i)).toBeInTheDocument();
    expect(screen.getByText(/Grace shares 7 of your top values/i)).toBeInTheDocument();
  });
});
