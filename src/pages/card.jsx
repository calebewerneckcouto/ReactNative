import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import IngredientList from './ingredientList';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RecipeReviewCard({ id, title, image }) {
  const [open, setOpen] = useState(false);
  const [recipeInfo, setRecipeInfo] = useState(null);
  const [combinado, setCombinado] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    setIsFavorite(favoriteRecipes.includes(id));
  }, [id]);

  useEffect(() => {
    console.log('recipeInfo:', recipeInfo);
    console.log('combinado:', combinado);
  }, [recipeInfo, combinado]);

  const arrangeIngredients = (mealsDetails) => {
    let entries = Object.entries(mealsDetails);
    let ingredientes = entries.reduce((acc, [key, value]) => {
      if (key.includes('strIngredient') && value) acc.push(value);
      return acc;
    }, []);

    let measures = entries.reduce((acc, [key, value]) => {
      if (key.includes('strMeasure') && value) acc.push(value);
      return acc;
    }, []);

    // Filter out empty or unknown ingredients and measures
    const combined = measures.map((measure, index) => ({
      ingrediente: ingredientes[index] || '',
      medida: measure || '',
    })).filter(item => item.ingrediente && item.medida);

    setCombinado(combined);
  };

  const getRecipeById = async (id) => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
      return response.data.meals;
    } catch (error) {
      console.error('Error fetching recipe:', error);
      return [];
    }
  };

  const handleClickOpen = async () => {
    const info = await getRecipeById(id);
    if (info && info[0]) {
      setRecipeInfo(info[0]);
      arrangeIngredients(info[0]);
    } else {
      console.error('Failed to fetch recipe info');
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes')) || [];
    if (isFavorite) {
      const updatedFavorites = favoriteRecipes.filter(favId => favId !== id);
      localStorage.setItem('favoriteRecipes', JSON.stringify(updatedFavorites));
    } else {
      favoriteRecipes.push(id);
      localStorage.setItem('favoriteRecipes', JSON.stringify(favoriteRecipes));
    }
  };

  const handleShare = () => {
    if (!recipeInfo || !combinado.length) {
      console.error('Recipe info or combined ingredients are not available');
      return;
    }

    const ingredientsText = combinado.map(item => `${item.ingrediente}: ${item.medida}`).join('\n');
    const message = `Check out this recipe: ${title}\n\nInstructions:\n${recipeInfo.strInstructions || 'Instructions not available.'}\n\nIngredients:\n${ingredientsText}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    console.log('Sharing via WhatsApp URL:', url);
    window.open(url, '_blank');
  };

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">R</Avatar>}
          action={<IconButton aria-label="settings" />}
          title={title}
          subheader=""
        />
        <CardMedia component="img" height="194" image={image} alt="Recipe" />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {/* Placeholder text if needed */}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton
            aria-label="add to favorites"
            onClick={toggleFavorite}
            color={isFavorite ? 'secondary' : 'default'}
          >
            <FavoriteIcon />
          </IconButton>
          <ExpandMore
            expand={open}
            onClick={handleClickOpen}
            aria-expanded={open}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {recipeInfo ? (
            <>
              <Typography paragraph>
                {recipeInfo.strInstructions || 'Instructions not available.'}
              </Typography>
              <IngredientList combined={combinado} />
              <IconButton
                aria-label="share"
                onClick={handleShare}
                color="primary"
              >
                <ShareIcon />
              </IconButton>
            </>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
