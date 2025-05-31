import { useState } from 'react';
import Note from './Note';
import api from '../services/api';
import Modal from 'react-modal';
import AddNoteModal from './AddNoteModal';

export default function NoteList({ notes, refreshNotes }) {
    if (notes.length === 0) {
        return <p>No notes found</p>;
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);

    const openEditModal = (note) => {
        setEditingNote(note);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingNote(null);
    };

    const handleNoteSaved = () => {
        closeModal();
        if (refreshNotes) refreshNotes();
    };

    const handleDelete = async (noteId) => {
        if (window.confirm("Delete this note?")) {
            try {
                await api.delete(`/notes/${noteId}`);
                if (refreshNotes) refreshNotes();
            } catch (err) {
                alert("Failed to delete note");
                console.error(err);
            }
        }
    };

    return (
        <div className='p-6 m-1'>
            <div className='flex flex-wrap gap-x-10 gap-y-8 justify-center'>
                {notes.map((note) => (
                    <div key={note.id} className='w-1/4 group/note transition-all duration-300'>
                        <Note
                            key={note.id}
                            note={note}
                            onEdit={openEditModal}
                            onDelete={handleDelete} />
                    </div>
                ))}
            </div>

            <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                contentLabel='Edit note'
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0,0,0,0.2)',
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '400px',
                        padding: '20px',
                        backgroundColor: 'black',
                    }
                }}
            >
                <AddNoteModal
                    onClose={closeModal}
                    onNoteUpdated={handleNoteSaved}
                    note={editingNote}
                />
            </Modal>
        </div>

    );
}