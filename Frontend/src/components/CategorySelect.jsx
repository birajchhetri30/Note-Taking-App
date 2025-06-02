import CreatableSelect from 'react-select/creatable';

export default function CategorySelect({ value, options, onChange, onCreateOption }) {
    return (
        <div className="lg:w-1/2 md:w-1/2">
            <CreatableSelect
                isMulti
                options={options}
                value={value}
                onChange={onChange}
                onCreateOption={onCreateOption}
                placeholder='Select or create categories'
                styles={styles}
            />
        </div>
    );
}

const styles = {
    menu: (provided) => ({
        ...provided,
        backgroundColor: "#9c6644",
        borderRadius: '0.75rem',
        borderWidth: '2px',
        borderColor: '#ddb892',
        padding: '0.25rem',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? '#ddb892' : 'transparent',
        cursor: 'pointer',
        borderRadius: '0.75rem',
        padding: '0.5rem',
        color: '#412512',
        fontWeight: 'bold',

    }),
    control: (provided) => ({
        ...provided,
        backgroundColor: '#ddb892',
        borderRadius: '0.75rem',
        borderColor: '#b08968',
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: "#7f5539",
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#ede0d4',
    }),
}