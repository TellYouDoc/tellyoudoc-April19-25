import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import "../../styles/Administrator/ContentEditor.css";
import {
  FaSave,
  FaArrowLeft,
  FaEye,
  FaPlus,
  FaTrash,
  FaLayerGroup,
  FaExchangeAlt,
  FaTimes,
  FaEdit,
  FaCheck,
  FaQuestionCircle,
} from "react-icons/fa";

const AdminFAQ = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([]);
  const [faqGroups, setFaqGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Active tab and selection states
  const [activeTab, setActiveTab] = useState("ungrouped"); // 'ungrouped', 'grouped', or a specific group ID
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Edit states
  const [editingFaq, setEditingFaq] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [newFaqData, setNewFaqData] = useState({ question: "", answer: "" });
  const [newGroupName, setNewGroupName] = useState("");

  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(""); // 'faq', 'faqGroup', or 'faqFromGroup'
  const [itemToDelete, setItemToDelete] = useState(null);
  const [groupIdForDelete, setGroupIdForDelete] = useState(null);

  // Add/Move to Group Modal
  const [showAddToGroupModal, setShowAddToGroupModal] = useState(false);
  const [faqToAddToGroup, setFaqToAddToGroup] = useState(null);

  // Fetch existing FAQs on component mount
  useEffect(() => {
    const fetchFAQs = async () => {
      setIsLoading(true);
      try {
        // Implement API call to get FAQs here
        // For now using placeholder content
        setTimeout(() => {
          // Ungrouped FAQs
          setFaqs([
            {
              id: 1,
              question: "What is TellYouDoc?",
              answer:
                "TellYouDoc is a telemedicine platform that connects patients with healthcare professionals for online consultations, diagnostics, and health monitoring.",
            },
            {
              id: 2,
              question: "How do I schedule an appointment?",
              answer:
                "You can schedule an appointment by logging into your account, selecting a doctor from our directory, choosing an available time slot, and confirming your booking.",
            },
          ]);

          // Grouped FAQs
          setFaqGroups([
            {
              id: 101,
              name: "Security & Privacy",
              faqs: [
                {
                  id: 3,
                  question: "Is my medical information secure?",
                  answer:
                    "Yes, we take your privacy seriously. We employ industry-standard encryption and security measures to protect your personal and medical information. Our platform complies with relevant healthcare data protection regulations.",
                },
                {
                  id: 6,
                  question: "Who can access my health records?",
                  answer:
                    "Only healthcare professionals directly involved in your care can access your health records. You can control access permissions from your account settings.",
                },
              ],
            },
            {
              id: 102,
              name: "Services & Payments",
              faqs: [
                {
                  id: 4,
                  question: "Can I get prescriptions through TellYouDoc?",
                  answer:
                    "Yes, doctors on our platform can provide prescriptions when medically appropriate. Prescriptions are sent securely to your account and can be downloaded or sent directly to your preferred pharmacy.",
                },
                {
                  id: 5,
                  question: "What payment methods do you accept?",
                  answer:
                    "We accept major credit and debit cards, net banking, UPI, and various digital payment options for a seamless payment experience.",
                },
                {
                  id: 7,
                  question: "Are consultation fees refundable?",
                  answer:
                    "Consultation fees are refundable if canceled at least 12 hours before the scheduled appointment time. Please check our cancellation policy for more details.",
                },
              ],
            },
          ]);

          setLastSaved(new Date("2025-05-15T14:30:00"));
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        setIsLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  // Save all FAQs
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Implement API call to save FAQs and FAQ groups here
      // For example:
      // const response = await api.post('/admin/content/faqs', {
      //   ungroupedFaqs: faqs,
      //   faqGroups: faqGroups
      // });

      // For now just simulating an API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Saving FAQs:", {
        ungroupedFaqs: faqs,
        faqGroups: faqGroups,
      });

      setLastSaved(new Date());
    } catch (error) {
      console.error("Error saving FAQs:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Change active tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedGroup(tab === "grouped" ? null : tab);
    setEditingFaq(null);
    setEditingGroup(null);
    setNewFaqData({ question: "", answer: "" });
    setNewGroupName("");
  };

  // Start editing a FAQ
  const handleEditFaq = (faq) => {
    setEditingFaq(faq.id);
    setNewFaqData({ question: faq.question, answer: faq.answer });
  };

  // Cancel editing a FAQ
  const handleCancelEditFaq = () => {
    setEditingFaq(null);
    setNewFaqData({ question: "", answer: "" });
  };

  // Start editing a group
  const handleEditGroup = (group) => {
    setEditingGroup(group.id);
    setNewGroupName(group.name);
  };

  // Cancel editing a group
  const handleCancelEditGroup = () => {
    setEditingGroup(null);
    setNewGroupName("");
  };

  // Add a new FAQ to ungrouped list
  const handleAddFAQ = () => {
    if (newFaqData.question.trim() === "" || newFaqData.answer.trim() === "") {
      alert("Please fill in both question and answer fields");
      return;
    }

    const newFaq = {
      id: Date.now(),
      question: newFaqData.question,
      answer: newFaqData.answer,
    };

    setFaqs([...faqs, newFaq]);
    setNewFaqData({ question: "", answer: "" });
  };

  // Save edited FAQ in ungrouped list
  const handleSaveFaqEdit = (id) => {
    if (newFaqData.question.trim() === "" || newFaqData.answer.trim() === "") {
      alert("Please fill in both question and answer fields");
      return;
    }

    setFaqs(
      faqs.map((faq) =>
        faq.id === id
          ? { ...faq, question: newFaqData.question, answer: newFaqData.answer }
          : faq
      )
    );

    setEditingFaq(null);
    setNewFaqData({ question: "", answer: "" });
  };

  // Add a new FAQ to a group
  const handleAddFAQToGroup = (groupId) => {
    if (newFaqData.question.trim() === "" || newFaqData.answer.trim() === "") {
      alert("Please fill in both question and answer fields");
      return;
    }

    const newFaq = {
      id: Date.now(),
      question: newFaqData.question,
      answer: newFaqData.answer,
    };

    setFaqGroups(
      faqGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            faqs: [...group.faqs, newFaq],
          };
        }
        return group;
      })
    );

    setNewFaqData({ question: "", answer: "" });
  };

  // Save edited FAQ in a group
  const handleSaveGroupFaqEdit = (groupId, faqId) => {
    if (newFaqData.question.trim() === "" || newFaqData.answer.trim() === "") {
      alert("Please fill in both question and answer fields");
      return;
    }

    setFaqGroups(
      faqGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            faqs: group.faqs.map((faq) =>
              faq.id === faqId
                ? {
                    ...faq,
                    question: newFaqData.question,
                    answer: newFaqData.answer,
                  }
                : faq
            ),
          };
        }
        return group;
      })
    );

    setEditingFaq(null);
    setNewFaqData({ question: "", answer: "" });
  };

  // Add a new empty FAQ group
  const handleAddGroup = () => {
    if (newGroupName.trim() === "") {
      alert("Please enter a group name");
      return;
    }

    const newGroup = {
      id: Date.now(),
      name: newGroupName,
      faqs: [],
    };

    setFaqGroups([...faqGroups, newGroup]);
    setNewGroupName("");
    setSelectedGroup(newGroup.id);
    setActiveTab(newGroup.id);
  };

  // Save edited group name
  const handleSaveGroupEdit = (groupId) => {
    if (newGroupName.trim() === "") {
      alert("Group name cannot be empty");
      return;
    }

    setFaqGroups(
      faqGroups.map((group) =>
        group.id === groupId ? { ...group, name: newGroupName } : group
      )
    );

    setEditingGroup(null);
    setNewGroupName("");
  };

  // Show confirmation modal for FAQ deletion
  const confirmDeleteFAQ = (id) => {
    setDeleteType("faq");
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  // Show confirmation modal for FAQ deletion from a group
  const confirmDeleteFAQFromGroup = (groupId, faqId) => {
    setDeleteType("faqFromGroup");
    setItemToDelete(faqId);
    setGroupIdForDelete(groupId);
    setShowDeleteModal(true);
  };

  // Show confirmation modal for group deletion
  const confirmDeleteGroup = (groupId) => {
    setDeleteType("faqGroup");
    setItemToDelete(groupId);
    setShowDeleteModal(true);
  };

  // Actual delete operations after confirmation
  const handleRemoveFAQ = (id) => {
    setFaqs(faqs.filter((faq) => faq.id !== id));
    setShowDeleteModal(false);
    if (editingFaq === id) {
      handleCancelEditFaq();
    }
  };

  const handleRemoveFAQFromGroup = (groupId, faqId) => {
    setFaqGroups(
      faqGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            faqs: group.faqs.filter((faq) => faq.id !== faqId),
          };
        }
        return group;
      })
    );
    setShowDeleteModal(false);
    if (editingFaq === faqId) {
      handleCancelEditFaq();
    }
  };

  const handleRemoveGroup = (groupId) => {
    setFaqGroups(faqGroups.filter((group) => group.id !== groupId));
    setShowDeleteModal(false);
    if (selectedGroup === groupId) {
      setSelectedGroup(null);
      setActiveTab("grouped");
    }
    if (editingGroup === groupId) {
      handleCancelEditGroup();
    }
  };

  // Handle confirmation from modal
  const handleConfirmDelete = () => {
    if (deleteType === "faq") {
      handleRemoveFAQ(itemToDelete);
    } else if (deleteType === "faqFromGroup") {
      handleRemoveFAQFromGroup(groupIdForDelete, itemToDelete);
    } else if (deleteType === "faqGroup") {
      handleRemoveGroup(itemToDelete);
    }
    // Reset state
    setDeleteType("");
    setItemToDelete(null);
    setGroupIdForDelete(null);
  };

  // Cancel deletion
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteType("");
    setItemToDelete(null);
    setGroupIdForDelete(null);
  };

  // Show add to group modal
  const openAddToGroupModal = (faqId) => {
    setFaqToAddToGroup(faqId);
    setShowAddToGroupModal(true);
  };

  // Move FAQ to a group
  const handleMoveFaqToGroup = (groupId) => {
    if (faqToAddToGroup && groupId) {
      // Find the FAQ to move
      const faqToMove = faqs.find((faq) => faq.id === faqToAddToGroup);

      if (faqToMove) {
        // Add FAQ to the selected group
        setFaqGroups(
          faqGroups.map((group) => {
            if (group.id === groupId) {
              return {
                ...group,
                faqs: [...group.faqs, { ...faqToMove }],
              };
            }
            return group;
          })
        );

        // Remove FAQ from ungrouped list
        setFaqs(faqs.filter((faq) => faq.id !== faqToAddToGroup));
      }
    }

    // Close modal and reset state
    setShowAddToGroupModal(false);
    setFaqToAddToGroup(null);
  };
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="content-editor-container">
          <div className="content-editor-loading">
            <div className="spinner"></div>
            <p>Loading FAQs...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="content-editor-container">
        <div className="content-editor-header">
          <div className="content-editor-title">
            <button
              className="content-back-button"
              onClick={() => navigate("/admin/content")}
            >
              <FaArrowLeft /> Back to Content Management
            </button>
            <h1>FAQ Management</h1>
          </div>
          <div className="content-editor-actions">
            <button
              className="content-preview-toggle"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <FaEye /> {previewMode ? "Edit Mode" : "Preview Mode"}
            </button>
            <button
              className="content-save-button"
              onClick={handleSave}
              disabled={isSaving}
            >
              <FaSave /> {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
        {lastSaved && (
          <div className="content-last-saved">
            Last saved: {lastSaved.toLocaleString()}
          </div>
        )}
        {previewMode ? (
          <div className="content-preview faq-preview">
            <h1>Frequently Asked Questions</h1>

            {/* Render ungrouped FAQs */}
            {faqs.length > 0 && (
              <div className="faq-preview-ungrouped">
                <h2>General Questions</h2>
                {faqs.map((faq, index) => (
                  <div key={faq.id} className="faq-preview-item">
                    <h3>
                      {index + 1}. {faq.question}
                    </h3>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Render grouped FAQs */}
            {faqGroups.map((group) => (
              <div key={group.id} className="faq-preview-group">
                <h2>{group.name}</h2>
                {group.faqs.map((faq, index) => (
                  <div key={faq.id} className="faq-preview-item">
                    <h3>
                      {index + 1}. {faq.question}
                    </h3>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="faq-management">
            {/* Two-column layout */}
            <div className="faq-management-layout">
              {/* Left sidebar - navigation */}
              <div className="faq-sidebar">
                <div className="faq-tabs">
                  <button
                    className={`faq-tab ${
                      activeTab === "ungrouped" ? "active" : ""
                    }`}
                    onClick={() => handleTabChange("ungrouped")}
                  >
                    <FaQuestionCircle /> General FAQs
                  </button>

                  <button
                    className={`faq-tab ${
                      activeTab === "grouped" ? "active" : ""
                    }`}
                    onClick={() => handleTabChange("grouped")}
                  >
                    <FaLayerGroup /> Manage Groups
                  </button>

                  {activeTab === "grouped" && (
                    <div className="faq-groups-list">
                      <h3>FAQ Groups</h3>
                      {faqGroups.map((group) => (
                        <button
                          key={group.id}
                          className={`faq-group-tab ${
                            selectedGroup === group.id ? "active" : ""
                          }`}
                          onClick={() => handleTabChange(group.id)}
                        >
                          {group.name}{" "}
                          <span className="faq-count">
                            ({group.faqs.length})
                          </span>
                        </button>
                      ))}

                      {/* Create New Group Form */}
                      <div className="faq-group-creation">
                        <input
                          type="text"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          placeholder="Enter new group name"
                          className="new-group-input"
                        />
                        <button
                          className="faq-add-group-button"
                          onClick={handleAddGroup}
                          disabled={!newGroupName.trim()}
                        >
                          <FaPlus /> Add Group
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right content area */}
              <div className="faq-content-area">
                {/* Ungrouped FAQs tab */}
                {activeTab === "ungrouped" && (
                  <div className="faq-ungrouped-management">
                    <h2>General FAQs</h2>
                    <div className="faq-list">
                      {faqs.map((faq) => (
                        <div key={faq.id} className="faq-item">
                          {editingFaq === faq.id ? (
                            <div className="faq-edit-form">
                              <input
                                type="text"
                                className="faq-question-input"
                                value={newFaqData.question}
                                onChange={(e) =>
                                  setNewFaqData({
                                    ...newFaqData,
                                    question: e.target.value,
                                  })
                                }
                                placeholder="Enter question here..."
                              />
                              <textarea
                                className="faq-answer-input"
                                value={newFaqData.answer}
                                onChange={(e) =>
                                  setNewFaqData({
                                    ...newFaqData,
                                    answer: e.target.value,
                                  })
                                }
                                placeholder="Enter answer here..."
                                rows={4}
                              />
                              <div className="faq-edit-actions">
                                <button
                                  className="faq-cancel-button"
                                  onClick={handleCancelEditFaq}
                                >
                                  <FaTimes /> Cancel
                                </button>
                                <button
                                  className="faq-save-button"
                                  onClick={() => handleSaveFaqEdit(faq.id)}
                                >
                                  <FaCheck /> Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="faq-content">
                              <div className="faq-header">
                                <h3>{faq.question}</h3>
                                <div className="faq-actions">
                                  <button
                                    className="faq-edit-button"
                                    onClick={() => handleEditFaq(faq)}
                                    title="Edit this FAQ"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    className="faq-move-button"
                                    onClick={() => openAddToGroupModal(faq.id)}
                                    title="Move to group"
                                  >
                                    <FaExchangeAlt />
                                  </button>
                                  <button
                                    className="faq-delete-button"
                                    onClick={() => confirmDeleteFAQ(faq.id)}
                                    title="Delete this FAQ"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                              <div className="faq-answer">
                                <p>{faq.answer}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add new FAQ form */}
                      <div className="faq-new-item">
                        <h3>Add New FAQ</h3>
                        <div className="faq-edit-form">
                          <input
                            type="text"
                            className="faq-question-input"
                            value={newFaqData.question}
                            onChange={(e) =>
                              setNewFaqData({
                                ...newFaqData,
                                question: e.target.value,
                              })
                            }
                            placeholder="Enter question here..."
                          />
                          <textarea
                            className="faq-answer-input"
                            value={newFaqData.answer}
                            onChange={(e) =>
                              setNewFaqData({
                                ...newFaqData,
                                answer: e.target.value,
                              })
                            }
                            placeholder="Enter answer here..."
                            rows={4}
                          />
                          <div className="faq-add-actions">
                            <button
                              className="faq-add-button"
                              onClick={handleAddFAQ}
                              disabled={
                                !newFaqData.question.trim() ||
                                !newFaqData.answer.trim()
                              }
                            >
                              <FaPlus /> Add FAQ
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Group Management tab */}
                {activeTab === "grouped" && (
                  <div className="faq-group-management">
                    <h2>Manage FAQ Groups</h2>
                    <p className="faq-instructions">
                      Select a group from the sidebar to view and edit its FAQs,
                      or create a new group.
                    </p>
                    <div className="faq-groups-grid">
                      {faqGroups.map((group) => (
                        <div key={group.id} className="faq-group-card">
                          <div className="faq-group-card-header">
                            <h3>{group.name}</h3>
                            <span className="faq-count">
                              {group.faqs.length} FAQs
                            </span>
                          </div>
                          <div className="faq-group-card-actions">
                            <button
                              className="faq-group-edit-button"
                              onClick={() => handleTabChange(group.id)}
                            >
                              <FaEdit /> Edit FAQs
                            </button>
                            <button
                              className="faq-group-delete-button"
                              onClick={() => confirmDeleteGroup(group.id)}
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specific Group FAQs tab */}
                {activeTab !== "ungrouped" && activeTab !== "grouped" && (
                  <div className="faq-group-details">
                    {faqGroups
                      .filter((group) => group.id === selectedGroup)
                      .map((group) => (
                        <div key={group.id} className="faq-group-content">
                          {/* Group header with name editing */}
                          <div className="faq-group-detail-header">
                            {editingGroup === group.id ? (
                              <div className="group-name-edit">
                                <input
                                  type="text"
                                  className="group-name-input"
                                  value={newGroupName}
                                  onChange={(e) =>
                                    setNewGroupName(e.target.value)
                                  }
                                  placeholder="Enter group name"
                                />
                                <div className="group-edit-actions">
                                  <button
                                    className="group-cancel-button"
                                    onClick={handleCancelEditGroup}
                                  >
                                    <FaTimes /> Cancel
                                  </button>
                                  <button
                                    className="group-save-button"
                                    onClick={() =>
                                      handleSaveGroupEdit(group.id)
                                    }
                                  >
                                    <FaCheck /> Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="group-header-content">
                                <h2>{group.name}</h2>
                                <div className="group-actions">
                                  <button
                                    className="group-edit-button"
                                    onClick={() => handleEditGroup(group)}
                                    title="Rename group"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    className="group-delete-button"
                                    onClick={() => confirmDeleteGroup(group.id)}
                                    title="Delete group"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Group FAQs */}
                          <div className="faq-list">
                            {group.faqs.map((faq) => (
                              <div key={faq.id} className="faq-item">
                                {editingFaq === faq.id ? (
                                  <div className="faq-edit-form">
                                    <input
                                      type="text"
                                      className="faq-question-input"
                                      value={newFaqData.question}
                                      onChange={(e) =>
                                        setNewFaqData({
                                          ...newFaqData,
                                          question: e.target.value,
                                        })
                                      }
                                      placeholder="Enter question here..."
                                    />
                                    <textarea
                                      className="faq-answer-input"
                                      value={newFaqData.answer}
                                      onChange={(e) =>
                                        setNewFaqData({
                                          ...newFaqData,
                                          answer: e.target.value,
                                        })
                                      }
                                      placeholder="Enter answer here..."
                                      rows={4}
                                    />
                                    <div className="faq-edit-actions">
                                      <button
                                        className="faq-cancel-button"
                                        onClick={handleCancelEditFaq}
                                      >
                                        <FaTimes /> Cancel
                                      </button>
                                      <button
                                        className="faq-save-button"
                                        onClick={() =>
                                          handleSaveGroupFaqEdit(
                                            group.id,
                                            faq.id
                                          )
                                        }
                                      >
                                        <FaCheck /> Save
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="faq-content">
                                    <div className="faq-header">
                                      <h3>{faq.question}</h3>
                                      <div className="faq-actions">
                                        <button
                                          className="faq-edit-button"
                                          onClick={() => handleEditFaq(faq)}
                                          title="Edit this FAQ"
                                        >
                                          <FaEdit />
                                        </button>
                                        <button
                                          className="faq-delete-button"
                                          onClick={() =>
                                            confirmDeleteFAQFromGroup(
                                              group.id,
                                              faq.id
                                            )
                                          }
                                          title="Delete this FAQ"
                                        >
                                          <FaTrash />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="faq-answer">
                                      <p>{faq.answer}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* Add new FAQ to group form */}
                            <div className="faq-new-item">
                              <h3>Add New FAQ to {group.name}</h3>
                              <div className="faq-edit-form">
                                <input
                                  type="text"
                                  className="faq-question-input"
                                  value={newFaqData.question}
                                  onChange={(e) =>
                                    setNewFaqData({
                                      ...newFaqData,
                                      question: e.target.value,
                                    })
                                  }
                                  placeholder="Enter question here..."
                                />
                                <textarea
                                  className="faq-answer-input"
                                  value={newFaqData.answer}
                                  onChange={(e) =>
                                    setNewFaqData({
                                      ...newFaqData,
                                      answer: e.target.value,
                                    })
                                  }
                                  placeholder="Enter answer here..."
                                  rows={4}
                                />
                                <div className="faq-add-actions">
                                  <button
                                    className="faq-add-button"
                                    onClick={() =>
                                      handleAddFAQToGroup(group.id)
                                    }
                                    disabled={
                                      !newFaqData.question.trim() ||
                                      !newFaqData.answer.trim()
                                    }
                                  >
                                    <FaPlus /> Add FAQ
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            <div className="faq-management-help-section">
              <h3>FAQ Management Tips</h3>
              <ul>
                <li>Keep questions clear and concise</li>
                <li>Write answers in simple, easy-to-understand language</li>
                <li>Group related questions under meaningful categories</li>
                <li>
                  Use groups for topics like "Account", "Payments", "Services",
                  etc.
                </li>
                <li>
                  Most common/general questions can remain ungrouped at the top
                </li>
                <li>Update FAQs regularly based on user feedback</li>
              </ul>
            </div>
          </div>
        )}
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h3>Confirm Deletion</h3>
              </div>
              <div className="modal-body">
                <p>
                  {deleteType === "faq" &&
                    "Are you sure you want to delete this FAQ?"}
                  {deleteType === "faqFromGroup" &&
                    "Are you sure you want to remove this FAQ from the group?"}
                  {deleteType === "faqGroup" &&
                    "Are you sure you want to delete this group and all its FAQs?"}
                </p>
                <div className="modal-actions">
                  <button
                    className="modal-cancel-button"
                    onClick={handleCancelDelete}
                  >
                    Cancel
                  </button>
                  <button
                    className="modal-confirm-button"
                    onClick={handleConfirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}{" "}
        {/* Add to Group Modal */}
        {showAddToGroupModal && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <h3>Move FAQ to Group</h3>
                <button
                  className="modal-close-button"
                  onClick={() => {
                    setShowAddToGroupModal(false);
                    setFaqToAddToGroup(null);
                  }}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="modal-body">
                <p>Select a group to move this FAQ to:</p>
                {faqGroups.length === 0 ? (
                  <div className="no-groups-message">
                    <p>No groups available. Please create a group first.</p>
                  </div>
                ) : (
                  <div className="group-select-list">
                    {faqGroups.map((group) => (
                      <button
                        key={group.id}
                        className="group-select-item"
                        onClick={() => handleMoveFaqToGroup(group.id)}
                      >
                        {group.name}{" "}
                        <span className="faq-count">
                          ({group.faqs.length} FAQs)
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFAQ;
