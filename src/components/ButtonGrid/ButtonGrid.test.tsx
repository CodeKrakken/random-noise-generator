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
})