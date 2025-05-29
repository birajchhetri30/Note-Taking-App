export default function Note({note}) {
    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            backgroundColor: 'black',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>
                Created: {new Date(note.created_at).toLocaleString()}
            </small>
        </div>

    );
}