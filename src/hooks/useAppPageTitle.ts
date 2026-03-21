import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";

export type AppShellOutletContext = {
  setPageTitle: (title: string) => void;
};

/**
 * Sets the header title in AuthenticatedLayout. Call at the top of each app page.
 * Clears on unmount so the next route can set its own title.
 */
export function useAppPageTitle(title: string) {
  const { setPageTitle } = useOutletContext<AppShellOutletContext>();
  useEffect(() => {
    setPageTitle(title);
    return () => setPageTitle("");
  }, [title, setPageTitle]);
}
