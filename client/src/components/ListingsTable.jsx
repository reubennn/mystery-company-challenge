/* eslint-disable indent */
import React, { useState, useEffect, useRef } from "react";
import useApi from "../hooks/useApi";

import Input from "./Input";

import * as S from "../styles/styled-components/styled.main";

/**
 * React Component which fetches data from the PostgreSQL database, and
 * displays it inside a table.
 *
 * - The message in each row of data is hidden.
 * - When a user presses the reveal button, a modal is displayed, prompting
 * a PIN number.
 * - A request is sent to the server API to validate the PIN.
 * - If the PIN matches the records in the database, the message is displayed.
 * - If not, an error is thrown and the user is notified of unauthorized access.
 *
 * - This Component uses a lot of useState Hook references.
 * - We could significantly reduce the complexity of this Component
 * by implementing the useReducer Hook instead and dispatching actions
 * to modify the state.
 *
 * - Table reference from: https://www.w3schools.com/html/html_tables.asp
 * - colgroup column width found from: https://stackoverflow.com/a/928859
 * - Date in ISO 8601 format: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
 *
 * @return {Component} the listings table for the Listings page
 */
const ListingsTable = () => {
    /** useRef Mount status for cleanup and avoiding memory leaks  */
    const isMounted = useRef(true);

    /** State which contains the listings when loaded from the database */
    const [listings, setListings] = useState([]);

    /** Used to monitor the fetch requests */
    const [listFetchResult, setListFetchResult] = useState({
        success: false,
        failure: false,
    });
    const [msgFetchResult, setMsgFetchResult] = useState({
        success: false,
        failure: false,
    });

    /** Flag to display the modal */
    const [displayModal, setDisplayModal] = useState(false);
    const [currentEntry, setCurrentEntry] = useState({
        created: "",
        name: "",
        message: null,
    });

    /** Store the input PIN inside the modal */
    const [pin, setPin] = useState({ value: "", isValid: true });

    /**
     * Unauthorised flag when the PIN entered is incorrect.
     * - This allows us to display an appropriate error message to the user.
     */
    const [unauthorized, setUnauthorized] = useState(false);

    const SERVER_URL =
        process.env.REACT_APP_SERVER_URL || "http://localhost:9000";

    /** URL and options for useApi Hook */
    const LIST_REQUEST_URL = `${SERVER_URL}/api/list`;
    const LIST_REQUEST_OPTIONS = { method: "GET" };
    const MESSAGE_REQUEST_URL = `${SERVER_URL}/api/get-message`;
    const MESSAGE_REQUEST_OPTIONS = { method: "GET" };

    /** Custom Hook to handle API HTTP request for getting the listings */
    const { state: listApiRequestState, apiRequest: listApiRequest } = useApi(
        LIST_REQUEST_URL,
        LIST_REQUEST_OPTIONS,
    );

    /** Custom Hook to handle API HTTP request for getting a message */
    const {
        state: msgApiRequestState,
        apiRequest: msgApiRequest,
        apiRequestWithUrl: msgApiRequestWithUrl,
        url: msgApiRequestUrl,
    } = useApi(MESSAGE_REQUEST_URL, MESSAGE_REQUEST_OPTIONS);

    /**
     * useEffect which performs cleanup, setting isMounted to false.
     *
     * - This ensures subscriptions and async tasks are cancelled
     * while the component is unmounted.
     */
    useEffect(() => {
        if (!listFetchResult.success) {
            listApiRequest();
        }
        return () => {
            isMounted.current = false;
        };
    }, []);

    /**
     * useEffect triggered when the list fetch failure flag changes.
     *
     * - If the fetch failed, set a timeout to try to reset the
     * flag state and try the fetch again every five seconds.
     */
    useEffect(() => {
        let timeout;
        if (isMounted.current && listFetchResult.failure) {
            /**
             * Function called when the timeout occurs.
             * - Reset the fetch flags.
             * - Try to perform the API request again.
             */
            const resetFetch = () => {
                if (isMounted.current) {
                    setListFetchResult({
                        success: false,
                        failure: false,
                    });
                }
                listApiRequest();
            };
            timeout = setTimeout(() => resetFetch(), 5000);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [listFetchResult.failure]);

    /**
     * useEffect triggered when the message fetch failure flag changes.
     *
     * - If the fetch failed, we will display an error message, which
     * we want to hide again after five seconds.
     */
    useEffect(() => {
        let timeout;
        if (isMounted.current && msgFetchResult.failure) {
            /**
             * Function called when the timeout occurs.
             * - Reset the fetch flags.
             * - Try to perform the API request again.
             */
            const resetFetch = () => {
                if (isMounted.current) {
                    setMsgFetchResult({
                        success: false,
                        failure: false,
                    });
                }
            };
            timeout = setTimeout(() => resetFetch(), 5000);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [msgFetchResult.failure]);

    /**
     * useEffect triggered when the fetch failure flag changes.
     *
     * - If the PIN was incorrect, set a timeout reset the flag
     * to hide the message after five seconds.
     */
    useEffect(() => {
        let timeout;
        if (isMounted.current && unauthorized) {
            /**
             * Function called when the timeout occurs.
             * - Reset the fetch flags.
             * - Try to perform the API request again.
             */
            const resetFetch = () => {
                if (isMounted.current) {
                    setUnauthorized(false);
                }
                listApiRequest();
            };
            timeout = setTimeout(() => resetFetch(), 5000);
        }
        return () => {
            clearTimeout(timeout);
        };
    }, [unauthorized]);

    /**
     * useEffect which is triggered when the listApiRequestState has changed,
     * either if we receive a response from the server,
     * or an error has occurred.
     */
    useEffect(() => {
        if (listApiRequestState.data !== null) {
            const { response, body } = listApiRequestState.data;
            if (response.status !== 200 && isMounted.current) {
                setListFetchResult({
                    success: false,
                    failure: true,
                });
            } else if (isMounted.current) {
                setListings(body);
                setListFetchResult({
                    success: true,
                    failure: false,
                });
            }
        } else if (listApiRequestState.error !== null && isMounted.current) {
            setListFetchResult({
                success: false,
                failure: true,
            });
        }
    }, [listApiRequestState]);

    /**
     * useEffect which is triggered when the listApiRequestState has changed,
     * either if we receive a response from the server,
     * or an error has occurred.
     */
    useEffect(() => {
        if (msgApiRequestState.data !== null) {
            const { response, body } = msgApiRequestState.data;
            if (response.status === 401 && isMounted.current) {
                setUnauthorized(true);
            } else if (response.status !== 200 && isMounted.current) {
                if (isMounted.current) {
                    setMsgFetchResult({
                        success: false,
                        failure: true,
                    });
                }
            } else if (isMounted.current) {
                setCurrentEntry((prevState) => {
                    return {
                        ...prevState,
                        message: body.message,
                    };
                });
                setUnauthorized(false);
                setMsgFetchResult({
                    success: true,
                    failure: false,
                });
            }
        } else if (msgApiRequestState.error !== null && isMounted.current) {
            setMsgFetchResult({
                success: false,
                failure: true,
            });
        }
    }, [msgApiRequestState]);

    /**
     * useEffect triggered if PIN number isValid flag or input value changes.
     *
     * - If the PIN already has four digits and a user tries to enter another
     * digit, an error helper message will be displayed as a form of feedback
     * to the user.
     * - We can use a timeout to reset the invalid status so the message
     * disappears after a short time.
     * - We must account for the edge case where a user tries to enter a fifth
     * digit, the error message shows and then they backspace so there is less
     * than four digits. In this instance, we do not want the timeout to reset
     * the invalid status (does not meet four digit criteria).
     *      - We account for this by triggering this useEffect when the value
     *      changes.
     *      - We perform a check to ensure the PIN number is valid.
     *      - If it isn't, the timeout we were waiting on is essentially
     *      cancelled out and the error message remains until rectified.
     */
    useEffect(() => {
        let timeout;
        /** The timeout is only ever created if the PIN is invalid */
        if (isMounted.current && !pin.isValid) {
            /**
             * Function which is called when the timeout has occurred.
             * - Checks the PIN state is invalid and if the isValid flag
             * indicates it is also invalid.
             * - If checks pass, we can reset the isValid flag.
             */
            const resetInvalidFlag = () => {
                if (!pin.isValid && isValid(pin.value) && isMounted.current) {
                    setPin((prevState) => {
                        return {
                            ...prevState,
                            isValid: true,
                        };
                    });
                }
            };
            if (pin.value.length === 4) {
                /** Create the timeout if the number of digits is four */
                timeout = setTimeout(() => resetInvalidFlag(), 2000);
            }
        }
        /**
         * Cleanup function to avoid memory leaks.
         */
        return () => {
            clearTimeout(timeout); // Clear the timeout.
        };
    }, [pin.isValid, pin.value]);

    /**
     * Function which is called to update the form state
     * dynamically depending on the input property supplied.
     *
     * - Checks if the input is valid for the field and updates
     * the isValid flag accordingly.
     * - Note we do not actually need the input value here
     * as we are only dealing with the PIN number.
     *      - We need to keep this input to allow this function
     *      to work correctly with the Input Component.
     *
     * @param {String} input the input property name
     * @param {String} value the new value to set
     */
    const updatePin = (input, value) => {
        /**
         * Ensure the PIN is not greater than 4 digits.
         * - This check ensures the user is unable to enter
         * any more than four digits.
         */
        if (value.length <= 4) {
            setPin((prevState) => {
                return {
                    ...prevState,
                    value,
                };
            });
        }
        /** Flag the input field as invalid, or not */
        if (pin.isValid && !isValid(value)) {
            setPin((prevState) => {
                return {
                    ...prevState,
                    isValid: false,
                };
            });
        } else if (!pin.isValid && isValid(value)) {
            /** The  */
            setPin((prevState) => {
                return {
                    ...prevState,
                    isValid: true,
                };
            });
        }
    };

    /**
     * Helper function to check if an input value is valid.
     *
     * @param {String} value the new value to set
     * @return {Boolean} is valid or not
     */
    const isValid = (value) => {
        /** Check if the input value is empty */
        if (value.trim() === "") return false;
        /** The PIN must be 4 digits */
        return value.length === 4;
    };

    /**
     * Function called when a reveal button is pressed.
     * - The current entry is updated to the state depending
     * on which button was pressed.
     * - This allows us to know exactly which entry we need
     * to enter the PIN for, so we can prompt our users.
     *
     * @param {Object} row the database entry row of data
     */
    const onReveal = (row) => {
        setCurrentEntry({
            created: row.created,
            name: row.name,
            message: null,
        });
        setUnauthorized(false);
        setDisplayModal(true);
    };

    /**
     * Function used to close the modal and reset the pin state.
     * - Triggered when a user presses the close button inside
     * the modal.
     */
    const closeModal = () => {
        setDisplayModal(false);
        setPin({
            value: "",
            isValid: true,
        });
    };

    /**
     * Function called when a four digit PIN number has been
     * entered in the modal, and a user presses the submit button.
     * - We perform an API request to the server with the user name,
     * creation date/time and the PIN specified.
     * - The server will perform checks to ensure that the PIN entered
     * matches the records in the database.
     * - If the PIN matches, the corresponding message is displayed,
     * otherwise an error is thrown specifying unauthorized access.
     */
    const onPinSubmit = () => {
        /** Do not do anything if the PIN is not four digits */
        if (pin.value.length === 4) {
            /** First, we need to generate the appropriate URL */
            /** Convert the name into something usable by a URL */
            const URL_FRIENDLY_NAME = currentEntry.name.replace(" ", "+");
            const URL =
                `${MESSAGE_REQUEST_URL}` +
                `/${URL_FRIENDLY_NAME}/${currentEntry.created}/${pin.value}`;

            if (msgApiRequestUrl !== URL) {
                /**
                 * If the URL does not match the Hook URL,
                 * then update the url before sending the request.
                 */
                msgApiRequestWithUrl(URL);
            } else {
                /**
                 * The URL is the same as the last request,
                 * so we just need to trigger another API request.
                 */
                msgApiRequest();
            }
        }
    };

    /**
     * Pin input JSX Component for the modal, so the user
     * can enter the PIN.
     *
     * - Helps make the return() function a bit cleaner.
     *
     * @return {JSX} component for the PIN input
     */
    const pinInputJSX = (
        <>
            <S.Header as="h3">PIN:</S.Header>
            <Input
                className="modal"
                input={pin}
                inputName="pin"
                type="number"
                placeholder="1234"
                onChangeHandler={updatePin}
                onBlur={updatePin}
                invalidTextHelper="The PIN must be four digits."
            />
            <S.Button className="uppercase" onClick={() => onPinSubmit()}>
                Submit
            </S.Button>
            <S.InvalidInputHelper
                className={unauthorized ? "modal show" : "modal"}>
                Incorrect PIN. Unauthorized access.
            </S.InvalidInputHelper>
            <S.InvalidInputHelper
                className={msgFetchResult.failure ? "modal show" : "modal"}>
                An error occurred while validating the PIN. <br />
                Please try again later.
            </S.InvalidInputHelper>
        </>
    );

    /**
     * Secret message JSX Component for the modal.
     * - Displays if the PIN entered has been authenticated with the Server API.
     *
     * - Helps make the return() function a bit cleaner.
     *
     * @return {JSX} component for the PIN input
     */
    const secretMessageJSX = (
        <>
            <S.Header as="h3">Secret Message:</S.Header>
            <p className="center-text">{currentEntry.message}</p>
            <S.Button className="uppercase" onClick={() => closeModal()}>
                Done
            </S.Button>
        </>
    );

    return (
        <>
            {displayModal && (
                <S.ModalBackground>
                    <S.CenterInViewport>
                        <S.Modal>
                            <S.Button className="close" onClick={closeModal}>
                                <S.CloseCross />
                                <S.CloseCross shift />
                            </S.Button>
                            <S.Header as="h2" fontSize="1.15rem">
                                Please enter authorisation <b>PIN</b> to view
                                the <b>message</b> for the following entry:
                            </S.Header>
                            <p className="center-text">
                                <b>Name:</b> {currentEntry.name}
                            </p>
                            <p className="center-text">
                                <b>Date/Time:</b> {currentEntry.created}
                            </p>
                            <br />
                            {currentEntry.message !== null &&
                            currentEntry.message !== undefined
                                ? secretMessageJSX
                                : pinInputJSX}
                        </S.Modal>
                    </S.CenterInViewport>
                </S.ModalBackground>
            )}
            <S.TableContainer>
                <S.ExportButton>Export</S.ExportButton>
                <S.Table>
                    {/* Set the width for each column */}
                    <colgroup>
                        <S.Column span="1" width="30%" />
                        <S.Column span="1" width="20%" />
                        <S.Column span="1" width="50%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <S.TableHeader>Date / Time</S.TableHeader>
                            <S.TableHeader>Name</S.TableHeader>
                            <S.TableHeader>Message</S.TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {listings.length !== undefined ? (
                            listings.map((row, key) => (
                                <S.TableRow
                                    key={row.id !== null ? row.id : key}>
                                    <S.TableData>{row.created}</S.TableData>
                                    <S.TableData>{row.name}</S.TableData>
                                    <S.TableData>
                                        {row.created === currentEntry.created &&
                                        row.name === currentEntry.name &&
                                        currentEntry.message !== null &&
                                        currentEntry.message !== undefined ? (
                                            <p>{currentEntry.message}</p>
                                        ) : (
                                            <S.Button
                                                className="reveal"
                                                onClick={() => onReveal(row)}>
                                                Reveal
                                            </S.Button>
                                        )}
                                    </S.TableData>
                                </S.TableRow>
                            ))
                        ) : (
                            <S.TableRow>
                                <S.TableData>...</S.TableData>
                                <S.TableData>...</S.TableData>
                                <S.TableData>...</S.TableData>
                            </S.TableRow>
                        )}
                    </tbody>
                </S.Table>
                {!listFetchResult.success && !listFetchResult.failure && (
                    <S.Header as="h2" fontSize="1rem">
                        Attempting to fetch the data from the database...
                    </S.Header>
                )}
                {!listFetchResult.success && listFetchResult.failure && (
                    <S.Header as="h2" fontSize="1rem">
                        An error occurred. <br />
                        Unable to fetch data from the database at this time.
                    </S.Header>
                )}
                <S.Button className="uppercase">Export</S.Button>
            </S.TableContainer>
        </>
    );
};

export default ListingsTable;
