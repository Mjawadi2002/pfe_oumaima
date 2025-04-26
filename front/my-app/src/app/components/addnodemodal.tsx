// components/AddNodeModal.tsx
import './addnodemodal.css';
import { FormEvent } from 'react';

// Define the interface for node data
interface NodeData {
  name: string;
  connectedDate: string;
  status: 'Online' | 'Offline';
}

// Define props interface
export interface AddNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNode: (nodeData: NodeData) => void;
}

export default function AddNodeModal({ isOpen, onClose, onAddNode }: AddNodeModalProps) {
  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nodeData: NodeData = {
      name: formData.get('name') as string,
      connectedDate: formData.get('connectedDate') as string,
      status: formData.get('status') as 'Online' | 'Offline'
    };
    
    onAddNode(nodeData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h2>Add New Node</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Node Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              className="input-field"
              placeholder="Enter node name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="connectedDate">Connected Date *</label>
            <input
              type="date"
              id="connectedDate"
              name="connectedDate"
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select id="status" name="status" className="input-field" required>
              <option value="">Select status</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-button">
              Add Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}