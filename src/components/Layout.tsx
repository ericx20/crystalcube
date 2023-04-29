import { Outlet } from "react-router-dom";
import NavBar from "./NavBar/NavBar";
import { Container } from "@chakra-ui/react";

export default function Layout() {
  return (
    <>
      <NavBar />
      <Container as="main" px={0} pt={14} maxW="100vw">
        <Outlet />
      </Container>
    </>
  );
}
