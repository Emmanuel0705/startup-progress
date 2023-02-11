import React, { FC } from "react";

interface ICONFIRM {
    message: string;
    onCancel: Function;
    onAllow: Function;
}
const ConfirmDialog: FC<ICONFIRM> = (props: ICONFIRM) => {
    const { message, onAllow, onCancel } = props;
    return (
        <div className="bg-white fixed h-screen w-screen max-h-full inset-0 flex  justify-center bg-opacity-50  overflow-hidden  z-40">
            <div
                className="max-w-sm h-fit bg-white border mt-4 rounded-md shadow-lg p-5"
                role="alert"
            >
                <div className="flex">
                    <div className="flex-shrink-0">🔔</div>
                    <div className="ml-4">
                        <h3 className="text-gray-800 font-semibold ">
                            App notifications
                        </h3>
                        <div className="mt-1 text-sm text-gray-600 min-w-fit ">
                            {message}
                        </div>
                        <div className="mt-4">
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => onCancel()}
                                    type="button"
                                    className="inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-medium text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
                                >
                                    Don't allow
                                </button>
                                <button
                                    onClick={() => onAllow()}
                                    type="button"
                                    className="inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-medium text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
                                >
                                    Allow
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ConfirmDialog;
