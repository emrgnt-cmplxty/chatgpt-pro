import { useState, useRef, useEffect, useContext } from "react";
import Message from "./Message";
import { ChatContext } from "../context/chatContext";
import Thinking from "./Thinking";
import ReactDOM from "react-dom";
import {
  AppBar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Close, Send } from "@mui/icons-material";
import { useMemo } from "react";

const fetchCompletion = async (prompt, messages, gptVersion) => {
  const response = await fetch("/api/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, messages, gptVersion }),
  });
  const data = await response.json();
  return data;
};

const template = [
  {
    title: "Learn about physics",
    prompt: "What can you teach me about general relativity?",
  },
  {
    title: "Learn about computers",
    prompt: "How do computers work?",
  },
  {
    title: "Learn about biology",
    prompt: "What is the central dogma of biology?",
  },
  {
    title: "Learn about chemistry",
    prompt: "What is the difference between an acid and a base?",
  },
];

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const ChatView = () => {
  const messagesEndRef = useRef();
  const inputRef = useRef();
  const [formValue, setFormValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const [initialMessageInjected, setInitialMessageInjected] = useState(false);
  const [modalContext, setModalContext] = useState(null);
  const [visibleContext, setVisibleContext] = useState(false);
  const [context, setContext] = useState([]);
  const [sendingMessage, setSendingMessage] = useState(false);

  const initialMessageProcessed = useRef(false);
  const [
    ,
    currentConversation,
    selectConversation,
    addConversation,
    ,
    addMessage,
    ,
    removeLastMessage,
  ] = useContext(ChatContext);

  const messages = useMemo(() => {
    return currentConversation ? currentConversation.messages : [];
  }, [currentConversation]);

  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */
  const updateMessage = (newValue, ai = false, context = {}) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
      context: context,
    };
    addMessage(newMsg);
  };

  /**
   * Sends our prompt to our API and get response to our request from openai.
   *
   * @param {Event} e - The submit event of the form.
   */
  const sendMessage = async (e, initialMessage = null) => {
    e?.preventDefault(); // e will be undefined when called programmatically
    const messageToSend = initialMessage || formValue;
    const cleanPrompt = messageToSend; //replaceProfanities(messageToSend);

    // this stops spammers
    if(messageToSend == "" || messageToSend == " " || messageToSend == null) {
      return;
    }


    setThinking(true);
    setFormValue("");

    updateMessage(cleanPrompt, false, {});
    try {
      const LLMresponse = await fetchCompletion(
        cleanPrompt,
        messages,
        "sciphi-alpha"
      );

      ReactDOM.unstable_batchedUpdates(() => {
        LLMresponse &&
          updateMessage(LLMresponse.response, true, LLMresponse.context);
        setThinking(false);
      });
    } catch (err) {
      window.alert(`Error: ${err} please try again later`);
      setThinking(false);
    }

    setThinking(false);
  };

  const regenerateMessage = async (e) => {
    e?.preventDefault(); // e will be undefined when called programmatically

    // start thinking process
    setThinking(true);
    // do we want to reset user input?
    setFormValue("");

    const messagesCopy = [...messages];
    messagesCopy.pop();

    // remove last message
    removeLastMessage();

    try {
      const regeneratedMessage = await fetchCompletion(
        messagesCopy[messagesCopy.length - 1].text,
        messagesCopy,
        "sciphi-alpha"
      );

      ReactDOM.unstable_batchedUpdates(() => {
        regeneratedMessage &&
          updateMessage(
            regeneratedMessage.response,
            true,
            regeneratedMessage.context
          );
        setThinking(false);
      });
    } catch (err) {
      setThinking(false);
    }
    setThinking(false);
  };

  useEffect(() => {
    const getInitialMessage = () => {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get("initialMessage");
    };
    const initialMessage = getInitialMessage();
    // Check sessionStorage and state
    const isInjected =
      sessionStorage.getItem("initialMessageInjected") ||
      initialMessageInjected;

    if (initialMessage && !isInjected) {
      initialMessageProcessed.current = true;
      addConversation()
      sendMessage(null, initialMessage);
      // Mark as injected in both sessionStorage and local state
      sessionStorage.setItem("initialMessageInjected", "true");
      setInitialMessageInjected(true);
    }
  }, []);

  /**
   * Sets the modal context to the message id when the user clicks on a message.
   * @param {number} id - The id of the message.
   */
  const setModalContextHandler = (id) => {
    if (messages.length) {
      const filteredMessage = messages.filter((message) => message.id === id);
      if (filteredMessage) {
        setContext(filteredMessage[0].context);
      }
    }
    setModalContext(id);
  };

  /**
   * Sets the modal context to null when the user clicks outside of the modal.
   */
  const setModalContextNull = () => {
    setModalContext(null);
  };

  useEffect(() => {
    if (modalContext !== null) {
      setVisibleContext(true);
    } else {
      setVisibleContext(false);
    }
  }, [modalContext]);

  /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */
  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  /**
   * Focuses the TextArea input to when the component is first rendered.
   */
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <>
      <Dialog
        open={visibleContext}
        onClose={setModalContextNull}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Retrieved Context</DialogTitle>
        <DialogActions>
          <IconButton
            onClick={setModalContextNull}
            sx={{ position: "absolute", right: "8px", top: "8px" }}
          >
            <Close />
          </IconButton>
        </DialogActions>

        <DialogContent dividers>
          <Grid container spacing={2}>
            {context.map((item, index) => (
              <Grid item xs={12} sm={6} md={6} key={index}>
                <Card variant="outlined">
                  <CardActionArea>
                    <CardHeader title={`${index + 1} - ${item.title}`} />
                    <CardContent>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {item.text}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <Box sx={{ height: "96px" }}> </Box>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            p: 2,
          }}
        >
          {messages.length ? (
            messages.map((message, index) => (
              <Message
                key={index}
                message={{ ...message }}
                regen={(e) => regenerateMessage(e)}
                viewModal={(id) => {
                  setModalContextHandler(id);
                }}
              />
            ))
          ) : (
            <Container maxWidth="md" sx={{ my: 2 }}>
              <Typography
                variant="h5"
                component="h5"
                align="center"
                gutterBottom
                sx={{ mb: 2 }}
              >
                Welcome to SciPhi, an educational AI.
              </Typography>
              <Grid container spacing={2}>
                {template.map((item, index) => (
                  <Grid item xs={12} sm={6} md={6} key={index}>
                    <Card
                      variant="outlined"
                      onClick={() => setFormValue(item.prompt)}
                    >
                      <CardActionArea>
                        <CardHeader title={item.title} />
                        <CardContent>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                          >
                            {item.prompt}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          )}

          {thinking && <Thinking />}
          <span ref={messagesEndRef}></span>
          <Box sx={{ height: "96px", marginBottom: "96px" }}> </Box>
        </Box>

        <AppBar
          position="fixed"
          color="primary"
          sx={{
            top: "auto",
            bottom: 0,
            width: { sm: `calc(100% - ${280}px)` },
            ml: { sm: `${280}px` },
            p: 2,
          }}
        >
          <form
            onSubmit={sendMessage}
            disabled={thinking || formValue === ""}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextField
              id="outlined-multiline-static"
              multiline
              inputRef={inputRef}
              value={formValue}
              fullWidth
              onChange={(e) => setFormValue(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {" "}
                    <IconButton
                      disabled={thinking || formValue === ""}
                      onClick={(e) => sendMessage(e)}
                    >
                      <Send />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onKeyUp={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey &&
                  !thinking &&
                  formValue
                ) {
                  sendMessage(e);
                }
              }}
              sx={{ overflow: "scroll", maxHeight: "96px" }}
            />
          </form>
        </AppBar>
      </Box>
    </>
  );
};

export default ChatView;
