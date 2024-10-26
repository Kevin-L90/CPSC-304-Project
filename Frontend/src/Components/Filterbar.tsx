import Filter, { FilterType } from "./Filter";

type FilterBarProps = {
    filters: FilterType[];
};

const FilterBar = ({ filters } : FilterBarProps) => {
    const filterBarSize = filters.length;
    const gridCols = "grid-cols-" + filterBarSize.toString();
    
    return (
        <div className="">
            <div className={"px-4 grid gap-16 " + gridCols}>
                {
                    filters.map((filter, index) =>
                        <div key={index}>
                            <Filter filter={filter} />
                        </div>
                )}
            </div>
        </div>
    )
}

export default FilterBar;