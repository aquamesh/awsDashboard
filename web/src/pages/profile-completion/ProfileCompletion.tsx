// src/pages/profile-completion/ProfileCompletion.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  View,
  Flex,
  Card,
  Heading,
  Text,
  TextField,
  Button,
  SelectField,
  useTheme,
  Loader,
  Alert,
  Badge,
  TextAreaField
} from "@aws-amplify/ui-react";
import { AuthUser } from "aws-amplify/auth";

import { getUserById, updateUserProfile } from "../../api/models/userApi";
import "./ProfileCompletion.css";

interface ProfileCompletionProps {
  user: AuthUser;
}

// Define the main setup stages
export enum UserSetupStage {
  INITIAL = "INITIAL",
  BASIC_INFO = "BASIC_INFO",
  ORGANIZATION_SELECTION = "ORGANIZATION_SELECTION",
  BIO_INFORMATION = "BIO_INFORMATION",
  COMPLETE = "COMPLETE"
}

// Define sub-stages for a more granular approach
interface SetupStep {
  id: string;
  title: string;
  description: string;
}

const ProfileCompletion: React.FC<ProfileCompletionProps> = ({ user }) => {
  const { tokens } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    jobTitle: "",
    industry: "",
    location: "",
    bio: ""
  });

  // Current main stage from the database
  const [currentStage, setCurrentStage] = useState<UserSetupStage>(UserSetupStage.INITIAL);

  // Current step in the UI flow (more granular than the main stages)
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  // Direction of transition (for animation)
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');

  // Define all the steps in the setup process
  const setupSteps: SetupStep[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Welcome to our platform! Let\'s set up your account.',
    },
    {
      id: 'name',
      title: 'Your Name',
      description: 'Tell us your first and last name.',
    },
    // {
    //   id: 'contact',
    //   title: 'Contact Information',
    //   description: 'How can we reach you?',
    // },
    {
      id: 'job',
      title: 'Professional Info',
      description: 'Tell us about your role and location.',
    },
    {
      id: 'bio',
      title: 'About You',
      description: 'Share a brief bio about yourself.',
    },
    {
      id: 'complete',
      title: 'All Set!',
      description: 'Your profile is now complete.',
    }
  ];

  // Fetch the user's current state
  useEffect(() => {
    const checkUserSetupStage = async () => {
      if (user && user.userId) {
        try {
          setLoading(true);
          const userData = await getUserById(user.userId);

          if (userData) {
            // If user setup is already complete, redirect to dashboard
            if (userData.userSetupStage === UserSetupStage.COMPLETE) {
              navigate("/");
              return;
            }

            // Set the current stage from the database
            setCurrentStage(userData.userSetupStage as UserSetupStage || UserSetupStage.INITIAL);

            // Pre-fill any existing data
            setFormData({
              firstName: userData.firstName || "",
              lastName: userData.lastName || "",
              phoneNumber: userData.phoneNumber || "",
              email: userData.email || user.username || "",
              jobTitle: userData.jobTitle || "",
              industry: userData.industry || "",
              location: userData.location || "",
              bio: userData.bio || ""
            });

            // Set the current step index based on the stage
            if (userData.userSetupStage === UserSetupStage.BASIC_INFO) {
              setCurrentStepIndex(1); // Start at name step
            } else if (userData.userSetupStage === UserSetupStage.ORGANIZATION_SELECTION) {
              setCurrentStepIndex(3); // Start at job step
            } else if (userData.userSetupStage === UserSetupStage.BIO_INFORMATION) {
              setCurrentStepIndex(4); // Start at bio step
            }
          }

          setError(null);
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to load user data");
        } finally {
          setLoading(false);
        }
      }
    };

    checkUserSetupStage();
  }, [user, navigate]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Move to the next step
  const handleNext = async () => {
    // Validate current step
    if (!validateCurrentStep()) {
      return;
    }

    // If this is a step that requires saving to the database
    if (shouldSaveAtStep(currentStepIndex)) {
      await saveCurrentProgress();
    }

    // Animate forward
    setTransitionDirection('forward');

    // Move to next step
    setCurrentStepIndex(prev => prev + 1);
  };

  // Move to the previous step
  const handleBack = () => {
    // Animate backward
    setTransitionDirection('backward');

    // Move to previous step
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  };

  // Check if we should update the database at this step
  const shouldSaveAtStep = (stepIndex: number): boolean => {
    // Save at specific transition points
    return stepIndex === 2 || stepIndex === 4 || stepIndex === 5;
  };

  // Validate the current step's data
  const validateCurrentStep = (): boolean => {
    switch (setupSteps[currentStepIndex].id) {
      case 'name':
        if (!formData.firstName || !formData.lastName) {
          setError("Please provide both your first and last name");
          return false;
        }
        break;
      case 'contact':
        if (!formData.email) {
          setError("Please provide your email address");
          return false;
        }
        // Basic email validation
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          setError("Please provide a valid email address");
          return false;
        }
        break;
      case 'job':
        if (!formData.jobTitle) {
          setError("Please provide your job title");
          return false;
        }
        if (!formData.location) {
          setError("Please provide your location");
          return false;
        }
        if (!formData.industry) {
          setError("Please select your industry");
          return false;
        }
        break;
      case 'bio':
        if (!formData.bio) {
          setError("Please provide a short bio");
          return false;
        }
        break;
    }

    setError(null);
    return true;
  };

  // Save progress to the database
  const saveCurrentProgress = async () => {
    if (!user?.userId) return;

    setSaving(true);
    try {
      // Determine which main stage we're in based on the current step
      let nextStage: UserSetupStage;

      if (currentStepIndex <= 2) {
        nextStage = UserSetupStage.BASIC_INFO;
      } else if (currentStepIndex <= 4) {
        nextStage = UserSetupStage.ORGANIZATION_SELECTION;
      } else if (currentStepIndex === 5) {
        nextStage = UserSetupStage.BIO_INFORMATION;
      } else {
        nextStage = UserSetupStage.COMPLETE;
      }

      // Update the user's profile with the form data and the new stage
      await updateUserProfile(user.userId, {
        ...formData,
        userSetupStage: nextStage
      });

      // Update local state
      setCurrentStage(nextStage);

      // If we've completed the setup, redirect to dashboard
      if (nextStage === UserSetupStage.COMPLETE) {
        setTimeout(() => {
          navigate("/");
        }, 2000); // Small delay for animation
        return;
      }

      setError(null);
    } catch (err) {
      console.error("Error updating user profile:", err);
      setError("Failed to update profile information");
    } finally {
      setSaving(false);
    }
  };

  // Complete the setup process
  const handleComplete = async () => {
    if (!user?.userId) return;

    setSaving(true);
    try {
      // Update the user's profile with COMPLETE stage
      await updateUserProfile(user.userId, {
        ...formData,
        userSetupStage: UserSetupStage.COMPLETE
      });

      // Redirect to dashboard
      navigate("/");
    } catch (err) {
      console.error("Error completing profile setup:", err);
      setError("Failed to complete profile setup");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="profile-completion-container">
        <Card className="profile-completion-card">
          <Flex direction="column" alignItems="center" justifyContent="center">
            <Loader size="large" />
            <Text marginTop="1rem">Loading your profile information...</Text>
          </Flex>
        </Card>
      </View>
    );
  }

  // Render the progress indicator
  const renderProgressIndicator = () => {
    return (
      <div className="profile-completion-step-indicator">
        {setupSteps.map((step, index) => (
          <div
            key={step.id}
            className="profile-completion-step"
            onClick={() => {
              // Only allow clicking on completed steps
              if (index < currentStepIndex) {
                setTransitionDirection('backward');
                setCurrentStepIndex(index);
              }
            }}
          >
            <div
              className={`profile-completion-step-circle ${index === currentStepIndex
                  ? 'profile-completion-step-active'
                  : index < currentStepIndex
                    ? 'profile-completion-step-completed'
                    : 'profile-completion-step-pending'
                }`}
            >
              {index < currentStepIndex ? '✓' : index + 1}
            </div>
            <Text
              fontSize="0.75rem"
              fontWeight={index === currentStepIndex ? 'bold' : 'normal'}
            >
              {step.title}
            </Text>
          </div>
        ))}
      </div>
    );
  };

  // Render the current step content
  const renderStepContent = () => {
    const currentStep = setupSteps[currentStepIndex];

    switch (currentStep.id) {
      case 'welcome':
        return (
          <div className="profile-completion-step-content">
            <img
              src="https://placehold.co/600x400"
              alt="Company Logo"
              className="profile-completion-welcome-image"
            />
          </div>
        );

      case 'name':
        return (
          <div className="profile-completion-step-content">
            <Flex direction="column" gap="1rem" width="100%">
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                isRequired
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                isRequired
              />
            </Flex>
          </div>
        );

      case 'contact':
        return (
          <div className="profile-completion-step-content">
            <Flex direction="column" gap="1rem" width="100%">
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                type="email"
                isRequired
              />
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                type="tel"
              />
            </Flex>
          </div>
        );

      case 'job':
        return (
          <div className="profile-completion-step-content">
            <Flex direction="column" gap="1rem" width="100%">
              <TextField
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                placeholder="Enter your job title"
                isRequired
              />
              <SelectField
                label="Industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                isRequired
              >
                <option value="">Select an industry</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="retail">Retail</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </SelectField>
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your location (city, state, country)"
                isRequired
              />
            </Flex>
          </div>
        );

      case 'bio':
        return (
          <div className="profile-completion-step-content">
            <Flex direction="column" gap="1rem" width="100%">
              <TextAreaField
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Share a brief description about yourself"
                rows={5}
                isRequired
              />
            </Flex>
          </div>
        );

      case 'complete':
        return (
          <div className="profile-completion-step-content">
            <Flex direction="row" justifyContent="center" marginBottom="2rem">
              <Badge size="large" variation="success">Setup Complete</Badge>
            </Flex>
          </div>
        );

      default:
        return null;
    }
  };

  // Render the navigation buttons
  const renderNavButtons = () => {
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === setupSteps.length - 1;

    return (
      <Flex direction="row" justifyContent="space-between" width="100%" marginTop="2rem">
        {!isFirstStep && (
          <Button
            onClick={handleBack}
            isDisabled={saving}
            variation="link"
          >
            Back
          </Button>
        )}

        <div style={{ flexGrow: 1 }}></div>

        {!isLastStep ? (
          <Button
            onClick={handleNext}
            isLoading={saving}
          >
            {shouldSaveAtStep(currentStepIndex) ? 'Save & Continue' : 'Continue'}
          </Button>
        ) : (
          <Button
            onClick={handleComplete}
            isLoading={saving}
            variation="primary"
          >
            Go to Dashboard
          </Button>
        )}
      </Flex>
    );
  };

  return (
    console.log("Rendering ProfileCompletion component"),
    <div className="profile-completion-container">
      <Card className="profile-completion-card">
        {error && (
          <Alert
            variation="error"
            isDismissible={true}
            hasIcon={true}
            marginBottom="1rem"
            onDismiss={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Progress indicator */}
        {renderProgressIndicator()}

        {/* Step title and description */}
        <div className="profile-completion-header">
          <Heading level={3}>{setupSteps[currentStepIndex].title}</Heading>
          <Text variation="tertiary">{setupSteps[currentStepIndex].description}</Text>
        </div>

        {/* Step content with animation */}
        <div className={`profile-completion-content-wrapper ${transitionDirection}`}>
          {renderStepContent()}
        </div>

        {/* Navigation buttons */}
        {renderNavButtons()}
      </Card>
    </div>
  );
};

export default ProfileCompletion;