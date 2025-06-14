import { useEffect, useState } from 'react';
import Note from './Note';
import api from '../services/api';
import Modal from 'react-modal';
import AddNoteModal from './AddNoteModal';
import ViewNoteModal from './ViewNoteModal';
import { toast } from 'react-toastify';


export default function NoteList({ notes, refreshNotes }) {
    if (!Array.isArray(notes) || notes.length === 0) {
        return (
            <div className='flex h-[80vh] w-full justify-center items-center'>
                <p className='text-5xl text-primary-200'>No notes found</p>
            </div>
        )
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [viewingNoteId, setViewingNoteId] = useState(null);
    const [confirmDeleteNoteId, setConfirmDeleteNoteId] = useState(null);

    const handleViewNote = (id) => {
        setViewingNoteId(id);
    }

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
        setConfirmDeleteNoteId(noteId);
    };

    const handleConfirmDelete = async () => {
        try {
            await api.delete(`/notes/${confirmDeleteNoteId}`);
            setConfirmDeleteNoteId(null);
            toast.success("Note deleted")
            if (refreshNotes) refreshNotes();
        } catch (err) {
            toast.error("Failed to delete note")
            console.error(err);
        }
    }

    // Because the background was still scrollable when model was open
    useEffect(() => {
        if (modalOpen || viewingNoteId) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [modalOpen, viewingNoteId]);

    return (
        <div className='p-6 m-1 min-h-[80vh]'>
            <div className='flex flex-wrap gap-x-10 gap-y-8 justify-center'>
                {notes.map((note) => (
                    <div key={note.id} className='w-1/4 '>
                        <Note
                            key={note.id}
                            note={note}
                            onEdit={openEditModal}
                            onDelete={handleDelete}
                            onView={handleViewNote}
                        />
                    </div>
                ))}
            </div>

            <Modal
                isOpen={modalOpen}
                onRequestClose={() => setModalOpen(false)}
                contentLabel='Edit note'
                className="modal_style"
                overlayClassName="modal_overlay_style"
            >
                <AddNoteModal
                    onClose={closeModal}
                    onNoteUpdated={handleNoteSaved}
                    note={editingNote}
                />
            </Modal>

            <Modal
                isOpen={!!viewingNoteId}
                onRequestClose={() => setViewingNoteId(null)}
                contentLabel="View note"
                className="modal_style max-h-[90vh] overflow-y-auto"
                overlayClassName="modal_overlay_style"
            >
                <ViewNoteModal
                    noteId={viewingNoteId}
                    buttonText="Close"
                    onClose={() => setViewingNoteId(null)}
                />
            </Modal>

            <Modal
                isOpen={!!confirmDeleteNoteId}
                onRequestClose={() => setConfirmDeleteNoteId(null)}
                contentLabel="Confirm delete"
                className="modal_style max-h-[90vh] overflow-y-auto"
                overlayClassName="modal_overlay_style"
            >
                <ViewNoteModal
                    noteId={confirmDeleteNoteId}
                    buttonText="Delete"
                    onClose={handleConfirmDelete}
                />
            </Modal>

        </div>

    );
}