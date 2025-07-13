import React, { useState, useEffect } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Chip,
  FormControlLabel,
  Checkbox,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ColorLens as ColorIcon
} from '@mui/icons-material';

const COLORS = [
  '#FFFFFF', '#F28B82', '#FBBC04', '#FFF475', '#CCFF90',
  '#A7FFEB', '#CBF0F8', '#AECBFA', '#D7AEFB', '#FDCFE8',
  '#E6C9A8', '#E8EAED'
];

export default function NoteEditor({ note, labels, onSave, onCancel }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [checkList, setCheckList] = useState([]);
  const [newCheckItem, setNewCheckItem] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setIsPinned(note.isPinned || false);
      setBackgroundColor(note.backgroundColor || '#FFFFFF');
      setSelectedLabels(note.labels || []);
      setCheckList(note.checkList ? JSON.parse(note.checkList) : []);
    }
  }, [note]);

  const handleSave = () => {
    const noteData = {
      title: title.trim(),
      content: content.trim(),
      isPinned,
      backgroundColor,
      labels: selectedLabels,
      checkList: JSON.stringify(checkList)
    };
    onSave(noteData);
  };

  const handleAddLabel = (label) => {
    if (label && !selectedLabels.includes(label)) {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  const handleRemoveLabel = (labelToRemove) => {
    setSelectedLabels(selectedLabels.filter(label => label !== labelToRemove));
  };

  const handleAddCheckItem = () => {
    if (newCheckItem.trim()) {
      setCheckList([...checkList, { text: newCheckItem.trim(), isChecked: false }]);
      setNewCheckItem('');
    }
  };

  const handleToggleCheckItem = (index) => {
    const updatedList = [...checkList];
    updatedList[index].isChecked = !updatedList[index].isChecked;
    setCheckList(updatedList);
  };

  const handleRemoveCheckItem = (index) => {
    setCheckList(checkList.filter((_, i) => i !== index));
  };

  const handleUpdateCheckItem = (index, newText) => {
    const updatedList = [...checkList];
    updatedList[index].text = newText;
    setCheckList(updatedList);
  };

  return (
    <>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {note ? 'Edit Note' : 'Create New Note'}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                />
              }
              label="Pin"
            />
            <Box display="flex" gap={0.5}>
              {COLORS.map((color) => (
                <IconButton
                  key={color}
                  size="small"
                  onClick={() => setBackgroundColor(color)}
                  sx={{
                    backgroundColor: color,
                    border: backgroundColor === color ? '2px solid #1976d2' : '1px solid #ddd',
                    '&:hover': {
                      backgroundColor: color,
                      opacity: 0.8
                    }
                  }}
                >
                  <ColorIcon sx={{ fontSize: 16, color: color === '#FFFFFF' ? '#000' : 'transparent' }} />
                </IconButton>
              ))}
            </Box>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ minWidth: 500 }}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            margin="normal"
            variant="outlined"
            multiline
            rows={4}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Labels
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={0.5} sx={{ minWidth: 300, maxWidth: 600 }}>
              {labels.map((label) => (
                <Chip
                  key={label}
                  label={label}
                  clickable
                  color={selectedLabels.includes(label) ? 'primary' : 'default'}
                  onClick={() => {
                    setSelectedLabels(selectedLabels.includes(label)
                      ? selectedLabels.filter(l => l !== label)
                      : [...selectedLabels, label]);
                  }}
                  sx={{ mb: 0.5 }}
                />
              ))}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Checklist
            </Typography>
            <Box display="flex" gap={1} mb={1}>
              <TextField
                size="small"
                placeholder="Add checklist item"
                value={newCheckItem}
                onChange={(e) => setNewCheckItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCheckItem()}
                sx={{ flexGrow: 1 }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddCheckItem}
                disabled={!newCheckItem.trim()}
              >
                Add
              </Button>
            </Box>
            {checkList.map((item, index) => (
              <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                <Checkbox
                  checked={item.isChecked}
                  onChange={() => handleToggleCheckItem(index)}
                />
                <TextField
                  size="small"
                  value={item.text}
                  onChange={(e) => handleUpdateCheckItem(index, e.target.value)}
                  sx={{ flexGrow: 1 }}
                  variant="standard"
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveCheckItem(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          disabled={!title.trim() && !content.trim()}
        >
          {note ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </>
  );
} 