import NationalityPicker from 'components/nationality-picker';
import { ThemeColor } from 'utilities/constants';

function Explore() {
    return (
        <>
            <NationalityPicker theme={ThemeColor.BLACK} />
        </>
    );
}

export default Explore;
