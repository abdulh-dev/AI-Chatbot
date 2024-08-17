'use client'
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Hi, I am a QuestNav support agent. How can I assist you with today?'
  }]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    const currentMessage = message; // Capture the current message
    setMessage(''); // Clear the input field

    // Add user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: currentMessage }, // Use the captured message
      { role: 'assistant', content: '' }, // Placeholder for assistant's response
    ]);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `---`, // Replace with your actual API key

          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "meta-llama/llama-3.1-8b-instruct:free",
          "messages": [
            ...messages, // Previous messages
            { role: 'user', content: currentMessage }, // Add the current message to the conversation
          ],
        }),
      });

      const data = await response.json();
      const assistantResponse = data.choices[0].message.content;

      // Update assistant's message with the response from the API
      setMessages((prevMessages) => {
        let lastMessage = prevMessages[prevMessages.length - 1];
        let otherMessages = prevMessages.slice(0, prevMessages.length - 1);
        return [
          ...otherMessages,
          {
            ...lastMessage,
            content: assistantResponse,
          },
        ];
      });
    } catch (error) {
      console.error('Error:', error);
      // Handle error by updating the assistant's message
      setMessages((prevMessages) => {
        let lastMessage = prevMessages[prevMessages.length - 1];
        let otherMessages = prevMessages.slice(0, prevMessages.length - 1);
        return [
          ...otherMessages,
          {
            ...lastMessage,
            content: "Sorry, something went wrong. Please try again.",
          },
        ];
      });
    }
  };

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction="column"
        width="600px"
        height="700px"
        border="1px solid black"
        p={2}
        spacing={2}
      >
        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box 
              key={index} 
              display='flex' 
              justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={
                  message.role === 'assistant'
                    ? 'primary.main'
                    : 'secondary.main'
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            label="message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>Send</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
