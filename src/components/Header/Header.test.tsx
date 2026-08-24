import { fireEvent, render, screen, waitFor } from '@testing-library/react';  
import Header, { letterImages } from './Header';  
import { makeVoice } from '../../shared.test.functions';
  
jest.mock('../../content/data', () => ({  
  title:    'OCTOPUS!',  
  addLabel: 'Add Voice',  
}));  
  
describe('Header', () => {  
  const mockHandleAddVoice        = jest.fn();  
  const mockHandleStartStop       = jest.fn();  
  const mockLoadVoices            = jest.fn();  
  const mockHandleReplay          = jest.fn();
  const mockHandleReallyRandomVoices  = jest.fn();
  const mockHandleQuiteRandomVoices  = jest.fn();

  
  const header = (state: Boolean) => (  
    <Header  
      handleAddVoice={mockHandleAddVoice}  
      handleImprov={mockHandleStartStop}  
      improvising={state}  
      replaying={false}
      voices={[makeVoice()]}  
      loadVoices={mockLoadVoices}  
      handlePlayback={mockHandleReplay}
      recordedHits={[]}
      handleReallyRandomVoices={mockHandleReallyRandomVoices}
      handleQuiteRandomVoices={mockHandleQuiteRandomVoices}
    />  
  )  
  
  beforeEach(() => { jest.clearAllMocks(); });  
  
  it('displays correct button text based on running state', () => {  
  
    const { rerender } = render(header(false));  
  
    expect(screen.getByRole('button',   { name: 'S t a r t' })).toBeInTheDocument();  
    expect(screen.queryByRole('button', { name: 'S t o p'   })).not.toBeInTheDocument();  
  
    rerender(header(true));  
  
    expect(screen.queryByRole('button', { name: 'S t a r t' })).not.toBeInTheDocument();  
    expect(screen.getByRole('button',   { name: 'S t o p'   })).toBeInTheDocument();  
  });  

  it('enables Load button after Save', () => {
    render(header(false))

    const loadButton = screen.getByRole('button', { name: 'L o a d' });

    expect(loadButton).toBeDisabled()
    fireEvent.click(screen.getByRole('button', { name: 'S a v e'}));  
    expect(loadButton).toBeEnabled();
  })

  it('renders non-alphanumeric characters as text', () => {
    render(header(false));

    expect(screen.getByText('!')).toBeInTheDocument();
  });

  it('uses the default letter image height', () => {
    const result = letterImages('A');

    const image = result.props.children[0];

    expect(image.props.height).toBe('40px');
  });
});