"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [score, setScore] = useState("");
  const [comments, setComments] = useState("");
  const [selectedUserProjLink, setSelectedUserProjLink] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.post(
        "https://elabs-proj-eval-api.el.r.appspot.com/api/v1/proj/getEval/ui-session-3"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleUserSelect = (event) => {
    const selectedUid = event.target.value;
    const selectedUser = users.find((user) => user.uid === selectedUid);
    setSelectedUser(selectedUid);
    setSelectedUserProjLink(selectedUser.projLink || "");
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://elabs-proj-eval-api.el.r.appspot.com/api/v1/proj/evalProj/ui-session-3",
        {
          uid: selectedUser,
          score: score,
          comments: comments,
        }
      );
      if (response.status === 200) {
        const updatedUsers = users.filter((user) => user.uid !== selectedUser);
        setUsers(updatedUsers);
        setSelectedUser("");
        setScore("");
        setComments("");
        setSelectedUserProjLink("");
      }
    } catch (error) {
      console.error("Error submitting score and comments:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 rounded-lg shadow-lg bg-white">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Admin Page
        </h1>

        <div className="mb-4">
          <label className="block font-medium mb-2">Select a user:</label>
          <select
            value={selectedUser}
            onChange={handleUserSelect}
            className="w-full text-black py-2 px-3 rounded-lg border focus:outline-none focus:border-yellow-500"
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.uid} value={user.uid}>
                {user.uid}
              </option>
            ))}
          </select>
        </div>

        {selectedUser && (
          <div className="mb-4">
            <label className="block font-medium mb-2">Score:</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="score"
              className="w-full text-black py-2 px-3 rounded-lg border focus:outline-none focus:border-yellow-500"
            />
          </div>
        )}

        {selectedUser && (
          <div className="mb-4">
            <label className="block font-medium mb-2">Comments:</label>
            <input
              type="text"
              value={comments}
              placeholder="comments"
              onChange={(e) => setComments(e.target.value)}
              className="w-full text-black py-2 px-3 rounded-lg border focus:outline-none focus:border-yellow-500"
            />
          </div>
        )}

        {selectedUser && selectedUserProjLink && (
          <div className="mb-4">
            <label className="block font-medium mb-2">Project Link:</label>
            <a
              href={selectedUserProjLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {selectedUserProjLink}
            </a>
          </div>
        )}

        {selectedUser && (
          <button
            onClick={handleSubmit}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Submit Score and Comments
          </button>
        )}
      </div>
    </div>
  );
}
