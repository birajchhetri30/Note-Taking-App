import { IoIosArrowDropleftCircle, IoIosArrowDroprightCircle } from "react-icons/io";

export default function PaginationButton({direction, onClick, disabled}) {
    const Icon = direction === 'left'
        ? IoIosArrowDropleftCircle
        : IoIosArrowDroprightCircle;

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="pagination_button"
        >
            <Icon />
        </button>
    );

}
