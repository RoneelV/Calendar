import searchIcon from '../assets/search.svg';
import closeIcon from '../assets/close.svg';

/**
 * @param {{searchQuery: string, setSearchQuery: Function}} param
 */
const Searchbar = ({ searchQuery, setSearchQuery }) => (
  <div className="flex flex-col items-start w-60 h-10 py-[0.5625rem] pl-4 pr-3 border border-[#eaeaea] rounded-[1.25rem] hover:border-black">
    <div className="flex flex-row space-x-1 h-fit items-center self-stretch">
      <div className="flex flex-row items-start space-x-3 grow">
        <div className="pt-[0.0625rem] w-5">
          <img src={searchIcon} alt="Magnifier icon" />
        </div>

        <input
          className="outline-none w-[10.125rem] body-s"
          placeholder="Search"
          type="search"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />
      </div>
      {searchQuery != '' && (
        <img
          src={closeIcon}
          className="w-5 hover:bg-[#f2f2f2]"
          alt="Close button icon to clear the search input"
          onClick={() => {
            setSearchQuery('');
          }}
          role="button"
        />
      )}
    </div>
  </div>
);

export default Searchbar;
