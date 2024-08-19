import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import RecipeCard from './RecipeCard';
import RecipeModal from './Recipe';

function HomePage({ user, onLogout }) {
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({
    name: "",
    ingredients: "",
    instructions: "",
    category: "",
    preparationTime: "",
    cookingTime: "",
    servings: "",
    picture: "" 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [searchResults, setSearchResults] = useState([]); 
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (user && user.id) {
      fetch(`http://localhost:3001/recipes?userId=${user.id}`)
        .then(response => response.json())
        .then(data => setRecipes(data))
        .catch(error => console.error("Failed to fetch recipes:", error));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe({
      ...newRecipe,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user || !user.id) {
      alert("User is not logged in");
      return;
    }
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:3001/recipes/${editId}`
      : `http://localhost:3001/recipes`;

    const recipeData = {
      ...newRecipe,
      userId: user.id,
      ingredients: newRecipe.ingredients.split(",").map(item => item.trim()), 
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipeData),
      });

      if (response.ok) {
        const data = await response.json();
        if (isEditing) {
          setRecipes(recipes.map((recipe) => (recipe.id === editId ? data : recipe)));
          setIsEditing(false);
          setEditId(null);
        } else {
          setRecipes([...recipes, data]);
        }
        setNewRecipe({
          name: "",
          ingredients: "",
          instructions: "",
          category: "",
          preparationTime: "",
          cookingTime: "",
          servings: "",
          picture: ""
        });
        setShowModal(false);
      } else {
        console.error('Failed to add/update recipe');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (recipe) => {
    setNewRecipe({
      name: recipe.name,
      ingredients: recipe.ingredients.join(", "),
      instructions: recipe.instructions,
      category: recipe.category,
      preparationTime: recipe.preparationTime,
      cookingTime: recipe.cookingTime,
      servings: recipe.servings,
      picture: recipe.picture
    });
    setIsEditing(true);
    setEditId(recipe.id);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:3001/recipes/${id}`, {
      method: "DELETE"
    }).then(() => {
      setRecipes(recipes.filter((recipe) => recipe.id !== id));
    });
  };

  const handleLogout = () => {
    onLogout(); 
    navigate('/');
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/recipes?name_like=${searchQuery}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  if (!user || !user.id) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="home-page">
      <NavigationBar user={user} onLogout={handleLogout} searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch}/>
      <RecipeModal show={showModal} handleClose={() => setShowModal(false)} handleSubmit={handleSubmit} newRecipe={newRecipe} handleChange={handleChange} isEditing={isEditing}/>
      <h2>Your Recipes</h2>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} handleEdit={handleEdit} handleDelete={handleDelete}/>
        ))}
      </div>

      <h2>Search Results</h2>
      <div className="recipe-list">
        {searchResults.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} handleEdit={handleEdit} handleDelete={handleDelete}/>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
