import { CheckIcon } from "../../../ui/Icons";
import Button from "../../../ui/Button";

/**
 * DoneStep – step 3 of password recovery: success confirmation with a
 * "Sign In" button that returns to the login form.
 */
const DoneStep = ({ onSignIn }) => (
  <div className="text-center py-4">
    <div className="relative w-16 h-16 mx-auto mb-4">
      <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-xl" />
      <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center mx-auto">
        <CheckIcon className="w-8 h-8 text-white" strokeWidth={3} />
      </div>
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">Password Reset!</h3>
    <p className="text-sm text-slate-500 mb-6">
      Your password has been updated successfully. You can now sign in.
    </p>
    <Button onClick={onSignIn}>Sign In</Button>
  </div>
);

export default DoneStep;
