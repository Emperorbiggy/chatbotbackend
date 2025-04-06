import React, { useState, useEffect } from "react";
import "../App.css";

const CMS = () => {
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [contentList, setContentList] = useState<any[]>([]);
  const [editingContent, setEditingContent] = useState<{ id: number, title: string, text: string } | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false); // Add state for success popup

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("https://chatbotbackend-1wds.onrender.com/content");
        if (!response.ok) {
          throw new Error("Failed to fetch content");
        }
        const data = await response.json();
        setContentList(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchContent();
  }, []);

  const toggleDropdown = (index: number) => {
    setDropdownOpenIndex(dropdownOpenIndex === index ? null : index);
  };

  const handleEdit = (index: number) => {
    const contentToEdit = contentList[index];
    setEditingContent({ id: contentToEdit.id, title: contentToEdit.title, text: contentToEdit.text });
    setMessage(contentToEdit.title);
    setResponse(contentToEdit.text);
    setIsFormVisible(true);
  };

  const handleDelete = async (index: number) => {
    const contentToDelete = contentList[index];
    const confirmed = window.confirm(`Are you sure you want to delete "${contentToDelete.title}"?`);
    
    if (confirmed) {
      try {
        const res = await fetch(`https://chatbotbackend-1wds.onrender.com/content/${contentToDelete.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (res.ok) {
          // Show success popup
          setDeleteSuccess(true);
          setTimeout(() => setDeleteSuccess(false), 3000); // Hide after 3 seconds

          // Remove the deleted content from the list
          const updatedList = contentList.filter(item => item.id !== contentToDelete.id);
          setContentList(updatedList);
        } else {
          alert('Failed to delete content.');
        }
      } catch (err) {
        console.error('Error deleting content:', err);
        alert('Error deleting content.');
      }
    }
  };

  const handleAddClick = () => {
    setEditingContent(null); // Reset editing content state when adding new content
    setIsFormVisible(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newContent = {
      title: message, 
      text: response, 
    };
  
    try {
      const res = await fetch('https://chatbotbackend-1wds.onrender.com/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newContent),
      });
      
      if (res.ok) {
        setIsFormVisible(false);
        setIsSubmitted(true);
        setMessage('');
        setResponse('');
  
        // Refresh the page to load the new content
        window.location.reload();  // This will reload the page to show updated content
  
      } else {
        alert('Failed to add content.');
      }
    } catch (error) {
      console.error('Error submitting content:', error);
      alert('Error submitting content.');
    }
  };
  const handleUpdateContent = async (updatedContent: { title: string, text: string }) => {
    try {
      if (editingContent) {
        const res = await fetch(`https://chatbotbackend-1wds.onrender.com/content/${editingContent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(updatedContent),
        });
  
        if (res.ok) {
          setIsFormVisible(false);
          setIsSubmitted(true);
          setMessage('');
          setResponse('');
          const updatedList = contentList.map(item =>
            item.id === editingContent.id ? { ...item, title: updatedContent.title, text: updatedContent.text } : item
          );
          setContentList(updatedList);
        } else {
          alert('Failed to update content.');
        }
      }
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Error updating content.');
    }
  };
  

  return (
    <div className="cms-container">
      <h1 className="cms-title">CMS - Content Management</h1>

      <div className="table-wrapper">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Content</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {contentList.map((item, index) => (
              <tr key={index}>
                <td>{item.title}</td>
                <td>{item.text}</td>
                <td className="action-col">
                  <div className="relative">
                    <button className="action-btn" onClick={() => toggleDropdown(index)}>
                      ⋮
                    </button>
                    {dropdownOpenIndex === index && (
                      <div className="dropdown-menu show">
                        <button onClick={() => handleEdit(index)}>Edit</button>
                        <button className="delete" onClick={() => handleDelete(index)}>Delete</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="floating-add-btn" onClick={handleAddClick}>
        {isMobile ? "+" : "Add"}
      </button>

      {deleteSuccess && (
        <div className="success-popup">
          <p>Deleted successfully!</p>
        </div>
      )}

      {isFormVisible && (
        <div className="popup-overlay">
          <div className="popup-form">
            <h2>{editingContent ? "Edit Content" : "Add New Content"}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="input-group">
                <label htmlFor="message">Message</label>
                <input
                  type="text"
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="response">Response</label>
                <input
                  type="text"
                  id="response"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  required
                />
              </div>
              <div className="button-group">
                <button type="submit" className="submit-btn">
                  {editingContent ? "Update" : "Submit"}
                </button>
                <button type="button" className="cancel-btn" onClick={() => setIsFormVisible(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CMS;
