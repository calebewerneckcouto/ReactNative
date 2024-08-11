import React from 'react';
import { List, ListItem, ListItemText, Typography, Paper } from '@mui/material';

const IngredientList = ({ combined = [] }) => {
  const filteredCombined = combined.filter(item => item.ingrediente && item.medida);

  return (
    <Paper elevation={3} style={{ padding: 16 }}>
      <Typography variant="h6" gutterBottom>
        Ingredients List
      </Typography>
      <List>
        {filteredCombined.length > 0 ? (
          filteredCombined.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${item.ingrediente}: ${item.medida}`}
                primaryTypographyProps={{ fontWeight: 'bold' }}
              />
            </ListItem>
          ))
        ) : (
          <Typography>No valid ingredients available.</Typography>
        )}
      </List>
    </Paper>
  );
};

export default IngredientList;
