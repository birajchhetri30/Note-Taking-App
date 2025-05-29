import Note from './Note';

export default function NoteList({notes}) {
    if (notes.length === 0) {
        return <p>No notes found</p>;
    }

    return (
        <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'flex-start', 
        }}>
            {notes.map((note) => (
                <Note key={note.id} note={note}/>
            ))}
        </div>
    );
}