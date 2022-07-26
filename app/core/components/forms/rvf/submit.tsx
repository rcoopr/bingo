import { useFormContext, useIsSubmitting } from "remix-validated-form";

export const SubmitButtonRVF = () => {
  const isSubmitting = useIsSubmitting();
  const { isValid } = useFormContext();
  const disabled = isSubmitting || !isValid;

  return (
    <button
      type="submit"
      disabled={disabled}
      className={disabled ? "btn btn-disabled" : "btn"}
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
};
