const LoadingParagraph = ({ className = '' }) => (
  <div
    className={
      'w-[9.5rem] h-[0.875rem] bg-[#f2f2f2] rounded-[0.1875rem] ' + className
    }
    role="presentation"
  ></div>
);

const LoadingInfoWithIcon = () => (
  <span className="flex space-x-2 items-center">
    <div className="h-[1.125rem] w-[1.125rem] bg-[#f2f2f2] rounded-full" />
    <LoadingParagraph className="w-[6.25rem]" />
  </span>
);

const LoadingEvent = () => (
  <div className="flex w-full p-6 rounded-xl" role="presentation">
    <div className="bg-[#f2f2f2] rounded-lg h-[6.75rem] w-36" />
    <div className="ml-[1.5625rem] pt-2 w-fit">
      <div className="h-5 w-[25rem] bg-[#f2f2f2] rounded-[0.3125rem] mb-[1.0625rem]"></div>
      <div className="flex space-x-3">
        <LoadingParagraph />
        <LoadingParagraph />
      </div>
      <div className="mt-[1.375rem]">
        <div className="flex w-fit space-x-8">
          <LoadingInfoWithIcon />
          <LoadingInfoWithIcon />
        </div>
      </div>
    </div>
  </div>
);

const Loading = () => (
  <div className="flex flex-col space-y-[4.5rem]" role="presentation">
    <div>
      <LoadingParagraph className="ml-[1.6875rem] mb-2" />
      <div className="flex flex-col">
        <LoadingEvent />
        <LoadingEvent />
      </div>
    </div>
    <div>
      <LoadingParagraph className="ml-[1.6875rem] mb-2" />
      <div className="flex flex-col">
        <LoadingEvent />
      </div>
    </div>
  </div>
);

export default Loading;
