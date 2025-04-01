// src/pages/admin/AdminOrganizations.tsx 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
    Button,
    Card,
    Flex,
    Heading, 
    Placeholder,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Text,
    View 
} from "@aws-amplify/ui-react";
import { MdAdd } from "react-icons/md";

import { 
    getAllOrganizationsBasic,
    getOrganizationBasicById
} from "../../api/models/organizationApi";

import "./AdminOrganizations.css";

// Define the Organization type based on the schema
type Nullable<T> = T | null;

type Organization = {
    id: string;
    name: string;
    description: Nullable<string>;
    logo: Nullable<string>;
    industry: Nullable<string>;
    size: Nullable<number>;
    website: Nullable<string>;
    createdAt: Nullable<string>;
    updatedAt: Nullable<string>;
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

const AdminOrganizations = () => {
    const navigate = useNavigate();
    
    // States
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);

    // Load organization data
    useEffect(() => {
        const loadOrgs = async () => {
            // Query the API to get the list of organizations
            console.log("Loading organizations...");
            setLoading(true);

            // Fetch data from API
            try {
                const orgs = await getAllOrganizationsBasic();
                if (orgs) {
                    setOrganizations(orgs);
                } else {
                    console.error("No organizations found");
                }
            } catch (error) {
                console.error("Error fetching organizations:", error);
            } finally {
                setLoading(false);
            }
        };

        loadOrgs();
    }, []);

    const handleOrganizationClick = (orgId: string) => {
        navigate(`/admin/organizations/${orgId}`);
    };

    const handleCreateOrganization = () => {
        navigate("/admin/organizations/create");
    };

    return (
        <>
            <div className="page-header">
                <Heading level={2}>Organizations</Heading>
                <Button
                    onClick={handleCreateOrganization}
                    className="create-btn"
                >
                    <Flex alignItems="center">
                        <MdAdd size={20} color="black" />
                        <Text>Create Organization</Text>
                    </Flex>
                </Button>
            </div>

            <View
                borderRadius="6px"
                maxWidth="100%"
                padding="0rem"
                minHeight="calc(100vh - 120px)"
            >
                <Card borderRadius="15px">
                    <h3 style={{ marginTop: 0 }}>All Organizations</h3>

                    {loading ? (
                        <Flex direction="column" minHeight="285px">
                            <Placeholder size="small" />
                            <Placeholder size="small" />
                            <Placeholder size="small" />
                            <Placeholder size="small" />
                        </Flex>
                    ) : (
                        <Table highlightOnHover={true}>
                            <TableHead>
                                <TableRow>
                                    <TableCell as="th">Name</TableCell>
                                    <TableCell as="th">Industry</TableCell>
                                    <TableCell as="th">Size</TableCell>
                                    <TableCell as="th">Website</TableCell>
                                    <TableCell as="th">Last Updated</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {organizations?.map((org) => (
                                    <TableRow key={org.id}>
                                        <TableCell>
                                            <a
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleOrganizationClick(org.id);
                                                }}
                                                className="organization-link"
                                            >
                                                {org.name}
                                            </a>
                                        </TableCell>
                                        <TableCell>{org.industry || "N/A"}</TableCell>
                                        <TableCell>{formatOrgSize(org.size)}</TableCell>
                                        <TableCell>
                                            {org.website ? (
                                                <a href={org.website} target="_blank" rel="noopener noreferrer">
                                                    {org.website.replace(/^https?:\/\/(www\.)?/, '')}
                                                </a>
                                            ) : (
                                                "N/A"
                                            )}
                                        </TableCell>
                                        <TableCell>{formatDate(org.updatedAt)}</TableCell>
                                    </TableRow>
                                ))}
                                {organizations.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <Text textAlign="center">No organizations found.</Text>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </Card>
            </View>
        </>
    );
};

export default AdminOrganizations;