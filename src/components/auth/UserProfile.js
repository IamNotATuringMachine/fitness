import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeProvider';
import { FaUser, FaSignOutAlt, FaCog, FaCloud, FaDownload, FaChevronDown, FaSun, FaMoon } from 'react-icons/fa';

const ProfileContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.theme.colors.primary}10;
    border-color: ${props => props.theme.colors.primary};
  }

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 0.5rem;
    
    .username {
      display: none;
    }
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`;

const ChevronIcon = styled(FaChevronDown)`
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: ${props => props.theme.colors.cardBackground};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-10px)'};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
`;

const DropdownHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const UserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.25rem;
`;

const UserEmail = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.9rem;
  text-align: left;

  &:hover {
    background: ${props => props.theme.colors.primary}10;
  }

  &:first-child {
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }

  &:last-child {
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }

  &.danger {
    color: #ff4757;
    
    &:hover:not(:disabled) {
      background: #ff475710;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      background: none;
    }
  }
`;

const SyncStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const SyncIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.synced ? '#2ed573' : '#ffa502'};
`;

export default function UserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, signOut, saveUserDataToCloud, loadUserDataFromCloud } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);
      setSyncStatus('syncing');
      console.log('🔧 UserProfile: Starting logout process...');
      const result = await signOut();
      
      if (!result.success) {
        console.error('🔧 UserProfile: Logout failed:', result.error);
        setIsLoggingOut(false);
        setSyncStatus('error');
      } else {
        console.log('🔧 UserProfile: Logout successful');
        // Keep isLoggingOut true until auth state changes
      }
    } catch (error) {
      console.error('🔧 UserProfile: Sign out error:', error);
      setIsLoggingOut(false);
      setSyncStatus('error');
    }
  };

  const handleSyncToCloud = async () => {
    try {
      setSyncStatus('syncing');
      const result = await saveUserDataToCloud();
      if (result.success) {
        setSyncStatus('synced');
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      console.error('Sync to cloud error:', error);
      setSyncStatus('error');
    }
  };

  const handleLoadFromCloud = async () => {
    try {
      setSyncStatus('syncing');
      const result = await loadUserDataFromCloud();
      if (result.success) {
        setSyncStatus('synced');
        // Refresh the page to load the new data
        window.location.reload();
      } else {
        setSyncStatus('error');
      }
    } catch (error) {
      console.error('Load from cloud error:', error);
      setSyncStatus('error');
    }
  };

  if (!user) return null;

  const getInitials = (name) => {
    if (!name) return user.email?.charAt(0).toUpperCase() || 'U';
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const displayName = user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  const initials = getInitials(user.user_metadata?.name);

  return (
    <ProfileContainer ref={dropdownRef}>
      <ProfileButton onClick={() => setIsOpen(!isOpen)}>
        <Avatar>{initials}</Avatar>
        <span className="username">{displayName}</span>
        <ChevronIcon isOpen={isOpen} />
      </ProfileButton>

      <DropdownMenu isOpen={isOpen}>
        <DropdownHeader>
          <UserName>{displayName}</UserName>
          <UserEmail>{user.email}</UserEmail>
        </DropdownHeader>

        <SyncStatus>
          <SyncIndicator synced={syncStatus === 'synced'} />
          {syncStatus === 'synced' && 'Daten synchronisiert'}
          {syncStatus === 'syncing' && 'Synchronisiere...'}
          {syncStatus === 'error' && 'Sync-Fehler'}
        </SyncStatus>

        <DropdownItem onClick={() => setIsOpen(false)}>
          <FaUser />
          Profil bearbeiten
        </DropdownItem>

        <DropdownItem onClick={() => {
          navigate('/settings');
          setIsOpen(false);
        }}>
          <FaCog />
          Einstellungen
        </DropdownItem>

        <DropdownItem onClick={() => {
          toggleTheme();
          setIsOpen(false);
        }}>
          {theme === 'light' ? <FaMoon /> : <FaSun />}
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </DropdownItem>

        <DropdownItem onClick={handleSyncToCloud}>
          <FaCloud />
          In Cloud speichern
        </DropdownItem>

        <DropdownItem onClick={handleLoadFromCloud}>
          <FaDownload />
          Aus Cloud laden
        </DropdownItem>

        <DropdownItem onClick={handleSignOut} className="danger" disabled={isLoggingOut}>
          <FaSignOutAlt />
          {isLoggingOut ? 'Abmeldung läuft...' : 'Abmelden'}
        </DropdownItem>
      </DropdownMenu>
    </ProfileContainer>
  );
} 