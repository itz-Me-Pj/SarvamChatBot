import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FlatList, TextInput, View, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
import { ChatMessage } from './ChatMessage';
import { RESULTS } from 'react-native-permissions';
import { useCheckSpeechRecPermissions, useRequestSpeechRecPermissions } from './hooks/speechPermissionHook';
import axios from 'axios';


const ChatScreen = () => {
  const [messages, setMessages] = useState<{ id: string; text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [dots, setDots] = useState('');
  const opacity = new Animated.Value(1);
  const [userMicPermissionGranted, setUserMicPermissionGranted] =
    useState(false);
  const [isListening, setIsListening] = useState(false);

  // let silenceTimer: NodeJS.Timeout | null = null;

  const typingInterval = useRef<any>(null);

  

  // Simulate "typing" dots animation

  useEffect(() => {
    if (isThinking) {
      typingInterval.current = setInterval(() => {
        setDots((prev) => (prev === '...' ? '' : prev + '.'));
      }, 500);
    } else {
      clearInterval(typingInterval.current);
      setDots('');
    }

    return () => clearInterval(typingInterval.current);
  }, [isThinking]);

  const sendMessage = () => {
    const userMessage = { id: Date.now() + '-user', text: input, isUser: true };
    setMessages((prev) => [userMessage, ...prev]);
    sendMessageToLLM(input); // Pass the input text
    setInput('');
  };
  



  const sendMessageToLLM = async (userInput) => {
    setIsThinking(true)
       await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=YOUR_API_Key',
        {
          contents: [
            {
              parts: [{ text: userInput }]
            }
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then((response) => {
        const aiMessage = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiMessage) {
          console.log('Gemini says:', aiMessage);
          setMessages((prev) => [
            { id: Date.now() + '-ai', text: aiMessage, isUser: false },
            ...prev,
          ]);
          // Optionally update UI or state here
        } else {
          console.warn('No message returned:', response.data);
        }
      })
      .catch((error) => {
        console.error('Gemini API error:', error.response?.data || error.message);
      }).finally(()=>{setIsThinking(false)})
      
  }
  
  
  
  
//   function splitMarkdownAndLatex(text: string) {
//     const latexRegex = /\$\$([\s\S]+?)\$\$|\$([^\$]+)\$/g;
//     const parts: { type: 'markdown' | 'latex'; content: string }[] = [];
//     let lastIndex = 0;
//     let match;
  
//     while ((match = latexRegex.exec(text)) !== null) {
//       if (match.index > lastIndex) {
//         parts.push({ type: 'markdown', content: text.slice(lastIndex, match.index) });
//       }
//       const latex = match[1] || match[2];
//       parts.push({ type: 'latex', content: latex });
//       lastIndex = latexRegex.lastIndex;
//     }
  
//     if (lastIndex < text.length) {
//       parts.push({ type: 'markdown', content: text.slice(lastIndex) });
//     }
  
//     return parts;
//   }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatMessage isUser={item.isUser} text={item.text} />}
        inverted
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
      />

      {isThinking && (
        <Animated.View
          style={[styles.typingIndicator, { opacity: opacity }]}>
          <Text style={styles.typingText}>Typing{dots}</Text>
        </Animated.View>
      )}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          placeholderTextColor={'white'}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={{ color: 'white' }}>{input!==''?'Send':'Voice'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#343541' },
  typingIndicator: {
    position: 'absolute',
    bottom: 80,
    left: 20,
  },
  typingText: {
    color: '#E8E8E8',
    fontSize: 16,
    fontWeight: '600',
  },
  inputBar: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical:18,
    borderTopWidth: 1,
    borderColor: '#444654',
    backgroundColor: '#444654',
  },
  input: {
    flex: 1,
    borderColor: '#555',
    backgroundColor: '#3C3F4A',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize:18,
    color: 'white',
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: '#10A37F',
    paddingHorizontal: 16,
    borderRadius: 8,
    fontSize:14,
    justifyContent: 'center',
  },
});

export default ChatScreen;
