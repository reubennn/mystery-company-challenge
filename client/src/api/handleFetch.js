/**
 * Handle fetch function wrapper to handle interrupted HTTP fetch requests.
 *
 * - If the AbortController signal is aborted (ie, through a component
 * unmount).
 *
 * @param {AbortController} controller AbortController used to cancel fetch
 * @param {Function} operations fetch operations to perform
 * @return {*} HTTP response object or null if empty or aborted
 */
export const handleFetchWithController = async (controller, operations) => {
    try {
        /**
         * We could set the loading state here, or within the Component
         * that calls this function.
         */
        return await operations(controller);
    } catch (error) {
        return null;
    } finally {
        if (!controller.signal.aborted) {
            /**
             * We could set the loading state here, or within the Component
             * that calls this function.
             */
        }
    }
};
