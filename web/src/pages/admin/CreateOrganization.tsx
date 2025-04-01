// src/pages/admin/CreateOrganization.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Flex,
  Heading,
  SelectField,
  Text,
  TextField,
  View,
  Alert
} from "@aws-amplify/ui-react";
import { createOrganization } from "../../api/models/organizationApi";
import { useAuthenticator } from "@aws-amplify/ui-react";

import "./AdminOrganizations.css";

// Industry options for dropdown
const industryOptions = [
  "Select industry",
  "Agriculture",
  "Energy",
  "Environmental",
  "Manufacturing",
  "Research",
  "Education",
  "Government",
  "Other"
];

const CreateOrganization = () => {
  const navigate = useNavigate();
  const { user } = useAuthenticator();
  
  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  
  // Status state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form validation
  const isFormValid = name.trim().length > 0;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setError("Organization name is required");
      return;
    }

    setIsSubmitting(true);
    setError("");
    
    try {
      const orgData = {
        name: name.trim(),
        description: description.trim() || null,
        industry: industry || null,
        website: website.trim() || null
      };
      
      // Create the organization
      const result = await createOrganization(orgData, user.userId);
      
      if (result) {
        setSuccess(true);
        // Redirect after a short delay to show success message
        setTimeout(() => {
          navigate("/admin/organizations");
        }, 1500);
      } else {
        setError("Failed to create organization. Please try again.");
      }
    } catch (err) {
      console.error("Error creating organization:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/organizations");
  };

  return (
    <>
      <div className="page-header">
        <Heading level={2}>Create Organization</Heading>
      </div>

      <View
        borderRadius="6px"
        maxWidth="100%"
        padding="0rem"
        minHeight="calc(100vh - 120px)"
      >
        <Card borderRadius="15px" maxWidth="800px" margin="0 auto">
          <h3 style={{ marginTop: 0 }}>New Organization</h3>
          
          {error && (
            <Alert variation="error" isDismissible={false} heading="Error">
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variation="success" isDismissible={false} heading="Success">
              Organization created successfully! Redirecting...
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="1rem">
              <TextField
                label="Organization Name"
                placeholder="Enter organization name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                isDisabled={isSubmitting || success}
                hasError={!isFormValid && name !== ""}
                errorMessage="Organization name is required"
              />
              
              <TextField
                label="Description"
                placeholder="Enter organization description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                isDisabled={isSubmitting || success}
              />
              
              <SelectField
                label="Industry"
                placeholder="Select industry (optional)"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                isDisabled={isSubmitting || success}
              >
                <option value="">Select industry</option>
                <option value="agriculture">Agriculture</option>
                <option value="energy">Energy</option>
                <option value="environmental">Environmental</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="research">Research</option>
                <option value="education">Education</option>
                <option value="government">Government</option>
                <option value="other">Other</option>
              </SelectField>
              
              <TextField
                label="Website"
                placeholder="https://example.com (optional)"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                isDisabled={isSubmitting || success}
                type="url"
              />
              
              <Flex justifyContent="flex-end" gap="1rem" marginTop="1rem">
                <Button
                  type="button"
                  onClick={handleCancel}
                  isDisabled={isSubmitting || success}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variation="primary"
                  isLoading={isSubmitting}
                  loadingText="Creating..."
                  isDisabled={!isFormValid || success}
                >
                  Create Organization
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card>
      </View>
    </>
  );
};

export default CreateOrganization;