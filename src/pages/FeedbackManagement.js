import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Card, Button, Alert, Spinner } from '../components/ui';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const PageHeader = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSizes.xxl};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textLight};
  font-size: ${props => props.theme.typography.fontSizes.md};
`;

const Section = styled(Card)`
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSizes.lg};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const SectionDescription = styled.p`
  margin-bottom: ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.textLight};
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: ${props => props.theme.spacing.xs};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-family: inherit;
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-family: inherit;
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
`;

const FeedbackTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: ${props => props.theme.colors.backgroundSecondary};
  
  th {
    padding: ${props => props.theme.spacing.md};
    text-align: left;
    border-bottom: 2px solid ${props => props.theme.colors.border};
  }
`;

const TableBody = styled.tbody`
  tr {
    &:hover {
      background-color: ${props => props.theme.colors.backgroundSecondary};
    }
  }
  
  td {
    padding: ${props => props.theme.spacing.md};
    border-bottom: 1px solid ${props => props.theme.colors.border};
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  text-transform: uppercase;
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  
  background-color: ${props => {
    switch (props.status) {
      case 'received':
        return props.theme.colors.infoLight;
      case 'in_review':
        return props.theme.colors.warningLight;
      case 'completed':
        return props.theme.colors.successLight;
      case 'rejected':
        return props.theme.colors.errorLight;
      default:
        return props.theme.colors.grayLight;
    }
  }};
  
  color: ${props => {
    switch (props.status) {
      case 'received':
        return props.theme.colors.infoDark;
      case 'in_review':
        return props.theme.colors.warningDark;
      case 'completed':
        return props.theme.colors.successDark;
      case 'rejected':
        return props.theme.colors.errorDark;
      default:
        return props.theme.colors.textDark;
    }
  }};
`;

const TypeBadge = styled.span`
  display: inline-block;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => props.theme.typography.fontSizes.xs};
  text-transform: uppercase;
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  
  background-color: ${props => {
    switch (props.type) {
      case 'bug':
        return props.theme.colors.errorLight;
      case 'feature':
        return props.theme.colors.successLight;
      case 'improvement':
        return props.theme.colors.warningLight;
      default:
        return props.theme.colors.grayLight;
    }
  }};
  
  color: ${props => {
    switch (props.type) {
      case 'bug':
        return props.theme.colors.errorDark;
      case 'feature':
        return props.theme.colors.successDark;
      case 'improvement':
        return props.theme.colors.warningDark;
      default:
        return props.theme.colors.textDark;
    }
  }};
`;

const ActionButton = styled(Button)`
  margin-right: ${props => props.theme.spacing.sm};
  
  &:last-child {
    margin-right: 0;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${props => props.theme.spacing.lg};
`;

const PageInfo = styled.div`
  color: ${props => props.theme.colors.textLight};
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${props => props.theme.zIndices.modal};
`;

const scaleAndFadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: ${props => props.theme.spacing.lg};
  animation: ${scaleAndFadeIn} ${props => props.theme.transitions.short} ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding-bottom: ${props => props.theme.spacing.md};
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.typography.fontSizes.xl};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${props => props.theme.typography.fontSizes.xl};
  cursor: pointer;
  color: ${props => props.theme.colors.textLight};
  
  &:hover {
    color: ${props => props.theme.colors.text};
  }
`;

const DetailRow = styled.div`
  margin-bottom: ${props => props.theme.spacing.md};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  margin-right: ${props => props.theme.spacing.sm};
`;

const DetailValue = styled.span`
  color: ${props => props.theme.colors.text};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-family: inherit;
  font-size: ${props => props.theme.typography.fontSizes.md};
  background-color: ${props => props.theme.colors.inputBackground};
  color: ${props => props.theme.colors.text};
  min-height: 100px;
  resize: vertical;
  margin-bottom: ${props => props.theme.spacing.md};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: ${props => props.theme.borderRadius.default};
  padding: ${props => props.theme.spacing.md};
  box-shadow: ${props => props.theme.shadows.small};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StatValue = styled.div`
  font-size: ${props => props.theme.typography.fontSizes.xxl};
  font-weight: ${props => props.theme.typography.fontWeights.bold};
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.colors.textLight};
  text-align: center;
