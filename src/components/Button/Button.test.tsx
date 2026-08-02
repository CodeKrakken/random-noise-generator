import { render } from "@testing-library/react"
import Button from "./Button"
import { buttonImages } from '../../content/data'

describe('Button', () => {

    it('renders the button with image', () => {
        
        buttonImages['button-images/intervals'] = '/mock/intervals.png';

        const { getByRole } = render(
            <Button
            props={{}}
            label=""
            imgPath="button-images/intervals"
            />
        );

        const imgElement = getByRole('presentation');

        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', '/mock/intervals.png');
    });
})
