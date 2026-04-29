import { fireEvent, render, screen } from '@testing-library/react-native';
import App from './App';

describe('FaithDate app shell', () => {
  it('renders the launch experience and switches profile cards', async () => {
    render(<App />);

    expect(screen.getByText(/meet someone who shares your walk with god/i)).toBeTruthy();
    expect(screen.getByText(/values-led matching/i)).toBeTruthy();
    expect(screen.getByText(/create your profile/i)).toBeTruthy();

    fireEvent.press(screen.getByText(/next match/i));

    expect(screen.getByText(/Grace, 27/i)).toBeTruthy();
    expect(screen.getByText(/Bible study host/i)).toBeTruthy();
    expect(screen.getByText(/Grace shares 7 of your top values/i)).toBeTruthy();
  });
});
