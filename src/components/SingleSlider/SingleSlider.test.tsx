import { fireEvent, render, screen } from "@testing-library/react";  
import SingleSlider from "./SingleSlider";
import { makeVoice } from "../../shared.test.functions";

describe('SingleSlider', () => {
    it('renders', () => {
        render(
            <SingleSlider 
                slider={{ 
                    min: 0, 
                    max: 100, 
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
        console.log(sliders);
        expect(sliders[1]).toBeInTheDocument();
    })
})