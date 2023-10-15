import { FaStar } from 'react-icons/fa';

import { Colors } from 'utilities/constants';

type StarRatingProps = {
    rating: number;
    setRating: (newRating: number) => void;
};

function StarRating(props: StarRatingProps) {
    return (
        <div>
            {[...Array(5)].map((_, idx) => {
                const givenRating = idx + 1;
                return (
                    <FaStar
                        key={idx}
                        color={
                            givenRating <= props.rating
                                ? Colors.mainYellow
                                : Colors.secondaryWhite
                        }
                        size="22px"
                        onClick={() => props.setRating(givenRating)}
                    />
                );
            })}
        </div>
    );
}

export default StarRating;
