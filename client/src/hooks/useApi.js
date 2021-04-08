import { useState, useEffect, useRef } from "react";
import { handleFetchWithController } from "../api/handleFetch";

/**
 * Custom React Hook which is used to perform a request to the server
 * API endpoint.
 *
 * - Contains shared state values which contain the response, data,
 * any errors etc.
 * - Handles the AbortController inside the hook so we don't need to
 * keep creating one for each API request.
 * - Contains trigger functions to keep performing API requests.
 * - Contains functions to update the URL or provide new options.
 *
 * @param {String} initialUrl API url to call in fetch
 * @param {Object} initialOptions fetch options
 * @return {Object} result of the API call
 *
 * @example
 * // Simple use case of this custom React Hook:
 * Call the url with specified options and assign the resultant state variables:
 * const {
 *      state: result,
 *      apiRequest,
 *      apiRequestWithOptions,
 * } = useApi(url, options);
 *
 * Now we can now access the following:
 *      - result.loading: loading status
 *      - result.error: error if exists
 * ~ Fetch Failure ~
 *      - result.data: null
 * ~ Fetch Success ~
 *      - result.data.response: fetch response
 *      - result.data.body: fetch response body
 *
 * Perform the fetch call again simply by calling apiRequest();
 * Perform the fetch call with new options by calling
 * apiRequestWithOptions(newOptions);
 */
const useApi = (initialUrl, initialOptions = {}) => {
    /** Initial state values */
    const initialState = {
        error: null,
        loading: false,
        data: null,
    };
    const [state, setState] = useState(initialState);
    /** Any options to pass in the request */
    const [options, setOptions] = useState({
        current: initialOptions,
        prev: initialOptions,
    });
    /** The URL for the request */
    const [url, setUrl] = useState({
        current: initialUrl,
        prev: initialUrl,
    });
    /** Flag used to trigger an API call */
    const [callApi, setCallApi] = useState(false);

    /** useRef Mount status for cleanup and avoiding memory leaks  */
    const isMounted = useRef(true);

    /**
     * useEffect which performs cleanup, setting isMounted to false.
     *
     * - This ensures subscriptions and async tasks are cancelled
     * while the component is unmounted.
     */
    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    /**
     * Async useEffect which performs the fetch call to the server API.
     *
     * - We can use an AbortController to cancel a fetch request if
     * it is interrupted (e.g. client leaves the page)
     * - By using an AbortController, we can ensure our React App does not have
     * any memory leaks when a HTTP fetch requests is interrupted.
     * - When the data has been fetched successfully, the state is updated.
     */
    useEffect(() => {
        const controller = new AbortController();
        if (isMounted.current && callApi) {
            (async () => {
                try {
                    if (isMounted.current) {
                        setState({
                            error: null,
                            loading: true,
                            data: null,
                        });
                    }
                    /**
                     * Only add the headers to the response if they
                     * have been assigned.
                     */
                    const headers = options.current.headers !== undefined ?
                        {
                            ...options.current.headers,
                        } : {
                            "Content-Type": "application/json",
                        };
                    const response =
                        await handleFetchWithController(
                            controller, async (controller) => {
                                return await fetch(
                                    url.current,
                                    {
                                        ...options.current,
                                        headers: headers,
                                        signal: controller.signal,
                                    },
                                );
                            });
                    if (response === null && isMounted.current) {
                        /** The fetch failed, so update the state */
                        setState({
                            error: "Data request was unsuccessful.",
                            loading: false,
                            data: null,
                        });
                    } else if (response.status === 200 && isMounted.current) {
                        /** A response was received, so update the state */
                        const body = await response.json();
                        if (isMounted.current) {
                            setState({
                                error: null,
                                loading: false,
                                data: {
                                    response,
                                    body,
                                },
                            });
                        }
                    } else if (response.status !== 200 && isMounted.current) {
                        /** We encountered a different error from the server */
                        setState({
                            error: "Data request was unsuccessful.",
                            loading: false,
                            data: { response: response, body: "" },
                        });
                    }
                } catch (error) {
                    /** An error occurred */
                    if (isMounted.current) {
                        setState({
                            ...state,
                            error,
                            loading: false,
                        });
                    }
                } finally {
                    if (isMounted.current) {
                        /** Reset the callApi flag */
                        setCallApi(false);
                    }
                }
            })();
        }
        return () => {
            controller.abort();
        };
    }, [callApi]);

    /**
     * useEffect called when the HTTP options have been updated.
     *
     * - Perform a check to make sure the previous options are not
     * the same as the current options.
     * - Options are only updated when apiRequestWithOptions is called.
     * - So we need to trigger the API call as soon as the options state
     * has been updated.
     */
    useEffect(() => {
        if (options.current !== options.prev) {
            triggerApiCall();
        }
    }, [options]);

    /**
     * useEffect called when the HTTP options have been updated.
     *
     * - URL is only updated when apiRequestWithUrl is called.
     * - So we need to trigger the API call as soon as the URL state
     * has been updated and does not match the previous value.
     */
    useEffect(() => {
        if (url.current !== url.prev) {
            triggerApiCall();
        }
    }, [url]);

    /**
     * Function which sets the callApi state to true,
     * which in turn triggers the above useEffect to call
     * the API.
     */
    const triggerApiCall = () => {
        if (isMounted.current) {
            setCallApi(true);
        }
    };

    /**
     * Function which updates the HTTP options.
     *
     * - We want to store the previous options too,
     * so we can compare these later on.
     *
     * @param {Object} options HTTP request options to update
     */
    const updateOptions = (options) => {
        if (isMounted.current) {
            setOptions((prevState) => {
                return {
                    prev: { ...prevState.current },
                    current: options,
                };
            });
        }
    };

    /**
     * Function which updates the HTTP request url.
     *
     * @param {Object} url HTTP request url
     */
    const updateUrl = (url) => {
        if (isMounted.current) {
            setUrl((prevState) => {
                return {
                    prev: { ...prevState.current },
                    current: url,
                };
            });
        }
    };

    return {
        state,
        apiRequest: triggerApiCall,
        apiRequestWithOptions: (options) => updateOptions(options),
        apiRequestWithUrl: (url) => updateUrl(url),
        url,
    };
};

export default useApi;
