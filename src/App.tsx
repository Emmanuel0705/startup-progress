import React, { FC, useState } from "react";
import Confirm from "./components/Confirm";
import Toast from "./components/Toast";
import useLocalStorage from "./hooks/useLocalStorage";
import TASKS from "./tasks.json";
import { fetchMessage, MESSAGES } from "./utils";

// Define the Phase interface
interface IPhase {
    name: string;
    tasks: Array<ITask>;
    isCompleted: boolean;
}

// Define the Task interface
interface ITask {
    name: string;
    isCompleted: boolean;
}

const App: FC = () => {
    // State for Confirm component's message
    const [confirmationMessage, setConfirmationMessage] = useState<
        string | undefined
    >("");
    // State for Toast component's message
    const [toastMessage, setToastMessage] = useState<string | undefined>("");
    // State to store the index of the task which the user is trying to undo
    const [uncheckedIndexes, setUncheckedIndexes] = useState<{
        phaseIndex: number;
        taskIndex: number;
    }>({ phaseIndex: 0, taskIndex: 0 });

    // State for the phases, using the useLocalStorage hook to store the data in local storage
    const [phases, setPhases] = useLocalStorage<Array<IPhase>>("phases", TASKS);

    // Function to set the specified task to incomplete, and all the tasks after it to incomplete
    const handleClearTask = (phaseIndex: number, taskIndex: number): void => {
        const updatedPhases: Array<IPhase> = [...phases];
        const currentPhaseTasks: Array<ITask> = [
            ...updatedPhases[phaseIndex].tasks,
        ];

        // Set the task at the specified taskIndex to incomplete
        currentPhaseTasks[taskIndex].isCompleted = false;

        // Set all tasks after the specified task to incomplete
        for (let i = taskIndex + 1; i < currentPhaseTasks.length; i++) {
            currentPhaseTasks[i].isCompleted = false;
        }
        // Set the phase at the specified taskIndex to incomplete
        updatedPhases[phaseIndex].isCompleted = false;

        // Set all phases after the current phase to incomplete
        for (let i = phaseIndex + 1; i < updatedPhases.length; i++) {
            updatedPhases[i].isCompleted = false;
            updatedPhases[i].tasks.forEach(
                (task) => (task.isCompleted = false)
            );
        }

        // Update the state with the updated phases
        setPhases(updatedPhases);
    };

    function handleTaskComplete(phaseIndex: number, taskIndex: number): void {
        // Create a copy of the `phases` array
        const updatedPhases: Array<IPhase> = [...phases];
        // Create a copy of the tasks of the current phase
        const updatedTasks: Array<ITask> = [...updatedPhases[phaseIndex].tasks];
        // Get the index of the previous phase
        const previousPhase: number = phaseIndex - 1;

        // Check if the previous phase exists and if it's completed
        if (previousPhase >= 0 && !phases[previousPhase]?.isCompleted) {
            handleSetToastMessage(MESSAGES.taskMustBeCompleted);
            return;
        }

        // Check if the task is already completed
        if (updatedTasks[taskIndex].isCompleted) {
            setConfirmationMessage(MESSAGES.confirmUndo);
            setUncheckedIndexes({ phaseIndex, taskIndex });
            return;
        }

        // Mark the task as completed or not completed
        updatedTasks[taskIndex].isCompleted =
            !updatedTasks[taskIndex].isCompleted;

        // Check if all tasks in the current phase are completed
        updatedPhases[phaseIndex].isCompleted = updatedTasks.every(
            (task) => task.isCompleted
        );

        // Update the `phases` array
        setPhases(updatedPhases);

        // Check if the task is the last task in the last phase
        if (
            phases.length === phaseIndex + 1 &&
            updatedTasks.every((e: ITask) => e.isCompleted)
        ) {
            handleFetchMessage();
        }
    }

    // Function to handle the confirmation message
    const handleConfirm = (): void => {
        // Get the phase and task index from `uncheckedIndexes`
        const { phaseIndex, taskIndex } = uncheckedIndexes;
        handleClearTask(phaseIndex, taskIndex);
        setConfirmationMessage(undefined);
    };

    // Function to set the toast message
    const handleSetToastMessage = (message: string): void => {
        setToastMessage(message);
        // Clear the toast message after 4 seconds
        setTimeout(() => {
            setToastMessage(undefined);
        }, 4000);
    };

    // Async function to fetch the message
    const handleFetchMessage = async () => {
        setToastMessage(MESSAGES.wait);
        // Fetch the data from the URL
        const message = await fetchMessage();
        handleSetToastMessage(message);
    };

    return (
        <div className="bg-slate-200 h-screen py-6">
            <div className="bg-white m-auto p-10 w-full max-w-sm ">
                <h1 className="text-xl font-extrabold mb-6">
                    My startup progress
                </h1>
                {confirmationMessage ? (
                    <Confirm
                        message={confirmationMessage}
                        onAllow={() => handleConfirm()}
                        onCancel={setConfirmationMessage}
                    />
                ) : (
                    <></>
                )}
                {toastMessage ? <Toast message={toastMessage} /> : <></>}
                <div className="flex-col flex gap-3">
                    {phases.map((phase: IPhase, phaseIndex: number) => (
                        <div className="" key={phase.name}>
                            <div className="flex justify-between my-3">
                                <div className="flex gap-3">
                                    <span className="bg-black rounded-full p-1 inline-flex items-center justify-center text-sm text-white h-6 w-6">
                                        {phaseIndex + 1}
                                    </span>
                                    <h3 className="font-bold">{phase.name}</h3>
                                </div>
                                {phase.isCompleted ? <span>✔️</span> : <></>}
                            </div>
                            <ul>
                                {phase.tasks.map((task, taskIndex) => (
                                    <li
                                        className="hover:bg-blue-100 m-1 flex gap-x-2 items-center cursor-pointer "
                                        key={task.name}
                                    >
                                        <input
                                            onChange={() =>
                                                handleTaskComplete(
                                                    phaseIndex,
                                                    taskIndex
                                                )
                                            }
                                            type="checkbox"
                                            className=""
                                            checked={task.isCompleted}
                                            id={task.name}
                                        />
                                        <label
                                            htmlFor={task.name}
                                            className="text-sm"
                                        >
                                            {task.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default App;
