import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import {
  Container,
  Card,
  CardContent,
  Typography,
  IconButton,
  Fab,
  Box,
  Chip,
  TextField,
  Dialog,
  Button,
  InputAdornment,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PushPin as PinIcon,
  Search as SearchIcon,
  AddCircleOutline as AddCircleOutlineIcon
} from '@mui/icons-material';
import NoteEditor from './NoteEditor';
import Masonry from 'react-masonry-css';

export default function Notes() {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const [notes, setNotes] = useState([]);
  const [labels, setLabels] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState('all');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addLabelOpen, setAddLabelOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [addLabelError, setAddLabelError] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchNotes();
      fetchLabels();
    }
  }, [currentUser]);

  const fetchNotes = async () => {
    try {
      const allNotesQuery = query(collection(db, 'notes'));
      const allNotesSnapshot = await getDocs(allNotesQuery);
      const notesData = allNotesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const userNotes = notesData.filter(note => note.userId === currentUser.uid);
      const sortedNotes = userNotes.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return (b.timeStamp || 0) - (a.timeStamp || 0);
      });
      setNotes(sortedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLabels = async () => {
    try {
      const labelsDoc = await getDoc(doc(db, 'labels', currentUser.uid));
      if (labelsDoc.exists()) {
        const labelsData = labelsDoc.data()?.labels || [];
        setLabels(labelsData);
      } else {
        setLabels([]);
      }
    } catch (error) {
      console.error('Error fetching labels:', error);
      setLabels([]);
    }
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setOpenDialog(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setOpenDialog(true);
  };

  const handleSaveNote = async (noteData) => {
    try {
      if (editingNote) {
        await updateDoc(doc(db, 'notes', editingNote.id), {
          ...noteData,
          timeStamp: Date.now()
        });
      } else {
        await addDoc(collection(db, 'notes'), {
          ...noteData,
          userId: currentUser.uid,
          timeStamp: Date.now()
        });
      }
      setOpenDialog(false);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteDoc(doc(db, 'notes', noteId));
        fetchNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  const handleTogglePin = async (note) => {
    try {
      await updateDoc(doc(db, 'notes', note.id), {
        isPinned: !note.isPinned,
        timeStamp: Date.now()
      });
      fetchNotes();
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  const handleAddLabel = async () => {
    if (!newLabel.trim()) {
      setAddLabelError('Label cannot be empty');
      return;
    }
    if (labels.includes(newLabel.trim())) {
      setAddLabelError('Label already exists');
      return;
    }
    try {
      const updatedLabels = [...labels, newLabel.trim()];
      await setDoc(doc(db, 'labels', currentUser.uid), { labels: updatedLabels });
      setLabels(updatedLabels);
      setNewLabel('');
      setAddLabelOpen(false);
      setAddLabelError('');
    } catch (error) {
      setAddLabelError('Failed to add label');
    }
  };

  // Filter notes by label and search
  const filteredNotes = notes.filter(note => {
    const matchesLabel = selectedLabel === 'all' || (note.labels && note.labels.includes(selectedLabel));
    const matchesSearch =
      note.title?.toLowerCase().includes(search.toLowerCase()) ||
      note.content?.toLowerCase().includes(search.toLowerCase());
    return matchesLabel && matchesSearch;
  });

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const breakpointColumnsObj = {
    default: 5,
    1600: 4,
    1200: 3,
    900: 2,
    600: 1
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography>Loading notes...</Typography>
        </Box>
      </Container>
    );
  }

  // Set note text color to always be dark
  const noteTextColor = '#222';
  const noteSubTextColor = '#444';

  // Set search bar background and placeholder color based on theme
  const searchBarBg = theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff';
  const searchBarBorder = theme.palette.mode === 'dark' ? '1px solid #333' : 'none';
  const searchBarPlaceholder = theme.palette.mode === 'dark' ? '#fff' : '#888';
  const searchBarInputColor = theme.palette.mode === 'dark' ? '#fff' : noteTextColor;

  return (
    <Container maxWidth={false} sx={{ mt: 4, mb: 4, fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif' }}>
      {/* Search bar */}
      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search your notes"
          value={search}
          onChange={e => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 4,
              background: searchBarBg,
              boxShadow: 1,
              fontSize: 18,
              fontWeight: 500,
              color: searchBarInputColor,
              border: searchBarBorder,
              '::placeholder': {
                color: searchBarPlaceholder,
                opacity: 1
              }
            }
          }}
        />
      </Box>
      {/* Label filter */}
      <Box display="flex" alignItems="center" mb={2} gap={1} flexWrap="wrap">
        <Button
          variant={selectedLabel === 'all' ? 'contained' : 'outlined'}
          color={selectedLabel === 'all' ? 'primary' : 'inherit'}
          onClick={() => setSelectedLabel('all')}
          sx={{ borderRadius: 8, textTransform: 'none', fontWeight: 500 }}
        >
          All Notes
        </Button>
        {labels.map(label => (
          <Button
            key={label}
            variant={selectedLabel === label ? 'contained' : 'outlined'}
            color={selectedLabel === label ? 'primary' : 'inherit'}
            onClick={() => setSelectedLabel(label)}
            sx={{ borderRadius: 8, textTransform: 'none', fontWeight: 500 }}
          >
            {label}
          </Button>
        ))}
        <IconButton color="primary" onClick={() => setAddLabelOpen(true)} sx={{ ml: 1 }}>
          <AddCircleOutlineIcon />
        </IconButton>
      </Box>
      <Dialog open={addLabelOpen} onClose={() => setAddLabelOpen(false)}>
        <Box p={3}>
          <Typography variant="h6" mb={2}>Add New Label</Typography>
          <TextField
            autoFocus
            fullWidth
            label="Label name"
            value={newLabel}
            onChange={e => setNewLabel(e.target.value)}
            error={!!addLabelError}
            helperText={addLabelError}
            onKeyDown={e => { if (e.key === 'Enter') handleAddLabel(); }}
          />
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={() => setAddLabelOpen(false)} color="inherit">Cancel</Button>
            <Button onClick={handleAddLabel} variant="contained">Add</Button>
          </Box>
        </Box>
      </Dialog>
      {/* Masonry layout for notes */}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {filteredNotes.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            minHeight="200px"
            textAlign="center"
            sx={{ gridColumn: '1/-1' }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {selectedLabel === 'all' && !search ? 'No notes yet' : 'No notes found'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedLabel === 'all' && !search
                ? 'Create your first note by clicking the + button below!'
                : 'Try a different search or filter.'}
            </Typography>
          </Box>
        ) : (
          filteredNotes.map((note) => (
            <Card 
              key={note.id}
              sx={{ 
                mb: 2,
                backgroundColor: note.backgroundColor || '#ffffff',
                position: 'relative',
                borderRadius: 3,
                boxShadow: 2,
                fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 6 }
              }}
              onClick={() => handleEditNote(note)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="h6" component="h2" sx={{ flexGrow: 1, mr: 1, fontSize: 18, fontWeight: 600, fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif', color: noteTextColor }}>
                    {note.title}
                  </Typography>
                  <Box>
                    {note.isPinned && <PinIcon color="primary" fontSize="small" />}
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-line', fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif', color: noteSubTextColor }}>
                  {note.content}
                </Typography>
                {note.labels && note.labels.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    {note.labels.map((label) => (
                      <Chip
                        key={label}
                        label={label}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5, fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif', color: noteSubTextColor }}
                      />
                    ))}
                  </Box>
                )}
                {note.checkList && note.checkList !== "[]" && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif', color: noteSubTextColor }}>
                      Checklist items: {JSON.parse(note.checkList).length}
                    </Typography>
                  </Box>
                )}
                <Typography variant="caption" sx={{ fontFamily: 'Montserrat, Inter, Roboto, Arial, sans-serif', color: noteSubTextColor }}>
                  {formatDate(note.timeStamp)}
                </Typography>
                <Box display="flex" justifyContent="flex-end" mt={1}>
                  <IconButton size="small" onClick={e => { e.stopPropagation(); handleDeleteNote(note.id); }}>
                    <DeleteIcon sx={{ color: '#333' }} />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Masonry>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={handleAddNote}
      >
        <AddIcon />
      </Fab>
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <NoteEditor
          note={editingNote}
          labels={labels}
          onSave={handleSaveNote}
          onCancel={() => setOpenDialog(false)}
        />
      </Dialog>
    </Container>
  );
} 