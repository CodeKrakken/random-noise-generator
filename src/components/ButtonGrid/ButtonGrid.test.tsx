import { fireEvent, render, screen } from '@testing-library/react';  
import ButtonGrid from './ButtonGrid'
import * as shared from '../shared.functions';

describe('ButtonGrid', () => {

  it('runs updateButton upon click', () => {

    const group = {
      label: 'Notes',
      id: 'notes',
      className: 'left',
      buttons: ['C'],
      columns: 2,
    };

    const voices = [{
      activeNotes: ['C'],
      activeOctaves: ['1']
    }] as any;

    const setVoices = jest.fn();

    const updateButtonSpy = jest.spyOn(shared, 'updateButton');

    render(
      <ButtonGrid
        group={group}
        voices={voices}
        i={0}
        setVoices={setVoices}
      />
    )

    fireEvent.click(screen.getByRole('button'));  
    expect(updateButtonSpy).toHaveBeenCalled();  
  })

  it('renders buttons with the correct props', () => {
    const group = {
      label: 'Notes',
      id: 'notes',
      className: 'left',
      buttons: ['C', 'D', 'E', 'F'],
    };

    const voices = [{
      activeNotes: ['C'],
      activeOctaves: ['1'],
    }] as any;

    const setVoices = jest.fn();

    render(
      <ButtonGrid
        group={group}
        voices={voices}
        i={0}
        setVoices={setVoices}
      />
    );

    const buttons = screen.getAllByRole('button');

    expect(buttons).toHaveLength(4);

    expect(buttons[0]).toHaveAttribute('value', 'C');
    expect(buttons[0]).toHaveAttribute('data-attribute', 'Notes');
    expect(buttons[0]).toHaveAttribute('data-voice', '0');
    expect(buttons[0]).toHaveAttribute('id', 'notes');
    expect(buttons[0]).toHaveAttribute('title', 'C');

    expect(buttons[1]).toHaveAttribute('value', 'D');
    expect(buttons[1]).toHaveAttribute('title', 'D');
  });
})