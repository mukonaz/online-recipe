import React from 'react';

function NavigationBar({ user, onLogout, searchQuery, setSearchQuery, handleSearch }) {
  return (
    <nav className="navbar">
      <h1>Welcome, {user.name}</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <button onClick={onLogout}>Logout</button>
    </nav>
  );
}

export default NavigationBar;
