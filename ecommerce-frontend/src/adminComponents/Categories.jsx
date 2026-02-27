import React, { useState, useEffect } from 'react';
import './styles/Categories.css';

const API_BASE_URL = 'http://localhost:8080/api/v1/categories'; // Update with your backend URL

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentCategory, setCurrentCategory] = useState({
    categoryId: null,
    categoryName: '',
    description: '',
    status: true
  });
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch categories on component mount and when filter changes
  useEffect(() => {
    fetchCategories();
  }, [filterStatus, page]);

  // Fetch categories from backend
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = `${API_BASE_URL}?page=${page}&size=10`;
      
      // Add status filter if not 'all'
      if (filterStatus === 'active') {
        url += '&status=true';
      } else if (filterStatus === 'inactive') {
        url += '&status=false';
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const result = await response.json();
      
      // Extract data from wrapped response
      const data = result.data;
      
      // Handle paginated response
      if (data && data.content) {
        setCategories(data.content);
        setTotalPages(data.totalPages);
      } else if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle opening modal for adding new category
  const handleAddCategory = () => {
    setModalMode('add');
    setCurrentCategory({
      categoryId: null,
      categoryName: '',
      description: '',
      status: true
    });
    setIsModalOpen(true);
  };

  // Handle opening modal for editing category
  const handleEditCategory = async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${categoryId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch category details');
      }
      
      const result = await response.json();
      const category = result.data; // Extract data from wrapped response
      
      setModalMode('edit');
      setCurrentCategory(category);
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error fetching category:', err);
      alert('Failed to load category details');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const requestBody = {
        categoryName: currentCategory.categoryName,
        description: currentCategory.description
      };
      
      let response;
      
      if (modalMode === 'add') {
        // POST request to add new category
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
      } else {
        // PUT request to update category
        response = await fetch(`${API_BASE_URL}/${currentCategory.categoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });
      }
      
      const result = await response.json();
      
      if (!response.ok) {
        // Handle error from wrapped response
        throw new Error(result.message || 'Failed to save category');
      }
      
      // Refresh categories list
      await fetchCategories();
      setIsModalOpen(false);
      
      // Show success message
      alert(result.message || (modalMode === 'add' ? 'Category added successfully!' : 'Category updated successfully!'));
      
    } catch (err) {
      console.error('Error saving category:', err);
      alert(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  // Handle toggle button click - show notification first
  const handleToggleClick = (category) => {
    setNotificationData(category);
    setShowNotification(true);
  };

  // Confirm toggle action
  const confirmToggle = async () => {
    if (notificationData) {
      try {
        const response = await fetch(`${API_BASE_URL}/${notificationData.categoryId}/status`, {
          method: 'PATCH'
        });
        
        if (!response.ok) {
          throw new Error('Failed to toggle category status');
        }
        
        // Refresh categories list
        await fetchCategories();
        
      } catch (err) {
        console.error('Error toggling category status:', err);
        alert('Failed to update category status');
      }
    }
    setShowNotification(false);
    setNotificationData(null);
  };

  // Cancel toggle action
  const cancelToggle = () => {
    setShowNotification(false);
    setNotificationData(null);
  };

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h1>Categories</h1>
        <p className="categories-description">
          Manage your product categories. Add, edit, or deactivate categories to organize your inventory effectively.
        </p>
      </div>

      <div className="categories-controls">
        <div className="filter-section">
          <label htmlFor="statusFilter">Filter by Status:</label>
          <select
            id="statusFilter"
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setPage(0); // Reset to first page on filter change
            }}
            className="status-dropdown"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        
        <button onClick={handleAddCategory} className="add-category-btn">
          + Add New Category
        </button>
      </div>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading categories...</p>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="categories-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map(category => (
                    <tr key={category.categoryId}>
                      <td>{category.categoryId}</td>
                      <td>{category.categoryName}</td>
                      <td>{category.description}</td>
                      <td>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={category.status}
                            onChange={() => handleToggleClick(category)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                        <span className={`status-label ${category.status ? 'active' : 'inactive'}`}>
                          {category.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleEditCategory(category.categoryId)}
                          className={`update-btn ${!category.status ? 'disabled' : ''}`}
                          disabled={!category.status}
                          title={!category.status ? 'Cannot update inactive category' : 'Update category'}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">No categories found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="page-info">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal for Add/Edit Category */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !loading && setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalMode === 'add' ? 'Add New Category' : 'Update Category'}</h2>
              <button 
                className="close-btn" 
                onClick={() => setIsModalOpen(false)}
                disabled={loading}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="categoryName">Category Name *</label>
                <input
                  type="text"
                  id="categoryName"
                  name="categoryName"
                  value={currentCategory.categoryName}
                  onChange={handleInputChange}
                  required
                  maxLength={100}
                  placeholder="Enter category name"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={currentCategory.description}
                  onChange={handleInputChange}
                  required
                  maxLength={300}
                  placeholder="Enter category description"
                  rows="4"
                  disabled={loading}
                />
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="cancel-btn"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : (modalMode === 'add' ? 'Add Category' : 'Update Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Modal for Toggle Confirmation */}
      {showNotification && notificationData && (
        <div className="modal-overlay">
          <div className="notification-modal">
            <h3>Confirm Status Change</h3>
            <p>
              Are you sure you want to {notificationData.status ? 'deactivate' : 'activate'} the category 
              <strong> "{notificationData.categoryName}"</strong>?
            </p>
            <div className="notification-actions">
              <button onClick={cancelToggle} className="cancel-btn">Cancel</button>
              <button onClick={confirmToggle} className="confirm-btn">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;