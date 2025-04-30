// ChatMessage.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import Markdown from 'react-native-markdown-display';
import MathView from 'react-native-math-view';
import Tts from 'react-native-tts';

type Props = {
  isUser: boolean;
  text: string;
};

export const ChatMessage = ({ isUser, text }: Props) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const stripMarkdownAndMath = (input: string): string => {
    return input
      // Remove block math $$...$$ → keep content
      .replace(/\$\$(.*?)\$\$/gs, (_, content) => convertLatexToPlainText(content))
      // Remove inline math $...$ → keep content
      .replace(/\$(.*?)\$/g, (_, content) => convertLatexToPlainText(content))
      // Remove bold/italic markdown **...**, __...__, _..._
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/__(.*?)__/g, '$1')
      .replace(/_(.*?)_/g, '$1')
      // Remove inline code `...`
      .replace(/`(.*?)`/g, '$1')
      // Remove headers and markdown symbols
      .replace(/^#+\s?/gm, '')
      // Collapse multiple spaces
      .replace(/\s+/g, ' ')
      .trim();
  };
  
  // Optional: map common LaTeX to readable symbols
  const convertLatexToPlainText = (latex: string): string => {
    return latex
      .replace(/\\int/g, '∫')
      .replace(/\\sum/g, '∑')
      .replace(/\\sqrt/g, '√')
      .replace(/\\frac{([^}]+)}{([^}]+)}/g, '$1/$2') // \frac{a}{b} → a/b
      .replace(/\\pi/g, 'π')
      .replace(/_/g, '') // Optional: remove underscores
      .replace(/\^/g, '^'); // Leave exponent marker or customize further
  };

  const renderMath = (content: string) => {
    return <MathView math={content} />;
  };

  const parseMarkdown = (text: string) => {
    const mathRegex = /\$\$([\s\S]+?)\$\$|\$([^\$]+?)\$/g;

    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mathRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.substring(lastIndex, match.index),
        });
      }

      parts.push({
        type: 'math',
        content: match[1] || match[2],
        block: !!match[1],
      });

      lastIndex = mathRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.slice(lastIndex) });
    }

    return parts.map((part, idx) =>
      part.type === 'text' ? (
        <Markdown key={idx} style={markdownStyles}>
          {part.content}
        </Markdown>
      ) : (
        <View key={idx} style={{ marginVertical: 4 }}>
          {renderMath(part.content)}
        </View>
      )
    );
  };

  return (
    <Animated.View style={[styles.container, isUser ? styles.user : styles.agent, { opacity }]}>
      <View style={styles.bubble}>{parseMarkdown(text)}</View>
      {!isUser&&<TouchableOpacity style={styles.speakerButton} onPress={() => {console.log('Speaker pressed');Tts.getInitStatus().then(() => {
  Tts.speak(stripMarkdownAndMath(text));
});}}>
    <Text style={styles.speakerButtonText}>Speaker</Text>
  </TouchableOpacity>}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  user: {
    alignSelf: 'flex-end',
  },
  agent: {
    alignSelf: 'flex-start',
  },
  bubble: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 12,
  },
  speakerButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#007AFF',
    borderRadius: 6,
    alignSelf: 'flex-start', // or 'flex-end' depending on layout
  },
  
  speakerButtonText: {
    color: '#fff',
    fontWeight: '600',
  }
});

const markdownStyles = {
  text: {
    fontSize: 16,
    color: '#333',
  },
};
