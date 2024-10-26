import styled from "styled-components";

const StyledInput = styled.input`
    padding: 6px
    `;

const SearchBar = ({ onChange }) => {
    return (
        <div>
            <div className="bg-white">
                <StyledInput onChange={onChange} className="bg-white text-black" placeholder="Search"/>
            </div>
        </div>
    )
}

export default SearchBar;