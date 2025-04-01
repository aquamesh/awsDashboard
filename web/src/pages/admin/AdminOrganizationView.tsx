// src/pages/admin/AdminOrganizationView.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Card,
  Divider,
  Flex,
  Heading,
  Image,
  Loader,
  SelectField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Text,
  TextField,
  View
} from "@aws-amplify/ui-react";
import { MdAdd, MdArrowBack, MdEdit, MdPerson } from "react-icons/md";

// API imports
import { getOrganizationBasicById, getOrganizationWithMembersById } from "../../api/models/organizationApi";
import { getAllUsers, joinOrganization } from "../../api/models/userApi";
import { useAuthenticator } from "@aws-amplify/ui-react";

// Import CSS
import "./AdminOrganizations.css";

// Define nullable type helper
type Nullable<T> = T | null;

// Type for Organization with members
type OrganizationWithMembers = {
  id: string;
  name: string;
  description: Nullable<string>;
  logo: Nullable<string>;
  address: Nullable<string>;
  city: Nullable<string>;
  state: Nullable<string>;
  zipCode: Nullable<string>;
  country: Nullable<string>;
  website: Nullable<string>;
  industry: Nullable<string>;
  size: Nullable<number>;
  createdAt: Nullable<string>;
  updatedAt: Nullable<string>;
  members: OrganizationMember[];
};

// Type for Organization Member
type OrganizationMember = {
  role: string;
  user: {
    id: string;
    email: string;
    firstName: Nullable<string>;
    lastName: Nullable<string>;
  };
};

// Type for User
type User = {
  id: string;
  email: string;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
};

// Helper function to format date
const formatDate = (dateString: Nullable<string>) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString();
};

// Helper function to format organization size
const formatOrgSize = (size: Nullable<number>) => {
  if (size === null || size === undefined) return "N/A";
  if (size < 10) return "1-9";
  if (size < 50) return "10-49";
  if (size < 100) return "50-99";
  if (size < 500) return "100-499";
  return "500+";
};

// Helper function to get user display name
const getUserDisplayName = (user: { firstName: Nullable<string>; lastName: Nullable<string>; email: string }) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  } else if (user.firstName) {
    return user.firstName;
  } else if (user.lastName) {
    return user.lastName;
  }
  return user.email;
};

