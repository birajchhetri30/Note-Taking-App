import { useEffect, useState } from 'react';
import api from '../services/api';
import { getToken, removeToken } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import NoteList from '../components/NoteList';
import Modal from 'react-modal';
import AddNoteModal from '../components/AddNoteModal';
import NavBar from '../components/NavBar';
import AddNoteButton from '../components/AddNoteButton';
import PaginationButton from '../components/PaginationButton';

Modal.setAppElement('#root');

export default function HomePage() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [search, setSearch] = useState('');
    const [categoryId, setCategoryId] = useState([]);
    const [sortBy, setSortBy] = useState('updated_at');
    const [sortOrder, setSortOrder] = useState('DESC');
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [user, setUser] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const notesPerPage = 9;

    const navigate = useNavigate();

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const params = {
                search,
                sortBy,
                order: sortOrder,
                limit: notesPerPage,
                offset: (currentPage - 1) * notesPerPage,
            };

            if (categoryId.length > 0) {
                params.categoryId = categoryId.join(',');
            }

            const res = await api.get('/notes', { params });
            setNotes(res.data.notes || []);
            setTotalPages(res.data.totalPages)
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
        const fetchUser = async () => {
            try {
                const res = await api.get('/users/me');
                setUser(res.data);
            } catch (err) {
                console.error('Failed to fetch user info', err);
                removeToken();
                navigate('/login')
            }
        };

        const token = getToken();
        if (!token) {
            navigate('/login');
        } else {
            fetchUser();
        }
    }, [navigate]);

    useEffect(() => {
        fetchNotes();
    }, [search, sortBy, sortOrder, categoryId, currentPage]);

    // Because the background was still scrollable when model was open
    useEffect(() => {
        if (modalIsOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [modalIsOpen]);

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
        // setCurrentPage(1);
    }

    const handleSortChange = (sortField) => {
        const newSortOrder = sortBy === sortField
            ? (sortOrder === 'ASC' ? 'DESC' : 'ASC')
            : 'DESC';

        setSortBy(sortField);
        setSortOrder(newSortOrder);
    }

    if (loading) return (
        <div className='flex h-[90vh] w-full justify-center items-center'>
            <p className='text-3xl text-primary-200'>Loading notes...</p>
        </div>
    );
    if (error) return <p className='error_style'>{error}</p>;

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
                user={user}
            />

            <NoteList notes={notes} refreshNotes={fetchNotes} />

            <div className='flex justify-center items-center gap-5 mb-5'>
                <PaginationButton
                    direction='left'
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                />

                <span
                    className='text-md text-primary-200'
                >
                    {currentPage} of {totalPages}
                </span>

                <PaginationButton
                    direction='right'
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                />
            </div>

            <AddNoteButton setModalIsOpen={setModalIsOpen} />

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel='Add note'
                className="modal_style"
                overlayClassName="modal_overlay_style"
            >
                <AddNoteModal
                    onClose={() => setModalIsOpen(false)}
                    onNoteCreated={handleNoteCreated}
                />
            </Modal>
        </div>
    )
}