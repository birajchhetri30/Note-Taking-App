import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

export default function Note({ note, onEdit, onDelete }) {
    return (
        <div
            className="relative flex flex-col justify-between h-[300px] p-4 bg-primary-300 border-3 border-secondary-300 rounded-[8px] shadow-lg
            transition-all duration-300 transform 
             group-hover/note:brightness-100 
             group-hover/note:hover:brightness-115 group-hover/note:hover:scale-105"
        >
            <div>
                <h3
                    className="text-2xl text-secondary-400 overflow-hidden"
                >
                    {note.title}
                </h3>

                <hr className="border border-secondary-100 my-1" />

                <p
                    className="text-md text-secondary-400 mt-2 overflow-hidden"
                >
                    {note.content}
                </p>
            </div>

            <div className="flex items-center justify-between">
                <small
                    className="text-secondary-300"
                >
                    {new Date(note.updated_at).toLocaleString()}
                </small>

                <div className="flex gap-2">
                    <MdEdit
                        className="text-secondary-400 cursor-pointer text-xl hover:brightness-170"
                        onClick={() => onEdit(note)}

                    />

                    <MdDelete
                        className="text-secondary-400 cursor-pointer text-xl hover:brightness-170"
                        onClick={() => onDelete(note.id)}
                    />
                </div>
            </div>
        </div>

    );
}