const AdminOrganizationView = () => {
  const { organizationId } = useParams<{ organizationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthenticator();
  
  // State for organization data
  const [organization, setOrganization] = useState<OrganizationWithMembers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for add user modal
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("User");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [addUserError, setAddUserError] = useState<string | null>(null);
  const [addUserSuccess, setAddUserSuccess] = useState(false);
  
  // Load organization data
  useEffect(() => {
    const loadOrganization = async () => {
      if (!organizationId) {
        setError("Organization ID is required");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch organization with members using the dedicated API function
        const org = await getOrganizationWithMembersById(organizationId);
        
        if (!org) {
          setError("Organization not found");
          setLoading(false);
          return;
        }
        
        // Use the organization data directly without adding mock members
        setOrganization(org);
      } catch (err) {
        console.error("Error loading organization:", err);
        setError("Failed to load organization details");
      } finally {
        setLoading(false);
      }
    };
    
    loadOrganization();
  }, [organizationId]);
  
  // Load available users for the modal
  const loadAvailableUsers = async () => {
    try {
      // Get all users from the API
      const allUsers = await getAllUsers();
      
      if (!allUsers) {
        setAddUserError("Failed to load available users");
        return;
      }
      
      // Filter out users who are already members of the organization
      const existingMemberIds = organization?.members?.map(member => member.user.id) || [];
      const filteredUsers = allUsers.filter(user => !existingMemberIds.includes(user.id));
      
      setAvailableUsers(filteredUsers);
    } catch (err) {
      console.error("Error loading available users:", err);
      setAddUserError("Failed to load available users");
    }
  };
  
  // Handle back button click
  const handleBackClick = () => {
    navigate("/admin/organizations");
  };
  
  // Handle open add user modal
  const handleOpenAddUserModal = () => {
    setIsAddUserModalOpen(true);
    setSelectedUserId("");
    setSelectedRole("User");
    setAddUserError(null);
    setAddUserSuccess(false);
    
    // Load available users
    loadAvailableUsers();
  };
  
  // Handle close add user modal
  const handleCloseAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };
  
  // Handle add user submission
  const handleAddUser = async () => {
    if (!selectedUserId) {
      setAddUserError("Please select a user");
      return;
    }
    
    if (!selectedRole) {
      setAddUserError("Please select a role");
      return;
    }
    
    setIsAddingUser(true);
    setAddUserError(null);
    
    try {
      // Call the API to add user to organization
      const result = await joinOrganization(
        selectedUserId,
        organization?.id || '',
        selectedRole,
        user.userId // Current user as the inviter
      );
      
      if (!result) {
        setAddUserError("Failed to add user to organization");
        setIsAddingUser(false);
        return;
      }
      
      // Get the added user details to update the UI
      const addedUser = availableUsers.find(u => u.id === selectedUserId);
      
      // Update the UI to show the new member
      if (organization && addedUser) {
        const newMember = {
          role: selectedRole,
          user: addedUser
        };
        
        setOrganization({
          ...organization,
          members: [...(organization.members || []), newMember]
        });
      }
      
      setAddUserSuccess(true);
      
      // Close modal after a short delay
      setTimeout(() => {
        setIsAddUserModalOpen(false);
        // Reset success state after modal closes
        setTimeout(() => {
          setAddUserSuccess(false);
        }, 300);
      }, 1500);
    } catch (err) {
      console.error("Error adding user to organization:", err);
      setAddUserError("Failed to add user to organization");
    } finally {
      setIsAddingUser(false);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <Flex direction="column" alignItems="center" padding="2rem">
        <Loader size="large" />
        <Text>Loading organization details...</Text>
      </Flex>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Flex direction="column" alignItems="center" padding="2rem">
        <Alert variation="error" heading="Error">
          {error}
        </Alert>
        <Button onClick={handleBackClick} marginTop="1rem">
          <Flex alignItems="center">
            <MdArrowBack size={20} />
            <Text marginLeft="0.5rem">Back to Organizations</Text>
          </Flex>
        </Button>
      </Flex>
    );
  }
  
  // Render organization view
  if (!organization) {
    return (
      <Flex direction="column" alignItems="center" padding="2rem">
        <Alert variation="warning" heading="Not Found">
          Organization not found
        </Alert>
        <Button onClick={handleBackClick} marginTop="1rem">
          <Flex alignItems="center">
            <MdArrowBack size={20} />
            <Text marginLeft="0.5rem">Back to Organizations</Text>
          </Flex>
        </Button>
      </Flex>
    );
  }
  
  return (
    <>
      <div className="page-header">
        <Flex alignItems="center">
          <Button onClick={handleBackClick} variation="link">
            <MdArrowBack size={20} />
          </Button>
          <Heading level={2} marginLeft="0.5rem">
            {organization.name}
          </Heading>
        </Flex>
        <Button onClick={() => navigate(`/admin/organizations/${organizationId}/edit`)}>
          <Flex alignItems="center">
            <MdEdit size={20} />
            <Text marginLeft="0.5rem">Edit Organization</Text>
          </Flex>
        </Button>
      </div>
      
      <View
        borderRadius="6px"
        maxWidth="100%"
        padding="0rem"
        minHeight="calc(100vh - 120px)"
      >
        {/* Organization Details Card */}
        <Card borderRadius="15px" marginBottom="1.5rem">
          <Flex justifyContent="space-between" alignItems="flex-start">
            <div>
              <h3 style={{ marginTop: 0 }}>Organization Details</h3>
              
              <Flex direction="column" gap="1rem">
                <Flex>
                  <Text fontWeight="bold" minWidth="150px">ID:</Text>
                  <Text>{organization.id}</Text>
                </Flex>
                
                <Flex>
                  <Text fontWeight="bold" minWidth="150px">Name:</Text>
                  <Text>{organization.name}</Text>
                </Flex>
                
                <Flex>
                  <Text fontWeight="bold" minWidth="150px">Description:</Text>
                  <Text>{organization.description || "N/A"}</Text>
                </Flex>
                
                <Flex>
                  <Text fontWeight="bold" minWidth="150px">Industry:</Text>
                  <Text>{organization.industry || "N/A"}</Text>
                </Flex>
                
                <Flex>
                  <Text fontWeight="bold" minWidth="150px">Size:</Text>
                  <Text>{formatOrgSize(organization.size)}</Text>
                </Flex>
                
                <Flex>
                  <Text fontWeight="bold" minWidth="150px">Website:</Text>
                  {organization.website ? (
                    <a href={organization.website} target="_blank" rel="noopener noreferrer">
                      {organization.website}
                    </a>
                  ) : (
                    <Text>N/A</Text>
                  )}
                </Flex>
                
                <Flex>
                  <Text fontWeight="bold" minWidth="150px">Address:</Text>
                  <Text>
                    {[
                      organization.address,
                      organization.city,
                      organization.state,
                      organization.zipCode,
                      organization.country
                    ].filter(Boolean).join(", ") || "N/A"}
                  </Text>
                </Flex>
                
                <Flex>
                  <Text fontWeight="bold" minWidth="150px">Created:</Text>
                  <Text>{formatDate(organization.createdAt)}</Text>
                </Flex>
                
                <Flex>
                  <Text fontWeight="bold" minWidth="150px">Last Updated:</Text>
                  <Text>{formatDate(organization.updatedAt)}</Text>
                </Flex>
              </Flex>
            </div>
            
            {/* Organization Logo */}
            {organization.logo && (
              <Image
                src={organization.logo}
                alt={`${organization.name} logo`}
                width="150px"
                height="150px"
                objectFit="contain"
                borderRadius="8px"
              />
            )}
          </Flex>
        </Card>
        
        {/* Members Card */}
        <Card borderRadius="15px">
          <Flex justifyContent="space-between" alignItems="center">
            <h3 style={{ marginTop: 0 }}>Organization Members</h3>
            <Button onClick={handleOpenAddUserModal}>
              <Flex alignItems="center">
                <MdAdd size={20} />
                <Text marginLeft="0.5rem">Add User</Text>
              </Flex>
            </Button>
          </Flex>
          
          <Table highlightOnHover={true}>
            <TableHead>
              <TableRow>
                <TableCell as="th">User</TableCell>
                <TableCell as="th">Email</TableCell>
                <TableCell as="th">Role</TableCell>
                <TableCell as="th">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {organization.members.map((member) => (
                <TableRow key={member.user.id}>
                  <TableCell>
                    <Flex alignItems="center">
                      <MdPerson size={20} style={{ marginRight: '8px' }} />
                      {getUserDisplayName(member.user)}
                    </Flex>
                  </TableCell>
                  <TableCell>{member.user.email}</TableCell>
                  <TableCell>
                    <Badge variation={member.role === "Owner" ? "success" : "info"}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="small" variation="link">
                      Edit Role
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {organization.members.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Text textAlign="center">No members found.</Text>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </View>
      
      {/* Add User Custom Modal */}
      {isAddUserModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseAddUserModal}>
          <Card className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <Heading level={4} margin="0">
                Add User to Organization
              </Heading>
              <Button 
                variation="link" 
                onClick={handleCloseAddUserModal}
                aria-label="Close"
              >
                ✕
              </Button>
            </div>
            
            <div className="modal-body">
              {addUserError && (
                <Alert variation="error" isDismissible={false} heading="Error">
                  {addUserError}
                </Alert>
              )}
              
              {addUserSuccess && (
                <Alert variation="success" isDismissible={false} heading="Success">
                  User successfully added to the organization! Closing...
                </Alert>
              )}
              
              <Flex direction="column" gap="1rem" marginTop="1rem">
                <SelectField
                  label="Select User"
                  placeholder="Choose a user to add"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  isDisabled={isAddingUser || addUserSuccess}
                >
                  <option value="">Select a user</option>
                  {availableUsers.map((user) => (
                    <option key={user.id} value={user.id}>
                      {getUserDisplayName(user)} ({user.email})
                    </option>
                  ))}
                </SelectField>
                
                <SelectField
                  label="Role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  isDisabled={isAddingUser || addUserSuccess}
                >
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </SelectField>
              </Flex>
            </div>
            
            <div className="modal-footer">
              <Button
                onClick={handleCloseAddUserModal}
                isDisabled={isAddingUser}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddUser}
                variation="primary"
                isLoading={isAddingUser}
                loadingText="Adding..."
                isDisabled={!selectedUserId || !selectedRole || addUserSuccess}
              >
                Add User
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default AdminOrganizationView;