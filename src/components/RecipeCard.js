import React, { useState } from 'react';

function RecipeCard({ recipe, handleEdit, handleDelete }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="recipe-card">
      <h3>{recipe.name}</h3>
      <img src={recipe.picture} alt={recipe.name} />
      <p><strong>Category:</strong> {recipe.category}</p>
      <p><strong>Preparation Time:</strong> {recipe.preparationTime}</p>
      <p><strong>Cooking Time:</strong> {recipe.cookingTime}</p>
      <p><strong>Servings:</strong> {recipe.servings}</p>
      {showDetails && (
        <>
          <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
          <p><strong>Instructions:</strong> {recipe.instructions}</p>
        </>
      )}
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "Show Less" : "Show More"}
      </button>
      <button onClick={() => handleEdit(recipe)}>Edit</button>
      <button onClick={() => handleDelete(recipe.id)}>Delete</button>
    </div>
  );
}

export default RecipeCard;
