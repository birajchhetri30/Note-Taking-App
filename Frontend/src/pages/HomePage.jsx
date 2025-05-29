import { useEffect, useState } from 'react';
import api from '../services/api';
import { getToken, removeToken } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import NoteList from '../components/NoteList';
import Modal from 'react-modal';
import AddNoteModal from '../components/AddNoteModal';
import NavBar from '../components/NavBar';

Modal.setAppElement('#root');

export default function HomePage() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState([]);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('DESC');
    const [selectedCategories, setSelectedCategories] = useState([]);


    const navigate = useNavigate();

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const params = {
                search,
                sortBy,
                order: sortOrder,
            };

            if (categoryId.length > 0) {
                params.categoryId = categoryId.join(',');
            }

            const res = await api.get('/notes', { params });
            setNotes(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to fetch notes');
            if (err.response?.status === 401) {
                removeToken();
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = getToken();
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        fetchNotes();
    }, [search, sortBy, sortOrder, categoryId]);

    const handleNoteCreated = (newNote) => {
        setNotes(prev => [...prev, newNote]);
        fetchNotes();
    }

    const handleSearch = (query) => {
        setSearch(query);
    }

    const handleFilterChange = (categoryIds) => {
        setCategoryId(categoryIds);
        setSelectedCategories(categoryIds);
    }

    const handleSortChange = (sortField) => {
        const newSortOrder = sortBy === sortField
            ? (sortOrder === 'ASC' ? 'DESC' : 'ASC')
            : 'DESC';

        setSortBy(sortField);
        setSortOrder(newSortOrder);
    }

    if (loading) return <p>Loading notes...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <NavBar
                search={search}
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                sortBy={sortBy}
                sortOrder={sortOrder}
                selectedCategoryIds={selectedCategories}
            />

            <h2>Your Notes</h2>

            <NoteList notes={notes} refreshNotes={fetchNotes} />

            <button onClick={() => setModalIsOpen(true)}>+ New Note</button>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel='Add note'
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
                    onClose={() => setModalIsOpen(false)}
                    onNoteCreated={handleNoteCreated}
                />
            </Modal>


        </div>
    )
}