import { fireEvent, render, screen } from "@testing-library/react";  
import SingleSlider from "./SingleSlider";
import { makeVoice } from "../../shared.test.functions";

describe('SingleSlider', () => {
    it('renders', () => {
        render(
            <SingleSlider 
                slider={{ 
                    min: 0, 
                    max: 500, 
                    attrName: 'bpm', 
                    label: 'BPM', 
                    value: '120' 
                }} 
                i={0} 
                voices={[makeVoice()]} 
                setVoices={() => {}} 
            />
        )

        const sliders = screen.getAllByRole('slider');
        const slider = sliders[1]
        expect(slider).toBeInTheDocument();
        console.log(slider.outerHTML)
        expect(slider).toHaveValue(120);
        fireEvent.keyDown(slider, { which: 39 });
        expect(slider).toHaveAttribute('aria-valuenow', '121');    
    })
})