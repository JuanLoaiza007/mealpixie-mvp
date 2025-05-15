export default function Screen({ inPageTitle, children, ...props }) {
  return (
    <div className="flex w-full flex-wrap">
      <h1 className="hidden md:block md:my-2 text-2xl font-bold">
        {inPageTitle}
      </h1>
      <div className="flex flex-col lg:flex-row mt-12 w-full gap-2 " {...props}>
        {children}
      </div>
    </div>
  );
}
