import React, { FC } from "react";

interface ICONFIRM {
    message: string;
}
const Toast: FC<ICONFIRM> = (props: ICONFIRM) => {
    const { message } = props;
    return (
        <div className="bg-white fixed h-screen w-screen max-h-full inset-0 flex  justify-center bg-opacity-50  overflow-hidden  z-40">
            <div
                className="w-auto max-w-sm bg-white border rounded-md shadow-lg h-fit mt-5"
                role="alert"
            >
                <div className="flex p-4">
                    <div className="flex-shrink-0">⚠️</div>
                    <div className="ml-3">
                        <p className="text-sm text-gray-700 dark:text-gray-400">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Toast;
