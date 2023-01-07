import React from "react";
import axios from "axios";
import moment from "moment";
import { useContext, useState, useEffect, useCallback } from "react";
import { UserContext } from "../App";
import { useSocket } from "../context/socketProvider";
import Image from "react-bootstrap/Image";
import { styled } from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import ListItem from "@mui/material/ListItem";
import Avatar from "@mui/material/Avatar";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import OnlineBadge from "../styled_components/onlineBadge";
import OfflineBadge from "../styled_components/offlineBadge";

function Contacts(props) {
  var { user } = useContext(UserContext);
  const socket = useSocket();
  const [friends, setFriends] = useState([]);
  const [localSelectedChat, setLocalSelectedChat] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [error, setError] = useState(null);
  const [offlineFriend, setOfflineFriend] = useState(null);
  const startChat = async (frndID) => {
    var myID = user._id;
    var friendId = frndID;
    try {
      var userIds = [myID, friendId];
      var res = await axios.post(
        "http://localhost:3001/api/rooms/chat/chat-open",
        {
          userIds,
        }
      );
      var chatRoom = await res.data.chatRoom.room;

      if (res.data.chatRoom.isNew) {
        console.log("created room");

        setChatRooms((prevState) => [chatRoom, ...prevState]);
      }
      // send selected chat info to open it
      props.setSelectedChat(chatRoom);
      props.setOpenChat(true);
      // mark all messages as readed in db when chat opens
      var chatRoomId = chatRoom._id;
      markMessagesAsReaded(myID, chatRoomId);

      // join room
      socket.emit("join", chatRoom);
    } catch (err) {
      setError(err);
    }
  };

  const markMessagesAsReaded = async (userId, chatRoomId) => {
    try {
      var res = await axios.post(
        "http://localhost:3001/api/messages/chatRoom/mark-read",
        {
          userId: userId,
          chatRoomId: chatRoomId,
        }
      );
    } catch (err) {
      setError(err);
    }
  };
  const getUnreadedMessages = async (userId, chatRoomId) => {
    try {
      var res = await axios.post(
        "http://localhost:3001/api/messages/all/unread",
        {
          userId: userId,
          chatRoomId: chatRoomId,
        }
      );
      var messagesCount = await res.data.msgs.length;
      return messagesCount;
    } catch (err) {
      setError(err);
    }
  };

  const getFriends = useCallback(async () => {
    try {
      var id = user._id;
      var url = `http://localhost:3001/api/contacts/${id}/friends`;
      var res = await axios.post(url);
      var data = await res.data.friends;
      setFriends(data);
      console.log("friends", data);
    } catch (err) {
      setError(err);
    }
  }, [user]);

  useEffect(() => {
    /* const getFriends = async () => {
      try {
        var id = user._id;
        var url = `http://localhost:3001/api/contacts/${id}/friends`;
        var res = await axios.post(url);
        var data = await res.data.friends;
        setFriends(data);
        console.log('friends',data);
      } catch (err) {
        setError(err);
      }
    };*/
    const getAllChatRooms = async () => {
      var userId = user._id;
      var url = "http://localhost:3001/api/user/all-rooms/join";
      try {
        var res = await axios.post(
          `http://localhost:3001/api/${userId}/all-rooms/join`
        );
        var rooms = await res.data.rooms;
        console.log("my rooms", rooms);
        // set unreaded messages for each chat
        rooms = await Promise.all(
          rooms.map(async (room) => {
            var roomId = room._id;
            var count = await getUnreadedMessages(user._id, roomId);
            room.unreadedMessages = count;
            return room;
          })
        );
        setChatRooms(rooms);
      } catch (error) {
        console.log(error);
      }
    };
    getAllChatRooms();

    getFriends();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("offline", (data) => {
        setTimeout(() => {
          console.log("listen to offline", friends);
          if (friends.length > 1) {
            let update = [];
            friends.map((fr) => {
              if (fr._id == data.id) {
                console.log("offlineeeeeeeee", fr);
                update.push({ ...fr, isOnline: "false" });
                return;
              }
              update.push(fr);
            });

            setFriends(update);
            console.log("newFriends", friends);
          }
        }, 4000);
      });
      socket.on("message", (message) => {
        console.log("got msg", message);
        var updatedChatRooms = [];

        chatRooms.forEach((room) => {
          if (room._id == message.chatRoom) {
            room.messages = [...room.messages, message];
            room.unreadedMessages += 1;
            updatedChatRooms.push(room);
          } else {
            updatedChatRooms.push(room);
          }
        });
        if (updatedChatRooms.length > 0) {
          setChatRooms(updatedChatRooms);
        }
      });
      socket.on("photo message", (message) => {
        var updatedChatRooms = chatRooms.map((room) => {
          if (room._id == message.msg.chatRoom) {
            room.messages = [...room.messages, message.msg];
            room.unreadedMessages += 1;
            return room;
          }
          return room;
        });

        if (updatedChatRooms.length > 0) {
          setChatRooms(updatedChatRooms);
        }
      });

      socket.on("voice message", (message) => {
        console.log("got msg", message);
        var updatedChatRooms = chatRooms.map((room) => {
          if (room._id == message.msg.chatRoom) {
            room.messages = [...room.messages, message.msg];
            room.unreadedMessages += 1;

            return room;
          }
          return room;
        });

        console.log("rooms", updatedChatRooms);
        if (updatedChatRooms.length > 0) {
          console.log("update rooms");
          setChatRooms(updatedChatRooms);
          console.log("updated", updatedChatRooms);
        }
      });
    }
  }, [socket,friends]);

  useEffect(() => {
    if (props.addedFriend) {
      setFriends((prevState) => [props.addedFriend, ...prevState]);
    }
  }, [props.addedFriend]);

  return (
    <div>
      <div className="my-2 p-2 bg-light">
        {friends.length > 0 ? (
          <div className="d-flex">
            {friends.map((fr) => (
              <div
                onClick={() => startChat(fr._id)}
                className="mx-2"
                key={fr._id}
              >
                {fr.isOnline === "true" && (
                  <OnlineBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar alt={fr.username} src={fr.avatarURL} />
                  </OnlineBadge>
                )}
                {fr.isOnline === "false" && (
                  <OfflineBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                  >
                    <Avatar alt={fr.username} src={fr.avatarURL} />
                  </OfflineBadge>
                )}
                <div>{fr.username}</div>
              </div>
            ))}
          </div>
        ) : (
          "No friends"
        )}
      </div>
      <div>
        {chatRooms.length > 0 ? (
          <>
            {chatRooms.map((r) => (
              <div>
                {r.userIds.map((fr) =>
                  fr._id !== user._id ? (
                    <div>
                      <ListItem onClick={() => startChat(fr._id)}>
                        <ListItemAvatar>
                          <Avatar alt={fr.username} src={fr.avatarURL} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={fr.username}
                          secondary={
                            r.messages.length > 0 ? (
                              r.messages[r.messages.length - 1].type ===
                              "photo" ? (
                                <div>PHOTO MESSAGE</div>
                              ) : r.messages[r.messages.length - 1].type ===
                                "voice" ? (
                                <div>VOICE MESSAGE</div>
                              ) : (
                                <div>
                                  {r.messages[r.messages.length - 1].message}
                                </div>
                              )
                            ) : (
                              ""
                            )
                          }
                        />
                        {r.unreadedMessages > 0 ? (
                          <div
                            className="bg-primary rounded-circle text-light text-center me-5"
                            style={{ width: "22px", height: "22px" }}
                          >
                            <div className="fs-6 fw-bold">
                              {r.unreadedMessages}{" "}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                        <div>
                          {r.messages.length > 0 ? (
                            <div>
                              {moment(
                                r.messages[r.messages.length - 1].timestamp
                              ).format("MMM Do YY") ===
                              moment(new Date()).format("MMM Do YY")
                                ? moment(
                                    r.messages[r.messages.length - 1].timestamp
                                  ).format(" h:mm a")
                                : moment(
                                    r.messages[r.messages.length - 1].timestamp
                                  ).format(" h:mm a, MMM Do YY")}
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </ListItem>
                    </div>
                  ) : (
                    ""
                  )
                )}
              </div>
            ))}
          </>
        ) : (
          "No chats"
        )}
      </div>
    </div>
  );
}

export default Contacts;
