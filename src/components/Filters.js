import { useState, useEffect } from 'react';

/**
 * @param {{text: string, className?: string, onClick?: (e: import('react').MouseEvent) => void}} param
 */
const RoundedBadge = ({ text, className = '', onClick }) => (
  <div
    className={
      'flex items-center w-fit px-3 py-[0.3125rem] h-8 rounded-[2rem] hover:font-medium ' +
      className
    }
    {...(onClick != undefined && { role: 'button', onClick })}
  >
    <p className="body-s text-[#222222]">{text}</p>
  </div>
);

/**
 * @param {{text: string, toggle: Function, checked: boolean, iconColor: string}} param
 */
const StatusCheckBox = ({ text, toggle, checked, iconColor }) => (
  <label
    htmlFor={'check-seat-' + text}
    className="flex flex-col items-start px-3 py-[0.5625rem] rounded-lg cursor-pointer select-none"
  >
    <div className="flex space-x-1 justify-between w-full">
      <div className="flex space-x-3 items-center">
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="10" height="10" rx="2" fill={iconColor} />
        </svg>

        <p className="body-s text-[#666666]">{text}</p>
      </div>
      <div className="relative">
        <input
          type="checkbox"
          id={'check-seat-' + text}
          name="seat-checks"
          className="sr-only"
          value={text}
          checked={checked}
          onChange={(e) => {
            toggle(e.target.checked);
          }}
        />
        <div
          className={
            'flex items-center justify-center w-[1.125rem] h-[1.125rem] rounded border border-[#d1d1d1]' +
            (checked ? ' border-[#4c98fb]' : '')
          }
        >
          <span
            className={
              'w-[10px] h-[10px] rounded-sm' + (checked ? ' bg-[#4c98fb]' : '')
            }
          ></span>
        </div>
      </div>
    </div>
  </label>
);

/** @type {{status: ReturnType<import('../utils/getEventStatus').getEventStatus>, iconColor: string}[]} */
const statusData = [
  { status: 'Filling fast', iconColor: '#FBBF24' },
  { status: 'Available', iconColor: '#4C98FB' },
  { status: 'Booked', iconColor: '#BFBFBF' },
];

/**
 * @param {{globalCheckedStatus: string[], setGlobalCheckedStatus: Function}} param
 * @returns
 */
const DropDownButton = ({ globalCheckedStatus, setGlobalCheckedStatus }) => {
  const [open, setOpen] = useState(false);

  const [checkedStatus, setCheckedStatus] = useState(globalCheckedStatus);

  function handleClick(e) {
    // close the overlay if user clicks anywher outside the overlay
    if (!e.target.closest(`.dropdown`) && open) {
      setOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  });

  return (
    <div className="dropdown relative inline-block max-w-[4rem] h-8">
      {/* indicate if status filter is applied by showing black wide borders */}
      <RoundedBadge
        text="Seats"
        className={
          'border border-[#bfbfbf80] hover:border-2' +
          (globalCheckedStatus.length != 0 ? ' border-2 border-black' : '')
        }
        onClick={() => setOpen((open) => !open)}
      />

      <div
        className={
          (open
            ? 'top-full opacity-100 visible'
            : 'top-[110%] invisible opacity-0') +
          'absolute flex flex-col space-y-[0.125rem] justify-center left-0 z-40 mt-2 w-60 rounded-lg border border-[#eaeaea] bg-white px-2 pt-2 pb-[0.125rem] shadow-card transition-all'
        }
      >
        {statusData.map(({ status, iconColor }) => (
          <StatusCheckBox
            text={status}
            iconColor={iconColor}
            toggle={(checked) => {
              setCheckedStatus((prev) =>
                checked ? [...prev, status] : prev.filter((el) => el != status)
              );
            }}
            checked={checkedStatus.includes(status)}
            key={'seat-filter-' + status}
          />
        ))}

        <div className="pt-2">
          <hr />
        </div>
        <div className="flex space-x-16 items-center justify-around py-3">
          <button
            className="heading-xxs text-[#999999]"
            onClick={() => setCheckedStatus([])}
          >
            Clear
          </button>
          <button
            className="bg-black text-white rounded-[1.375rem] px-5 py-2"
            onClick={() => {
              setOpen(false);
              setGlobalCheckedStatus(checkedStatus);
            }}
          >
            <p className="heading-xxs">Save</p>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * @param {{text: string, toggle: Function, checked: boolean}} param
 */
const TagCheckBox = ({ text, toggle, checked }) => {
  return (
    <label
      className="flex items-center cursor-pointer select-none"
      htmlFor={'check-tag-' + text}
    >
      <input
        type="checkbox"
        id={'check-tag-' + text}
        name="tag-checks"
        className="sr-only"
        value={text}
        checked={checked}
        onChange={(e) => {
          toggle(e.target.checked);
        }}
      />
      <RoundedBadge
        text={text}
        className={
          'bg-[#f2f2f2] hover:border-2' +
          (checked ? ' border-2 border-black' : '')
        }
      />
    </label>
  );
};

/**
 * @param {{tags: Object.<string, number>, checkedTags: string[], setCheckedTags: Function, checkedStatus: string[], setCheckedStatus: Function}} param
 */
const Filters = ({
  tags,
  checkedTags,
  setCheckedTags,
  checkedStatus,
  setCheckedStatus,
}) => {
  return (
    <div className="flex space-x-2 items-center scrollbar-none">
      <DropDownButton
        globalCheckedStatus={checkedStatus}
        setGlobalCheckedStatus={setCheckedStatus}
      />
      <p className="p-1 text-[#eaeaea]">|</p>
      {Object.keys(tags).map((tag) => (
        <TagCheckBox
          key={'tag-' + tag}
          text={tag}
          checked={checkedTags.includes(tag)}
          toggle={(checked) => {
            setCheckedTags((prev) =>
              checked ? [...prev, tag] : prev.filter((el) => el != tag)
            );
          }}
        />
      ))}
    </div>
  );
};

export default Filters;
