import { fireEvent, render, screen } from '@testing-library/react';  
import Piano from './Piano'
import * as shared from '../shared.functions';

describe('Piano', () => {

  it('runs updateButton upon click', () => {

    const voices = [{
      activeNotes: ['C'],
      activeOctaves: ['1']
    }] as any;

    const setVoices = jest.fn();

    const updateButtonSpy = jest.spyOn(shared, 'updateButton');

    render(
      <Piano
        voices={voices}
        i={0}
        setVoices={setVoices}
      />
    )

    const buttons = screen.getAllByRole('button')
    console.log(buttons[0])
    // fireEvent.click(screen.getByRole('button', { value: '1'}));  
    expect(updateButtonSpy).toHaveBeenCalled();  
  })
})