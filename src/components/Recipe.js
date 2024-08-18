import React from 'react';

function RecipeModal({ show, handleClose, handleSubmit, newRecipe, handleChange, isEditing }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditing ? "Edit Recipe" : "Add New Recipe"}</h2>
        <form onSubmit={handleSubmit} className="recipe-form">
          <input type="text" name="name" placeholder="Recipe Name" value={newRecipe.name} onChange={handleChange} required/>
          <input type="text" name="ingredients" placeholder="Ingredients (comma separated)" value={newRecipe.ingredients} onChange={handleChange} required/>
          <textarea name="instructions" placeholder="Instructions" value={newRecipe.instructions} onChange={handleChange} required/>
          <input type="text" name="category" placeholder="Category (e.g., Dessert)" value={newRecipe.category} onChange={handleChange}/>
          <input type="text" name="preparationTime" placeholder="Preparation Time" value={newRecipe.preparationTime} onChange={handleChange}/>
          <input type="text" name="cookingTime" placeholder="Cooking Time" value={newRecipe.cookingTime} onChange={handleChange}/>
          <input type="text" name="servings" placeholder="Servings" value={newRecipe.servings} onChange={handleChange}/>
          <input type="file" name="picture" placeholder="Picture URL" onChange={(e) => { handleChange({ target: { name: 'picture', value: URL.createObjectURL(e.target.files[0]) } }); }}/>
          <button type="submit">{isEditing ? "Update Recipe" : "Add Recipe"}</button>
          <button type="button" onClick={handleClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default RecipeModal;
