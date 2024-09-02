import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  HStack,
  Stack,
  Collapse,
  Icon,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Image,
  Badge,
  Container,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { Link as RouterLink } from "react-router-dom";
import NAV_ITEMS, { NavItem } from "./navItems";
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const navigate = useNavigate();

  return (
    <Box
      position="fixed"
      w="100%"
      h={14}
      zIndex={3}
      bg={useColorModeValue("#FFFFFF99", "#1A202C99")}
      color={useColorModeValue("gray.600", "white")}
      backdropFilter="blur(5px)"
      borderBottom={1}
      borderStyle="solid"
      borderColor={useColorModeValue("gray.200", "gray.900")}
    >
      <Container maxW="container.lg" p={0}>
        <Flex py={{ base: 2 }} px={{ base: 4 }}>
          <Flex
            flex={{ base: 1, md: "auto" }}
            ml={-2}
            display={{ base: "flex", md: "none" }}
          >
            <IconButton
              onClick={onToggle}
              icon={
                isOpen ? (
                  <CloseIcon w={3} h={3} />
                ) : (
                  <HamburgerIcon w={5} h={5} />
                )
              }
              variant="ghost"
              aria-label="Toggle Navigation"
            />
          </Flex>
          <Flex flex={{ base: 2 }} justify={{ base: "center", md: "start" }}>
            <HStack>
              <Image
                src="/assets/logo.svg"
                boxSize="30px"
                objectFit="contain"
                onClick={() => navigate("")}
                cursor="pointer"
                draggable={false}
              />
              <Text
                textAlign={useBreakpointValue({ base: "center", md: "left" })}
                fontFamily="heading"
                fontSize="lg"
                color={useColorModeValue("gray.800", "white")}
                fontWeight="semibold"
                as={RouterLink}
                to=""
              >
                crystalcube
              </Text>
              <Flex display={{ base: "none", sm: "flex" }}>
                <VersionBadge />
              </Flex>
            </HStack>
            <Flex display={{ base: "none", md: "flex" }} ml={10}>
              <DesktopNav />
            </Flex>
          </Flex>

          <Stack
            flex={{ base: 1, md: 0 }}
            justify="flex-end"
            direction="row"
            spacing={6}
            mr={-2}
          >
            {/* <Button
              as="a"
              fontSize="sm"
              fontWeight={400}
              variant="link"
              href="#">
              Sign In
            </Button>
            <Button
              display={{ base: "none", md: "inline-flex" }}
              fontSize="sm"
              fontWeight={600}
              color="white"
              bg="cyan.500"
              href="#"
              _hover={{
                bg: "cyan.400",
              }}>
              Sign Up
            </Button> */}
            <ColorModeSwitcher />
          </Stack>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <MobileNav onClose={onClose} />
        </Collapse>
      </Container>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const buttonColor = useColorModeValue("#EDF2F7", "#2C313D");

  return (
    <Stack direction="row" spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
              <Button
                as={navItem.href ? RouterLink : undefined}
                // href={navItem.href ?? "#"
                to={navItem.href ?? ""}
                fontWeight={500}
                color={linkColor}
                bg="none"
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                  bg: buttonColor,
                }}
              >
                {navItem.label}
              </Button>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow="xl"
                bg={popoverContentBgColor}
                p={4}
                rounded="xl"
                minW="sm"
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Link
      // href={href}
      as={href ? RouterLink : undefined}
      to={href ?? ""}
      role="group"
      display="block"
      p={2}
      rounded="md"
      _hover={{ bg: useColorModeValue("cyan.50", "gray.900") }}
    >
      <Stack direction="row" align="center">
        <Box>
          <Text
            transition="all .3s ease"
            _groupHover={{ color: "cyan.500" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize="sm">{subLabel}</Text>
        </Box>
        <Flex
          transition="all .3s ease"
          transform="translateX(-10px)"
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify="flex-end"
          align="center"
          flex={1}
        >
          <Icon color="cyan.500" w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Link>
  );
};

interface MobileNavProps {
  onClose: () => void;
}
const MobileNav = ({ onClose }: MobileNavProps) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} onClose={onClose} />
      ))}
    </Stack>
  );
};

type MobileNavItemProps = NavItem & MobileNavProps;
const MobileNavItem = ({
  label,
  children,
  href,
  onClose,
}: MobileNavItemProps) => {
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={children ? undefined : RouterLink}
        to={href ?? ""}
        onClick={children ? undefined : onClose}
        justify="space-between"
        align="center"
        cursor="pointer"
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition="all .25s ease-in-out"
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle="solid"
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align="start"
        >
          {children &&
            children.map((child) => (
              <Link
                as={child.href ? RouterLink : undefined}
                key={child.label}
                py={2}
                to={child.href ?? ""}
                onClick={onClose}
              >
                {child.label}
              </Link>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

const VersionBadge = () => <Badge textTransform="none">v{APP_VERSION}</Badge>;
