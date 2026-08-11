import { fireEvent, render, screen } from '@testing-library/react';  
import Piano from './VoicePiano'
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

    const button = document.querySelector('#voice-0-note-1') as HTMLButtonElement;
    fireEvent.click(button);  
    expect(updateButtonSpy).toHaveBeenCalled();  
  })

  it('marks active piano keys', () => {
    const voices = [{
      activeNotes: ['1'],
      activeOctaves: ['1'],
    }] as any;

    const setVoices = jest.fn();

    render(
      <Piano
        voices={voices}
        i={0}
        setVoices={setVoices}
      />
    );

    const activeKey = document.querySelector(
      '#voice-0-note-1'
    );

    expect(activeKey).toHaveClass('active');
  });
})