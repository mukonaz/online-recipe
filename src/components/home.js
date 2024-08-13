import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const [selectedFile, setSelectedFile] = useState(null);
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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user || !user.id) {
      alert("User is not logged in");
      return;
    }

    let imageUrl = newRecipe.picture;

    if (selectedFile) {
      const formData = new FormData();
      formData.append('picture', selectedFile);

      try {
        const response = await fetch('http://localhost:3001/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          imageUrl = data.url;
        } else {
          console.error('Failed to upload image');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:3001/recipes/${editId}`
      : `http://localhost:3001/recipes`;

    const recipeData = {
      ...newRecipe,
      userId: user.id,
      ingredients: newRecipe.ingredients.split(",").map(item => item.trim()),
      picture: imageUrl // Use the uploaded image URL
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
        setSelectedFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (!user || !user.id) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="home-page">
      <button onClick={handleLogout}>Logout</button>
      <h1>Welcome, {user.name}</h1>
      <form onSubmit={handleSubmit} className="recipe-form">
        <h2>{isEditing ? "Edit Recipe" : "Add New Recipe"}</h2>
        <input
          type="text"
          name="name"
          placeholder="Recipe Name"
          value={newRecipe.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="ingredients"
          placeholder="Ingredients (comma separated)"
          value={newRecipe.ingredients}
          onChange={handleChange}
          required
        />
        <textarea
          name="instructions"
          placeholder="Instructions"
          value={newRecipe.instructions}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category (e.g., Dessert)"
          value={newRecipe.category}
          onChange={handleChange}
        />
        <input
          type="text"
          name="preparationTime"
          placeholder="Preparation Time"
          value={newRecipe.preparationTime}
          onChange={handleChange}
        />
        <input
          type="text"
          name="cookingTime"
          placeholder="Cooking Time"
          value={newRecipe.cookingTime}
          onChange={handleChange}
        />
        <input
          type="text"
          name="servings"
          placeholder="Servings"
          value={newRecipe.servings}
          onChange={handleChange}
        />
        <input
          type="file"
          name="picture"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button type="submit">{isEditing ? "Update Recipe" : "Add Recipe"}</button>
      </form>

      <h2>Your Recipes</h2>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-item">
            <h3>{recipe.name}</h3>
            <img src={recipe.picture} alt={recipe.name} />
            <p><strong>Category:</strong> {recipe.category}</p>
            <p><strong>Preparation Time:</strong> {recipe.preparationTime}</p>
            <p><strong>Cooking Time:</strong> {recipe.cookingTime}</p>
            <p><strong>Servings:</strong> {recipe.servings}</p>
            <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
            <button onClick={() => handleEdit(recipe)}>Edit</button>
            <button onClick={() => handleDelete(recipe.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
