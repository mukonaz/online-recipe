import React, { useState, useEffect } from "react";

function HomePage({ user }) {
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

  useEffect(() => {
    // Fetch the user's recipes from the JSON server
    fetch(`http://localhost:3001/recipes?userId=${user.id}`)
      .then(response => response.json())
      .then(data => setRecipes(data));
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe({
      ...newRecipe,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:3001/recipes/${editId}`
      : `http://localhost:3001/recipes`;

    const recipeData = {
      ...newRecipe,
      userId: user.id,
      ingredients: newRecipe.ingredients.split(","),
    };

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(recipeData)
    })
      .then(response => response.json())
      .then(data => {
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
      });
  };

  const handleEdit = (recipe) => {
    setNewRecipe(recipe);
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

  return (
    <div className="home-page">
      <h1>Welcome, {user.name}</h1>
      <form onSubmit={handleSubmit} className="recipe-form">
        <h2>{isEditing ? "Edit Recipe" : "Add New Recipe"}</h2>
        <input type="text" name="name" placeholder="Recipe Name" value={newRecipe.name} onChange={handleChange} required />
        <input type="text" name="ingredients" placeholder="Ingredients (comma separated)" value={newRecipe.ingredients} onChange={handleChange} required/>
        <textarea name="instructions" placeholder="Instructions" value={newRecipe.instructions} onChange={handleChange} required/>
        <input type="text" name="category" placeholder="Category (e.g., Dessert)" value={newRecipe.category} onChange={handleChange}/>
        <input type="text" name="preparationTime" placeholder="Preparation Time" value={newRecipe.preparationTime} onChange={handleChange} />
        <input type="text" name="cookingTime" placeholder="Cooking Time" value={newRecipe.cookingTime} onChange={handleChange}/>
        <input type="text" name="servings" placeholder="Servings" value={newRecipe.servings} onChange={handleChange}/>
        <input type="text" name="picture" placeholder="Picture URL" value={newRecipe.picture} onChange={handleChange}/>
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
