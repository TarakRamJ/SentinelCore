import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CustomLoader } from '../components/CustomLoader';
import { StatusBadge } from '../components/StatusBadge';
import { 
  getAllAdminRequests, 
  getMyRequests, 
  submitAdminRequest, 
  processAdminRequest 
} from '../services/api';
import { 
  ClipboardList, 
  History, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  X, 
  AlertCircle, 
  Send,
  MessageSquare,
  Key,
  Server,
  Activity
} from 'lucide-react';

export default function RequestsPage() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN';
  const isDevOps = user?.role === 'DEVOPS_ENGINEER' || user?.role === 'ROLE_DEVOPS_ENGINEER';

  // Data States
  const [pendingRequests, setPendingRequests] = useState([]);
  const [historyRequests, setHistoryRequests] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Form & Tab States - Default to GENERIC_ACTION if DevOps Engineer, otherwise CREATE_ASSET
  const [activeTab, setActiveTab] = useState(isDevOps ? 'GENERIC_ACTION' : 'CREATE_ASSET');
  const [title, setTitle] = useState('');
  const [messageText, setMessageText] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [assetForm, setAssetForm] = useState({
    name: '',
    ip: '',
    type: 'SERVER',
    status: 'HEALTHY'
  });

  // Validation Error State
  const [formErrors, setFormErrors] = useState({});

  // Action/Feedback States
  const [adminComments, setAdminComments] = useState({});
  const [bannerMessage, setBannerMessage] = useState({ text: '', type: '' });

  // Modal States
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const fetchRequests = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const data = isAdmin ? await getAllAdminRequests() : await getMyRequests();
      
      setPendingRequests(data.filter(r => r.status === 'PENDING'));
      setHistoryRequests(data.filter(r => r.status !== 'PENDING'));
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching requests:', err);
      if (err.response?.status === 403 && isAdmin) {
        try {
          const myData = await getMyRequests();
          setPendingRequests(myData.filter(r => r.status === 'PENDING'));
          setHistoryRequests(myData.filter(r => r.status !== 'PENDING'));
        } catch (fallbackErr) {
          showBanner('Failed to synchronize requests stream.', 'error');
        }
      }
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchRequests(false);
    const interval = setInterval(() => {
      fetchRequests(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  const showBanner = (msg, type = 'success') => {
    setBannerMessage({ text: msg, type });
    setTimeout(() => setBannerMessage({ text: '', type: '' }), 5000);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormErrors({});
  };

  // --- VALIDATION FUNCTIONS ---
  const validateAssetForm = () => {
    const errors = {};
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (!assetForm.name.trim()) {
      errors.name = 'Asset name is required.';
    } else if (assetForm.name.trim().length < 3) {
      errors.name = 'Asset name must be at least 3 characters long.';
    }

    if (!assetForm.ip.trim()) {
      errors.ip = 'IP address is required.';
    } else if (!ipRegex.test(assetForm.ip.trim())) {
      errors.ip = 'Please enter a valid IPv4 address (e.g., 192.168.1.50).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateGenericForm = () => {
    const errors = {};

    if (!title.trim()) {
      errors.title = 'Action title is required.';
    } else if (title.trim().length < 4) {
      errors.title = 'Title must be at least 4 characters long.';
    }

    if (!messageText.trim()) {
      errors.messageText = 'Details and requirements description is required.';
    } else if (messageText.trim().length < 10) {
      errors.messageText = 'Please provide a more detailed description (at least 10 characters).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};
    const hasLetter = /[a-zA-Z]/;
    const hasNumber = /[0-9]/;

    if (!newPassword) {
      errors.newPassword = 'New password is required.';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters long.';
    } else if (!hasLetter.test(newPassword) || !hasNumber.test(newPassword)) {
      errors.newPassword = 'Password must contain at least one letter and one number.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateMessageForm = () => {
    const errors = {};

    if (!title.trim()) {
      errors.title = 'Subject is required.';
    }

    if (!messageText.trim()) {
      errors.messageText = 'Message content cannot be empty.';
    } else if (messageText.trim().length < 5) {
      errors.messageText = 'Message is too short (at least 5 characters).';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- SUBMIT HANDLERS ---
  const handleAssetSubmit = async (e) => {
    e.preventDefault();
    if (!validateAssetForm()) return;

    try {
      const detailsJson = JSON.stringify({
        ...assetForm,
        name: assetForm.name.trim(),
        ip: assetForm.ip.trim()
      }, null, 2);

      await submitAdminRequest('CREATE_ASSET', `Asset Creation: ${assetForm.name.trim()}`, detailsJson);
      showBanner('Asset creation request submitted successfully to Admin!');
      setAssetForm({ name: '', ip: '', type: 'SERVER', status: 'HEALTHY' });
      setFormErrors({});
      fetchRequests(true);
    } catch (err) {
      showBanner('Failed to submit asset creation request.', 'error');
    }
  };

  const handleGenericSubmit = async (e) => {
    e.preventDefault();
    if (!validateGenericForm()) return;

    try {
      await submitAdminRequest('GENERIC_ACTION', title.trim(), messageText.trim());
      showBanner('Action request submitted successfully!');
      setTitle('');
      setMessageText('');
      setFormErrors({});
      fetchRequests(true);
    } catch (err) {
      showBanner('Failed to submit custom action request.', 'error');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    try {
      await submitAdminRequest('PASSWORD_CHANGE', 'Password Reset Request', newPassword);
      showBanner('Password change request sent to Admin!');
      setNewPassword('');
      setFormErrors({});
      fetchRequests(true);
    } catch (err) {
      showBanner('Failed to submit password change request.', 'error');
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!validateMessageForm()) return;

    try {
      await submitAdminRequest('MESSAGE', title.trim() || 'User Message', messageText.trim());
      showBanner('Message sent to Administrator successfully!');
      setTitle('');
      setMessageText('');
      setFormErrors({});
      fetchRequests(true);
    } catch (err) {
      showBanner('Failed to send message to Admin.', 'error');
    }
  };

  const handleProcess = async (id, approve) => {
    try {
      await processAdminRequest(id, approve, adminComments[id] || '');
      showBanner(approve ? 'Request approved & action executed successfully!' : 'Request rejected.', approve ? 'success' : 'error');
      fetchRequests(true);
    } catch (err) {
      showBanner('Error processing request: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const handleViewRequest = (req) => {
    setSelectedRequest(req);
    setIsViewModalOpen(true);
  };

  if (loading) return <CustomLoader message="Connecting to Request & Approval Stream..." />;

  return (
    <div className="page-container" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
      {/* HEADER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ClipboardList size={30} color="var(--sentinelcore-purple)" />
            <h2 style={{ color: '#fff', margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
              {isAdmin ? 'Admin Approval Queue' : 'Requests & Messages'}
            </h2>
          </div>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '2px' }}>
            Last updated: {lastRefreshed.toLocaleTimeString()}
          </span>
        </div>

        <button 
          className="btn-primary" 
          style={{ background: 'var(--sentinelcore-purple)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', padding: '10px 18px' }} 
          onClick={() => setShowHistory(!showHistory)}
        >
          <History size={20} /> {showHistory ? 'Hide Request History' : 'View Request History'}
        </button>
      </div>

      {/* FEEDBACK BANNER */}
      {bannerMessage.text && (
        <div
          className="form-panel"
          style={{
            marginBottom: '24px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderLeft: `5px solid ${bannerMessage.type === 'error' ? '#f5222d' : '#52c41a'}`,
            backgroundColor: bannerMessage.type === 'error' ? 'rgba(245, 34, 45, 0.15)' : 'rgba(82, 196, 26, 0.15)',
          }}
        >
          {bannerMessage.type === 'error' ? (
            <AlertCircle size={22} color="#f5222d" />
          ) : (
            <CheckCircle2 size={22} color="#52c41a" />
          )}
          <span style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 500 }}>{bannerMessage.text}</span>
        </div>
      )}

      {/* NON-ADMIN SUBMISSION FORM TABBED CONTAINER */}
      {!isAdmin && (
        <div className="form-panel" style={{ marginBottom: '30px', padding: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', borderBottom: '2px solid #334155', paddingBottom: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {/* Asset creation hidden for DevOps Engineer */}
            {!isDevOps && (
              <button 
                type="button"
                className={activeTab === 'CREATE_ASSET' ? 'btn-primary' : 'btn-glass'}
                onClick={() => handleTabChange('CREATE_ASSET')}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', padding: '10px 16px' }}
              >
                <Server size={18} /> Request Asset Creation
              </button>
            )}
            <button 
              type="button"
              className={activeTab === 'GENERIC_ACTION' ? 'btn-primary' : 'btn-glass'}
              onClick={() => handleTabChange('GENERIC_ACTION')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', padding: '10px 16px' }}
            >
              <Activity size={18} /> Request Custom Action
            </button>
            <button 
              type="button"
              className={activeTab === 'PASSWORD_CHANGE' ? 'btn-primary' : 'btn-glass'}
              onClick={() => handleTabChange('PASSWORD_CHANGE')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', padding: '10px 16px' }}
            >
              <Key size={18} /> Password Reset
            </button>
            <button 
              type="button"
              className={activeTab === 'MESSAGE' ? 'btn-primary' : 'btn-glass'}
              onClick={() => handleTabChange('MESSAGE')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', padding: '10px 16px' }}
            >
              <MessageSquare size={18} /> Message Admin
            </button>
          </div>

          {/* TAB 1: ASSET CREATION REQUEST (Restricted) */}
          {activeTab === 'CREATE_ASSET' && !isDevOps && (
            <form onSubmit={handleAssetSubmit} noValidate>
              <div style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '18px' }}>
                Fill in the technical parameters for the requested infrastructure asset.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'block', marginBottom: '6px', fontWeight: 600 }}>ASSET NAME</label>
                  <input 
                    type="text" placeholder="AWS-K8s-Worker-Node"
                    value={assetForm.name} 
                    onChange={(e) => {
                      setAssetForm({...assetForm, name: e.target.value});
                      if (formErrors.name) setFormErrors({...formErrors, name: null});
                    }}
                    style={{ 
                      width: '100%', padding: '12px', borderRadius: '6px', background: '#0d131d', 
                      border: `1px solid ${formErrors.name ? '#f87171' : '#334155'}`, color: '#fff', fontSize: '1rem' 
                    }} 
                  />
                  {formErrors.name && <span style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{formErrors.name}</span>}
                </div>
                <div>
                  <label style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'block', marginBottom: '6px', fontWeight: 600 }}>IP ADDRESS</label>
                  <input 
                    type="text" placeholder="192.168.1.50"
                    value={assetForm.ip} 
                    onChange={(e) => {
                      setAssetForm({...assetForm, ip: e.target.value});
                      if (formErrors.ip) setFormErrors({...formErrors, ip: null});
                    }}
                    style={{ 
                      width: '100%', padding: '12px', borderRadius: '6px', background: '#0d131d', 
                      border: `1px solid ${formErrors.ip ? '#f87171' : '#334155'}`, color: '#fff', fontFamily: 'monospace', fontSize: '1rem' 
                    }} 
                  />
                  {formErrors.ip && <span style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{formErrors.ip}</span>}
                </div>
                <div>
                  <label style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'block', marginBottom: '6px', fontWeight: 600 }}>ASSET TYPE</label>
                  <select 
                    value={assetForm.type} onChange={(e) => setAssetForm({...assetForm, type: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', background: '#0d131d', border: '1px solid #334155', color: '#fff', fontSize: '1rem' }}
                  >
                    <option value="SERVER">SERVER</option>
                    <option value="CLOUD_AWS">CLOUD_AWS</option>
                    <option value="CLOUD_AZURE">CLOUD_AZURE</option>
                    <option value="K8S_POD">K8S_POD</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'block', marginBottom: '6px', fontWeight: 600 }}>INITIAL HEALTH STATUS</label>
                  <select 
                    value={assetForm.status} onChange={(e) => setAssetForm({...assetForm, status: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', background: '#0d131d', border: '1px solid #334155', color: '#fff', fontSize: '1rem' }}
                  >
                    <option value="HEALTHY">HEALTHY</option>
                    <option value="WARNING">WARNING</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '20px', padding: '12px 24px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={18} /> Submit Asset Creation Request
              </button>
            </form>
          )}

          {/* TAB 2: GENERIC ACTION REQUEST */}
          {activeTab === 'GENERIC_ACTION' && (
            <form onSubmit={handleGenericSubmit} noValidate>
              <div style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '18px' }}>
                Submit an administrative task request or custom operational action.
              </div>
              <div style={{ marginBottom: '16px' }}>
                <input 
                  type="text" placeholder="Action Title (e.g., Provision VPN Tunnel)"
                  value={title} 
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (formErrors.title) setFormErrors({...formErrors, title: null});
                  }}
                  style={{ 
                    width: '100%', padding: '12px', borderRadius: '6px', background: '#0d131d', 
                    border: `1px solid ${formErrors.title ? '#f87171' : '#334155'}`, color: '#fff', fontSize: '1rem' 
                  }} 
                />
                {formErrors.title && <span style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{formErrors.title}</span>}
              </div>
              <div>
                <textarea 
                  placeholder="Describe exact details and requirements..." rows="4"
                  value={messageText} 
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    if (formErrors.messageText) setFormErrors({...formErrors, messageText: null});
                  }}
                  style={{ 
                    width: '100%', padding: '12px', borderRadius: '6px', background: '#0d131d', 
                    border: `1px solid ${formErrors.messageText ? '#f87171' : '#334155'}`, color: '#fff', fontSize: '1rem' 
                  }} 
                />
                {formErrors.messageText && <span style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{formErrors.messageText}</span>}
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '20px', padding: '12px 24px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Send size={18} /> Submit Action Request
              </button>
            </form>
          )}

          {/* TAB 3: PASSWORD CHANGE REQUEST */}
          {activeTab === 'PASSWORD_CHANGE' && (
            <form onSubmit={handlePasswordSubmit} noValidate>
              <div style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '18px' }}>
                Submit a request for system administrator password reset.
              </div>
              <div>
                <input 
                  type="password" placeholder="Requested New Password"
                  value={newPassword} 
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (formErrors.newPassword) setFormErrors({...formErrors, newPassword: null});
                  }}
                  style={{ 
                    width: '100%', padding: '12px', borderRadius: '6px', background: '#0d131d', 
                    border: `1px solid ${formErrors.newPassword ? '#f87171' : '#334155'}`, color: '#fff', fontSize: '1rem' 
                  }} 
                />
                {formErrors.newPassword && <span style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{formErrors.newPassword}</span>}
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '20px', padding: '12px 24px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={18} /> Send Password Reset Request
              </button>
            </form>
          )}

          {/* TAB 4: MESSAGE ADMIN */}
          {activeTab === 'MESSAGE' && (
            <form onSubmit={handleMessageSubmit} noValidate>
              <div style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '18px' }}>
                Send a direct message or inquiry to Security Administrators.
              </div>
              <div style={{ marginBottom: '16px' }}>
                <input 
                  type="text" placeholder="Subject"
                  value={title} 
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (formErrors.title) setFormErrors({...formErrors, title: null});
                  }}
                  style={{ 
                    width: '100%', padding: '12px', borderRadius: '6px', background: '#0d131d', 
                    border: `1px solid ${formErrors.title ? '#f87171' : '#334155'}`, color: '#fff', fontSize: '1rem' 
                  }} 
                />
                {formErrors.title && <span style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{formErrors.title}</span>}
              </div>
              <div>
                <textarea 
                  placeholder="Your message..." rows="4"
                  value={messageText} 
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    if (formErrors.messageText) setFormErrors({...formErrors, messageText: null});
                  }}
                  style={{ 
                    width: '100%', padding: '12px', borderRadius: '6px', background: '#0d131d', 
                    border: `1px solid ${formErrors.messageText ? '#f87171' : '#334155'}`, color: '#fff', fontSize: '1rem' 
                  }} 
                />
                {formErrors.messageText && <span style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>{formErrors.messageText}</span>}
              </div>
              <button type="submit" className="btn-primary" style={{ marginTop: '20px', padding: '12px 24px', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} /> Send Direct Message
              </button>
            </form>
          )}
        </div>
      )}

      {/* PENDING REQUESTS PANEL */}
      <h3 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '16px' }}>
        {isAdmin ? 'Pending Approval Queue' : 'My Active Requests'}
      </h3>

      {pendingRequests.length === 0 ? (
        <div className="form-panel" style={{ textAlign: 'center', color: '#94a3b8', padding: '40px', fontSize: '1.1rem' }}>
          No pending requests in queue at this time.
        </div>
      ) : (
        pendingRequests.map((req) => (
          <div key={req.id} className="form-panel" style={{ marginBottom: '20px', padding: '20px', borderLeft: '5px solid #facc15' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginRight: '12px' }}>
                  {req.title || req.requestType}
                </span>
                <StatusBadge status={req.requestType} /> <StatusBadge status={req.status} />
              </div>
              <button
                className="btn-glass btn-blue"
                style={{ padding: '6px 14px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => handleViewRequest(req)}
                title="View Full Payload"
              >
                <Eye size={16} /> View Details
              </button>
            </div>

            <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', fontSize: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Requester</div>
                <div style={{ fontWeight: 600, color: '#f1f5f9', marginTop: '2px' }}>{req.requester?.email || req.requester?.username}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Submitted At</div>
                <div style={{ color: '#f1f5f9', marginTop: '2px' }}>{req.createdAt ? new Date(req.createdAt).toLocaleString() : '-'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Request ID</div>
                <div style={{ fontFamily: 'monospace', fontWeight: 600, color: '#f1f5f9', marginTop: '2px' }}>#{req.id}</div>
              </div>
            </div>

            <div style={{ marginTop: '14px', fontSize: '0.95rem' }}>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>Details / Payload Preview</div>
              <div style={{ 
                background: '#0d131d', 
                padding: '10px 14px', 
                borderRadius: '6px', 
                fontFamily: 'monospace', 
                fontSize: '0.95rem', 
                color: '#e2e8f0', 
                marginTop: '6px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                border: '1px solid #1e293b'
              }}>
                {req.details}
              </div>
            </div>

            {/* ADMIN APPROVAL ACTIONS */}
            {isAdmin && (
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #334155', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Optional admin comment..."
                  value={adminComments[req.id] || ''}
                  onChange={(e) => setAdminComments({ ...adminComments, [req.id]: e.target.value })}
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', background: '#0d131d', border: '1px solid #334155', color: '#fff', fontSize: '0.95rem' }}
                />
                <button 
                  className="btn-glass"
                  style={{ background: 'rgba(34, 197, 94, 0.25)', color: '#4ade80', border: '1px solid #22c55e', padding: '8px 16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
                  onClick={() => handleProcess(req.id, true)}
                >
                  <CheckCircle2 size={18} /> Approve
                </button>
                <button 
                  className="btn-glass"
                  style={{ background: 'rgba(239, 68, 68, 0.25)', color: '#f87171', border: '1px solid #ef4444', padding: '8px 16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
                  onClick={() => handleProcess(req.id, false)}
                >
                  <XCircle size={18} /> Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}

      {/* REQUEST HISTORY DRAWER */}
      {showHistory && (
        <div className="table-panel" style={{ marginTop: '36px' }}>
          <h4 style={{ padding: '20px', color: '#cbd5e1', fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>
            Processed Request History
          </h4>
          <table className="custom-table" style={{ fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ fontSize: '0.9rem' }}>
                <th style={{ padding: '12px 16px' }}>ID</th>
                <th style={{ padding: '12px 16px' }}>Type</th>
                <th style={{ padding: '12px 16px' }}>Title</th>
                <th style={{ padding: '12px 16px' }}>Requester</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Admin Response</th>
                <th style={{ padding: '12px 16px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {historyRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '30px', fontSize: '1.05rem' }}>
                    No request history records available.
                  </td>
                </tr>
              ) : (
                historyRequests.map((h) => (
                  <tr key={h.id}>
                    <td style={{ fontWeight: 700, padding: '14px 16px' }}>#{h.id}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={h.requestType} /></td>
                    <td style={{ padding: '14px 16px', fontWeight: 500 }}>{h.title}</td>
                    <td style={{ padding: '14px 16px' }}>{h.requester?.email || h.requester?.username}</td>
                    <td style={{ padding: '14px 16px' }}><StatusBadge status={h.status} /></td>
                    <td style={{ padding: '14px 16px', color: '#94a3b8' }}>{h.adminComment || '-'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        className="btn-glass btn-blue"
                        style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onClick={() => handleViewRequest(h)}
                        title="View Details"
                      >
                        <Eye size={16} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW SINGLE REQUEST DETAILS MODAL */}
      {isViewModalOpen && selectedRequest && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
        >
          <div className="form-panel" style={{ width: '580px', marginBottom: 0, padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '1.4rem', fontWeight: 700 }}>Request Details</h3>
              <X size={24} color="#a0aec0" style={{ cursor: 'pointer' }} onClick={() => setIsViewModalOpen(false)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', fontWeight: 600 }}>TITLE / SUBJECT</span>
                <span style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>{selectedRequest.title || 'N/A'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', fontWeight: 600, marginBottom: '4px' }}>REQUEST TYPE</span>
                  <StatusBadge status={selectedRequest.requestType} />
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', fontWeight: 600, marginBottom: '4px' }}>STATUS</span>
                  <StatusBadge status={selectedRequest.status} />
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', fontWeight: 600 }}>REQUESTER</span>
                <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{selectedRequest.requester?.email || selectedRequest.requester?.username}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', fontWeight: 600, marginBottom: '6px' }}>DETAILS / PAYLOAD CONTENT</span>
                <pre style={{ 
                  background: '#0d131d', 
                  padding: '14px', 
                  borderRadius: '6px', 
                  fontFamily: 'monospace', 
                  fontSize: '0.95rem', 
                  color: '#4ade80',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                  maxHeight: '220px',
                  overflowY: 'auto',
                  border: '1px solid #1e293b'
                }}>
                  {selectedRequest.details}
                </pre>
              </div>
              {selectedRequest.adminComment && (
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'block', fontWeight: 600 }}>ADMIN COMMENT</span>
                  <span style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>{selectedRequest.adminComment}</span>
                </div>
              )}
            </div>

            <button
              className="btn-glass btn-blue"
              style={{ marginTop: '28px', width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 600 }}
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}