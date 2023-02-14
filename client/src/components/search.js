import React from "react";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import CloseButton from "react-bootstrap/CloseButton";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { UserContext } from "../App";
import OutlinedInput from "@mui/material/OutlinedInput";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import {
  BootstrapDialog,
  BootstrapDialogTitle,
} from "../styled_components/bootstrapDialog";
import {
  DialogContent,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";

function Search(props) {
  var { user, setUser } = useContext(UserContext);
  const [form, setForm] = useState("");
  const [resultOpen, setResultOpen] = useState(false);
  const [searchResult, setSearchResult] = useState([]);

  const handleChange = (e) => {
    setForm(e.target.value);
  };
  const closeResult = () => {
    setResultOpen(false);
  };
  const handleClose = () => {
    setResultOpen(false);
  };
  const addFriend = async (contactId) => {
    try {
      var url = `http://localhost:3001/api/${user._id}/${contactId}`;
      var res = await axios.post(url);
      let success = res.data.success
      if(success){
        var addedFriend = await res.data.addedFriend;
      var updatedUser =res.data.user
      setUser(updatedUser);
      localStorage.setItem("CHAT_APP_user", JSON.stringify(updatedUser));
      props.setAddedFriend(addedFriend);
      closeResult();
      }
      
    } catch (error){
      console.log(error)
    }
  };
  const searchContacts = async (e) => {
    e.preventDefault();
    try {
      var url = "http://localhost:3001/api/contacts-search";

      var res = await axios.post(url, {
          search: form,
          userId:user._id
      });
      let success = res.data.success;
      if(success){
        setResultOpen(true);
        setSearchResult(res.data.result);
        setForm("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <Form onSubmit={searchContacts} className="mb-3">
        <OutlinedInput
          value={form}
          onChange={handleChange}
          placeholder="Search...."
          required
          fullWidth
          color="primary"
          size="small"
          sx={{backgroundColor:'grey.100'}}
          id="outlined-adornment-weight"
          startAdornment={<i className="bi bi-search me-3"></i>}
          endAdornment={
            <Button
              type="submit"
              className="text-capitalize"
              variant="contained"
              color="primary"
              style={{
                position: "absolute",
                right: "0",
                height: "100%",
                borderTopLeftRadius: "0",
                borderBottomLeftRadius: "0",
              }}
            >
              Search
            </Button>
          }
          aria-describedby="outlined-weight-helper-text"
          inputProps={{
            "aria-label": "weight",
          }}
        />
      </Form>

      {resultOpen ? (
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={resultOpen}
          fullWidth={true}
          maxWidth="sm"
        >
          <BootstrapDialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
            className="text-center"
          >
            Search
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Typography>We found {searchResult.length} result(s).</Typography>

            {searchResult.length > 0
              ? searchResult.map((e) => (
                  <div className="d-flex flex-justify-between">
                    <ListItem onClick={()=>props.openProfile(e._id)}
                      style={{cursor:'pointer'}}
                    >
                      <ListItemAvatar>
                        <Avatar alt={e.username} src={e.avatarURL} />
                      </ListItemAvatar>
                      <ListItemText primary={e.username} />
                    </ListItem>
                    {user.friends.includes(e._id) ? (
                      ""
                    ) : (
                      <Button
                        size="small"
                        onClick={()=>addFriend(e._id)}
                        className="text-capitalize"
                      >
                        Follow
                      </Button>
                    )}
                  </div>
                ))
              : "No item found"}
          </DialogContent>
        </BootstrapDialog>
      ) : (
        ""
      )}
    </div>
  );
}

export default Search;
