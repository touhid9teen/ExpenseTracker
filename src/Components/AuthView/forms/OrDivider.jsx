/**
 * OrDivider – thin "Or Continue With" separator shown between the submit
 * button and the social sign-in button in both auth forms.
 */
const OrDivider = () => (
  <div className="flex items-center gap-3 py-1">
    <span className="flex-1 border-t border-slate-200" />
    <span className="text-xs text-slate-400 font-medium">Or Continue With</span>
    <span className="flex-1 border-t border-slate-200" />
  </div>
);

export default OrDivider;
