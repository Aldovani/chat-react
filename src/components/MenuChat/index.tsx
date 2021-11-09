import React from "react";
import { RiArrowDownSLine } from "react-icons/ri";

import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
// import { Container } from './styles';

const MenuChat = ({ actions }: any) => {
  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<RiArrowDownSLine />}
        _expanded={{ bg: "blue.400" }}
        _focus={{ boxShadow: "outline" }}
      >
        Config
      </MenuButton>
      <MenuList>
        <MenuItem onClick={actions.pauseChat}>Pause Chat</MenuItem>
        <MenuItem onClick={actions.clearChat}>Clear Chat</MenuItem>
        <MenuItem onClick={actions.pauseChat}>Close room</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default MenuChat;
