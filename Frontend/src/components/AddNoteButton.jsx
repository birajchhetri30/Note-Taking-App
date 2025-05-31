import { FaEdit } from "react-icons/fa";

export default function AddNoteButton({setModalIsOpen}) {
    return (
        <div
            className="fixed bottom-6 right-6 rounded-full bg-secondary-300 border-2 border-primary-200 p-5 cursor-pointer hover:brightness-120"
            onClick={() => setModalIsOpen(true)}
        >
            <FaEdit className="text-2xl text-primary-200"/>
        </div>
    )
}