`;

const FeedbackManagement = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredFeedbackList, setFilteredFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertInfo, setAlertInfo] = useState({ show: false, message: '', type: '' });
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [responseNote, setResponseNote] = useState('');
  
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    status: 'all',
    priority: 'all',
    search: ''
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll load from localStorage
    const storedFeedback = JSON.parse(localStorage.getItem('feedbackData')) || [];
    setFeedbackList(storedFeedback);
    setFilteredFeedbackList(storedFeedback);
    setLoading(false);
  }, []);
  
  useEffect(() => {
    let result = [...feedbackList];
    
    // Apply filters
    if (filters.type !== 'all') {
      result = result.filter(item => item.type === filters.type);
    }
    
    if (filters.category !== 'all') {
      result = result.filter(item => item.category === filters.category);
    }
    
    if (filters.status !== 'all') {
      result = result.filter(item => item.status === filters.status);
    }
    
    if (filters.priority !== 'all') {
      result = result.filter(item => item.priority === filters.priority);
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchLower) || 
        item.description.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredFeedbackList(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [feedbackList, filters]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const openFeedbackDetail = (feedback) => {
    setSelectedFeedback(feedback);
    setResponseNote('');
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };
  
  const updateFeedbackStatus = (id, status) => {
    const updatedList = feedbackList.map(item => {
      if (item.id === id) {
        return { 
          ...item, 
          status, 
          lastUpdated: new Date().toISOString(),
          ...(responseNote ? { adminResponse: responseNote } : {})
        };
      }
      return item;
    });
    
    setFeedbackList(updatedList);
    localStorage.setItem('feedbackData', JSON.stringify(updatedList));
    
    setAlertInfo({
      show: true,
      message: `Feedback-Status wurde auf "${getStatusLabel(status)}" aktualisiert.`,
      type: 'success'
    });
    
    closeModal();
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'received':
        return 'Empfangen';
      case 'in_review':
        return 'In Bearbeitung';
      case 'completed':
        return 'Erledigt';
      case 'rejected':
        return 'Abgelehnt';
      default:
        return status;
    }
  };
  
  const getTypeLabel = (type) => {
    switch (type) {
      case 'bug':
        return 'Fehler';
      case 'feature':
        return 'Feature-Vorschlag';
      case 'improvement':
        return 'Verbesserung';
      default:
        return 'Sonstiges';
    }
  };
  
  const getCategoryLabel = (category) => {
    switch (category) {
      case 'training':
        return 'Trainingsplanung';
      case 'tracking':
        return 'Fortschrittsverfolgung';
      case 'nutrition':
        return 'Ernährung';
      case 'ui':
        return 'Benutzeroberfläche';
      case 'other':
        return 'Sonstiges';
      default:
        return category;
    }
  };
  
  // Calculate statistics
  const stats = {
    total: feedbackList.length,
    bugs: feedbackList.filter(item => item.type === 'bug').length,
    features: feedbackList.filter(item => item.type === 'feature').length,
    improvements: feedbackList.filter(item => item.type === 'improvement').length,
    pending: feedbackList.filter(item => ['received', 'in_review'].includes(item.status)).length,
    completed: feedbackList.filter(item => item.status === 'completed').length
  };
  
  // Get paginated data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFeedbackList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFeedbackList.length / itemsPerPage);
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Feedback-Management</Title>
        <Subtitle>Verwalten und analysieren Sie Nutzerfeedback, um die App kontinuierlich zu verbessern</Subtitle>
      </PageHeader>
      
      {alertInfo.show && (
        <Alert 
          type={alertInfo.type} 
          onClose={() => setAlertInfo({ ...alertInfo, show: false })}
        >
          {alertInfo.message}
        </Alert>
      )}
      
      <Section>
        <SectionTitle>Feedback-Übersicht</SectionTitle>
        
        <StatsContainer>
          <StatCard>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Feedback-Einträge gesamt</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.bugs}</StatValue>
            <StatLabel>Fehlerberichte</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.features}</StatValue>
            <StatLabel>Feature-Vorschläge</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.improvements}</StatValue>
            <StatLabel>Verbesserungsvorschläge</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.pending}</StatValue>
            <StatLabel>Ausstehend</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.completed}</StatValue>
            <StatLabel>Erledigt</StatLabel>
          </StatCard>
        </StatsContainer>
        
        <FiltersContainer>
          <FilterGroup>
            <FilterLabel htmlFor="type">Feedback-Typ</FilterLabel>
            <Select 
              id="type" 
              name="type" 
              value={filters.type} 
              onChange={handleFilterChange}
            >
              <option value="all">Alle Typen</option>
              <option value="bug">Fehler</option>
              <option value="feature">Feature-Vorschlag</option>
              <option value="improvement">Verbesserung</option>
              <option value="other">Sonstiges</option>
            </Select>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel htmlFor="category">Kategorie</FilterLabel>
            <Select 
              id="category" 
              name="category" 
              value={filters.category} 
              onChange={handleFilterChange}
            >
              <option value="all">Alle Kategorien</option>
              <option value="training">Trainingsplanung</option>
              <option value="tracking">Fortschrittsverfolgung</option>
              <option value="nutrition">Ernährung</option>
              <option value="ui">Benutzeroberfläche</option>
              <option value="other">Sonstiges</option>
            </Select>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel htmlFor="status">Status</FilterLabel>
            <Select 
              id="status" 
              name="status" 
              value={filters.status} 
              onChange={handleFilterChange}
            >
              <option value="all">Alle Status</option>
              <option value="received">Empfangen</option>
              <option value="in_review">In Bearbeitung</option>
              <option value="completed">Erledigt</option>
              <option value="rejected">Abgelehnt</option>
            </Select>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel htmlFor="priority">Priorität</FilterLabel>
            <Select 
              id="priority" 
              name="priority" 
              value={filters.priority} 
              onChange={handleFilterChange}
            >
              <option value="all">Alle Prioritäten</option>
              <option value="high">Hoch</option>
              <option value="medium">Mittel</option>
              <option value="low">Niedrig</option>
            </Select>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel htmlFor="search">Suche</FilterLabel>
            <SearchInput 
              id="search" 
              name="search" 
              value={filters.search} 
              onChange={handleFilterChange}
              placeholder="Nach Titel oder Beschreibung suchen..."
            />
          </FilterGroup>
        </FiltersContainer>
        
        {loading ? (
          <Spinner centered size="60px" />
        ) : filteredFeedbackList.length === 0 ? (
          <p>Keine Feedback-Einträge gefunden.</p>
        ) : (
          <>
            <FeedbackTable>
              <TableHead>
                <tr>
                  <th>Titel</th>
                  <th>Typ</th>
                  <th>Kategorie</th>
                  <th>Priorität</th>
                  <th>Status</th>
                  <th>Datum</th>
                  <th>Aktionen</th>
                </tr>
              </TableHead>
              <TableBody>
                {currentItems.map(feedback => (
                  <tr key={feedback.id}>
                    <td>{feedback.title}</td>
                    <td>
                      <TypeBadge type={feedback.type}>
                        {getTypeLabel(feedback.type)}
                      </TypeBadge>
                    </td>
                    <td>{getCategoryLabel(feedback.category)}</td>
                    <td>{feedback.priority === 'high' ? 'Hoch' : feedback.priority === 'medium' ? 'Mittel' : 'Niedrig'}</td>
                    <td>
                      <StatusBadge status={feedback.status}>
                        {getStatusLabel(feedback.status)}
                      </StatusBadge>
                    </td>
                    <td>{formatDate(feedback.date)}</td>
                    <td>
                      <ActionButton 
                        variant="primary" 
                        size="small" 
                        onClick={() => openFeedbackDetail(feedback)}
                      >
                        Details
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </TableBody>
            </FeedbackTable>
            
            <Pagination>
              <PageInfo>
                Zeige {indexOfFirstItem + 1} bis {Math.min(indexOfLastItem, filteredFeedbackList.length)} von {filteredFeedbackList.length} Einträgen
              </PageInfo>
              <PaginationButtons>
                <Button 
                  variant="secondary" 
                  size="small" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Zurück
                </Button>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Weiter
                </Button>
              </PaginationButtons>
            </Pagination>
          </>
        )}
      </Section>
      
      {isModalOpen && selectedFeedback && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{selectedFeedback.title}</ModalTitle>
              <CloseButton onClick={closeModal}>×</CloseButton>
            </ModalHeader>
            
            <DetailRow>
              <DetailLabel>Typ:</DetailLabel>
              <DetailValue>
                <TypeBadge type={selectedFeedback.type}>
                  {getTypeLabel(selectedFeedback.type)}
                </TypeBadge>
              </DetailValue>
            </DetailRow>
            
            <DetailRow>
              <DetailLabel>Kategorie:</DetailLabel>
              <DetailValue>{getCategoryLabel(selectedFeedback.category)}</DetailValue>
            </DetailRow>
            
            <DetailRow>
              <DetailLabel>Priorität:</DetailLabel>
              <DetailValue>
                {selectedFeedback.priority === 'high' ? 'Hoch' : 
                 selectedFeedback.priority === 'medium' ? 'Mittel' : 'Niedrig'}
              </DetailValue>
            </DetailRow>
            
            <DetailRow>
              <DetailLabel>Status:</DetailLabel>
              <DetailValue>
                <StatusBadge status={selectedFeedback.status}>
                  {getStatusLabel(selectedFeedback.status)}
                </StatusBadge>
              </DetailValue>
            </DetailRow>
            
            <DetailRow>
              <DetailLabel>Datum:</DetailLabel>
              <DetailValue>{formatDate(selectedFeedback.date)}</DetailValue>
            </DetailRow>
            
            <DetailRow>
              <DetailLabel>Beschreibung:</DetailLabel>
              <DetailValue>{selectedFeedback.description}</DetailValue>
            </DetailRow>
            
            {selectedFeedback.email && (
              <DetailRow>
                <DetailLabel>Kontakt:</DetailLabel>
                <DetailValue>{selectedFeedback.email}</DetailValue>
              </DetailRow>
            )}
            
            {selectedFeedback.adminResponse && (
              <DetailRow>
                <DetailLabel>Antwort:</DetailLabel>
                <DetailValue>{selectedFeedback.adminResponse}</DetailValue>
              </DetailRow>
            )}
            
            <hr />
            
            <h4>Status ändern</h4>
            <TextArea
              placeholder="Notizen oder Antwort an den Benutzer (optional)"
              value={responseNote}
              onChange={(e) => setResponseNote(e.target.value)}
            />
            
            <div>
              <ActionButton 
                onClick={() => updateFeedbackStatus(selectedFeedback.id, 'in_review')}
                disabled={selectedFeedback.status === 'in_review'}
              >
                In Bearbeitung
              </ActionButton>
              <ActionButton 
                onClick={() => updateFeedbackStatus(selectedFeedback.id, 'completed')}
                disabled={selectedFeedback.status === 'completed'}
              >
                Erledigt
              </ActionButton>
              <ActionButton 
                variant="secondary"
                onClick={() => updateFeedbackStatus(selectedFeedback.id, 'rejected')}
                disabled={selectedFeedback.status === 'rejected'}
              >
                Ablehnen
              </ActionButton>
            </div>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default FeedbackManagement; 