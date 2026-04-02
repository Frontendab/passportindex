
export default function SearchInput({onChangeInputSearch }) {
    return (
        <div className='w-full px-3'>
            <input type="search" placeholder="Search by name or visa type.." 
                className="bg-mist-100 w-full p-3 my-2 border-1 border-gray-200 rounded outline-green-500"
                onChange={onChangeInputSearch}
            />
        </div>
    );
};