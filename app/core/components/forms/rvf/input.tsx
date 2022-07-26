import clsx from "clsx";
import { useField } from "remix-validated-form";

type InputRVFProps = {
  name: string;
  label: string;
  inputClass?: React.HTMLAttributes<HTMLDivElement>["className"];
};

export const InputRVF = ({ name, label, inputClass }: InputRVFProps) => {
  const { error, getInputProps } = useField(name);
  return (
    <div className={"form-control w-full gap-2"}>
      <label htmlFor={name} className="label pb-0 align-baseline">
        <span className="label-text">{label}</span>
        {error && (
          <span className="label-text-alt text-error animate-in fade-in-0">
            {error}
          </span>
        )}
      </label>

      <input
        {...getInputProps({ id: name })}
        className={clsx(
          inputClass,
          "input border-0 highlight-b",
          error && "highlight-error focus:outline-error"
        )}
        placeholder=" "
      />
    </div>
  );
};
