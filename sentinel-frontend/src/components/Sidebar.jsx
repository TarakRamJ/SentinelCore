import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Server, ShieldAlert, Bug, Activity, Bell, Users, ClipboardList } from 'lucide-react';

export const Sidebar = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/alerts" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bell size={18} /> Active Alerts
          </NavLink>
        </li>
        <li>
          <NavLink to="/assets" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Server size={18} /> Asset Inventory
          </NavLink>
        </li>
        <li>
          <NavLink to="/incidents" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <ShieldAlert size={18} /> Incidents
          </NavLink>
        </li>
        <li>
          <NavLink to="/vulnerabilities" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Bug size={18} /> Vulnerabilities
          </NavLink>
        </li>
        <li>
          <NavLink to="/metrics" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Activity size={18} /> System Metrics
          </NavLink>
        </li>

        {/* REQUESTS LINK FOR ALL LOGGED-IN USERS */}
        <li>
          <NavLink to="/requests" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <ClipboardList size={18} /> Requests & Messages
          </NavLink>
        </li>

        {/* ADMIN ONLY LINK */}
        {user?.role === 'ADMIN' && (
          <li>
            <NavLink to="/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Users size={18} /> Manage Users
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
};