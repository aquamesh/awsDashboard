// src/components/Footer/Footer.tsx
import React from "react";
import "./Footer.css";
import {
  Icon,
  Flex,
  Heading,
  Text,
  Link,
  Divider,
  View
} from "@aws-amplify/ui-react";

import {
  MdArticle,
  MdHelpOutline,
  MdPeople,
  MdPhone,
  MdWork,
  MdEmail
} from "react-icons/md";

// Add props interface with hideSideBar
interface FooterProps {
  hideSideBar?: boolean;
}

const Footer = ({ hideSideBar }: FooterProps) => {
  // Create className based on the boolean value
  const footerClassName = `footer ${hideSideBar ? 'no-sidebar' : ''}`;

  return (
    <div className={footerClassName}>
      <Flex
        direction={{ base: 'column', medium: 'row' }}
        justifyContent="space-between"
        // gap="2rem"
        wrap="wrap"
      >
        {/* Rest of the footer content remains the same */}
        <View flex="1" minWidth="200px">
          <Heading level={4}>AquaMesh</Heading>
          <Text marginTop="0.5rem">Empowering marine monitoring through advanced IoT solutions</Text>
          <Text marginTop="1rem" fontSize="0.9rem" color="rgba(0, 0, 0, 0.6)">
            © AquaMesh {new Date().getFullYear()}
          </Text>
        </View>

        {/* ... Rest of the footer content ... */}
        <View flex="1" minWidth="200px">
          <Heading level={4}>Resources</Heading>
          <Flex direction="column" marginTop="0.5rem" gap="0.5rem">
            <Link href="/docs" color="inherit">
              <Flex alignItems="center" gap="0.5rem">
                <Icon as={MdArticle} />
                <Text>Documentation</Text>
              </Flex>
            </Link>
            <Link href="/blog" color="inherit">
              <Flex alignItems="center" gap="0.5rem">
                <Icon as={MdArticle} />
                <Text>Blog</Text>
              </Flex>
            </Link>
            <Link href="/support" color="inherit">
              <Flex alignItems="center" gap="0.5rem">
                <Icon as={MdHelpOutline} />
                <Text>Support</Text>
              </Flex>
            </Link>
          </Flex>
        </View>

        <View flex="1" minWidth="200px">
          <Heading level={4}>Company</Heading>
          <Flex direction="column" marginTop="0.5rem" gap="0.5rem">
            <Link href="/about" color="inherit">
              <Flex alignItems="center" gap="0.5rem">
                <Icon as={MdPeople} />
                <Text>About Us</Text>
              </Flex>
            </Link>
            <Link href="/contact" color="inherit">
              <Flex alignItems="center" gap="0.5rem">
                <Icon as={MdPhone} />
                <Text>Contact</Text>
              </Flex>
            </Link>
            <Link href="/careers" color="inherit">
              <Flex alignItems="center" gap="0.5rem">
                <Icon as={MdWork} />
                <Text>Careers</Text>
              </Flex>
            </Link>
          </Flex>
        </View>

        <View flex="1" minWidth="200px">
          <Heading level={4}>Connect</Heading>
          <Flex direction="row" marginTop="1rem" gap="1rem">
            <Link href="https://twitter.com/aquamesh" aria-label="Twitter">
              <Icon ariaLabel="Twitter" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
              </Icon>
            </Link>
            <Link href="https://github.com/aquamesh" aria-label="GitHub">
              <Icon ariaLabel="GitHub" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
              </Icon>
            </Link>
            <Link href="https://linkedin.com/company/aquamesh" aria-label="LinkedIn">
              <Icon ariaLabel="LinkedIn" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </Icon>
            </Link>
          </Flex>
          <View marginTop="1rem">
            <Link href="mailto:contact@aquamesh.io" color="inherit">
              <Flex alignItems="center" gap="0.5rem">
                <Icon as={MdEmail} />
                <Text>contact@aquamesh.io</Text>
              </Flex>
            </Link>
          </View>
        </View>

        <Divider orientation="horizontal" width="100%" marginTop="1rem" />
        <Flex width="100%" justifyContent="space-between" fontSize="0.8rem" color="rgba(0, 0, 0, 0.6)">
          <Text>Privacy Policy</Text>
          <Text>Terms of Service</Text>
          <Text>Cookie Policy</Text>
        </Flex>
      </Flex>
    </div>
  );
};

export default Footer;