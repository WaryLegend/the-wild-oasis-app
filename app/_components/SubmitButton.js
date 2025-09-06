"use client";
import { useFormStatus } from "react-dom";

// 482. Displaying loading indicator (Jonas)
export default function SubmitButton({
  children,
  pendingLabel = "Updating...",
}) {
  // useFormStatus can only be use in a component that is rendered inside a form. This special hook is created for us to tracking the "actions" (action runs on the server) while it's working
  // another useFormState ---> use in component that render the form --> handling the error (if has). No more confusion
  const {
    pending, // boolean → is the form currently submitting?
    data, // FormData | undefined → the last submitted form data
    method, // string | undefined → HTTP method used (e.g. "post")
    action, // string | undefined → the form action URL or server action reference
  } = useFormStatus();
  return (
    <button
      className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
      disabled={pending}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
