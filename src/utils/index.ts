// Async function to fetch the message
export const fetchMessage = async (): Promise<string> => {
    //url to fetch message from
    const URL = "https://uselessfacts.jsph.pl/random.json";
    // setToastMessage("wait....");
    // Fetch the data from the URL
    try {
        const res = await fetch(URL);
        const data: { text: string } = await res.json();
        // return text
        return data.text;
        // handleSetToastMessage(data.text);
    } catch (error: any) {
        return error.message;
    }
};

export const MESSAGES = {
    taskMustBeCompleted: "All tasks in the previous phase must be completed!",
    confirmUndo:
        "Are you sure you want to undo this task? all the tasks you've completed after this task will be undo",
    wait: "wait...",
};
