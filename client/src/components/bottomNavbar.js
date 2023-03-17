import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import VideoCallRoundedIcon from "@mui/icons-material/VideoCallRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import Paper from "@mui/material/Paper";

function BottomNavbar({ setKey }) {
  const [value, setValue] = useState(0);
  const getKey = (value) => {
    value === 0
      ? setKey("chats")
      : value === 1
      ? setKey("calls")
      : value === 2
      ? setKey("contacts")
      : setKey("settings");
  };
  const ref = useRef(null);

  useEffect(() => {
    ref.current.ownerDocument.body.scrollTop = 0;
  }, [value]);

  return (
    <div>
      <Box sx={{ pb: 7 }} ref={ref}>
        <CssBaseline />
        <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          elevation={24}
        >
          <BottomNavigation
            showLabels
            value={value}
            sx={{ display: "flex", justifyContent: "space-between" }}
            onChange={(event, newValue) => {
              setValue(newValue);
              getKey(newValue);
            }}
          >
            <BottomNavigationAction
              label="Chats"
              icon={<ChatBubbleRoundedIcon />}
            />
            <BottomNavigationAction
              label="Calls"
              icon={<VideoCallRoundedIcon />}
            />
            <BottomNavigationAction
              label="People"
              icon={<PeopleRoundedIcon />}
            />
            <BottomNavigationAction
              label="settings"
              icon={<SettingsRoundedIcon />}
            />
          </BottomNavigation>
        </Paper>
      </Box>
    </div>
  );
}

export default BottomNavbar;
