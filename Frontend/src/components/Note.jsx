import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

export default function Note({ note, onEdit, onDelete }) {
    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: 'black',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'relative'
        }}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>
                Created: {new Date(note.created_at).toLocaleString()}
            </small>

            <div
                style={{
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    display: "flex",
                    gap: "8px",
                }}
            >
                <MdEdit 
                    onClick={() => onEdit(note)}
                    style={{
                        padding: "1px",
                        color: "white",
                        cursor: "pointer",
                    }}
                />
                
                <MdDelete
                    onClick={() => onDelete(note.id)}
                    style={{
                        padding: "1px",
                        color: "white",
                        cursor: "pointer",
                    }}
                />
            </div>
        </div>

    );
}