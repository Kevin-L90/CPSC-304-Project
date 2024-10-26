import Select from 'react-select'
import { useState } from "react";

export type FilterType = {
    identifier: string,
    options: string[],
    onChange: (e: unknown) => void,
}

type FilterProps = {
    filter: FilterType
};

const Filter = ({ filter }: FilterProps) => {
    const [open, SetOpen] = useState(false);

    const handleOpen = () => {
        SetOpen(!open);
    };

    const options = filter.options.map((option) => { 
        return { value: option, label: option }});

    (
        <div className="bg-slate-500 rounded-lg flex flex-col items-center">
            <div className="">
            <button onClick={handleOpen} className="">
                {filter.identifier}
            </button>
            {
                open ? (
                    <ul className="absolute">
                        {
                        filter.options.map((option, index) =>
                           <div key={index}>
                                <li>
                                    {option}
                                </li>
                            </div>  
                        )}
                    </ul>) : null
            }
            </div>
        </div>
    )

    return (
        <div>
            <Select options={options} 
                    placeholder={filter.identifier}
                    isClearable={true}
                    onChange={filter.onChange}
                    styles={{
                        control: (baseStyles) => ({
                            ...baseStyles,
                            backgroundColor: 'white',
                            color: 'white',
                          }),
                        option: (baseStyles, { isDisabled, isFocused }) => ({
                            ...baseStyles,
                            backgroundColor: isFocused ? 'grey' : 'white',
                            color: 'black',
                            cursor: isDisabled ? 'not-allowed' : 'pointer'
                          }),
                        placeholder: (baseStyles) => ({
                            ...baseStyles,
                            color: 'grey',
                        }),
                    }}
                    />
        </div>
    )
}

export default Filter;