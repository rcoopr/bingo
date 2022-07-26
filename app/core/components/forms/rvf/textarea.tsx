import clsx from "clsx";
import { useField } from "remix-validated-form";

type TextareaRVFProps = {
  name: string;
  label: string;
  textareaClass?: React.HTMLAttributes<HTMLDivElement>["className"];
};

export const TextareaRVF = ({
  name,
  label,
  textareaClass,
}: TextareaRVFProps) => {
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

      <textarea
        {...getInputProps({ id: name })}
        className={clsx(
          textareaClass,
          "textarea h-36 border-0 highlight-b",
          error && "highlight-error focus:outline-error"
        )}
        placeholder=" "
      />
    </div>
  );
};
