import clsx from "clsx";

export const Label = (props: JSX.IntrinsicElements["label"]) => {
  const { className, ...inputProps } = props;
  return (
    <label
      className={clsx(
        className,
        "small-caps mb-1 block text-sm font-bold text-slate-700"
      )}
      {...inputProps}
    />
  );
};
