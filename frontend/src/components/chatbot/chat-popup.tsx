// chat-popup.tsx
"use client";

import type React from "react";
import { useState, useRef, useEffect, JSX } from "react";
import styles from "./chat-popup.module.css";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Xin chào! Tôi có thể giúp bạn điều gì? 😊",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [input]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: currentInput,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.data || "Xin lỗi, tôi không nhận được phản hồi.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling API:", error);

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Xin lỗi, đã có lỗi xảy ra khi kết nối đến server. Vui lòng thử lại.",
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        text: "Xin chào! Tôi có thể giúp bạn điều gì? 😊",
        sender: "ai",
        timestamp: new Date(),
      },
    ]);
  };

  const renderMessageContent = (text: string) => {
    // Parse markdown-style formatting
    const parseMarkdown = (content: string) => {
      const parts = [];
      let currentIndex = 0;

      // Regex patterns for different markdown elements
      const patterns = [
        { type: "code-block", regex: /```(\w+)?\n([\s\S]*?)```/g },
        { type: "inline-code", regex: /`([^`]+)`/g },
        { type: "bold", regex: /\*\*([^*]+)\*\*/g },
        { type: "italic", regex: /\*([^*]+)\*/g },
        { type: "heading", regex: /^(#{1,6})\s+(.+)$/gm },
        { type: "list-item", regex: /^[\*\-]\s+(.+)$/gm },
      ];

      // First, handle code blocks (highest priority)
      const codeBlocks: any[] = [];
      let tempText = content.replace(
        /```(\w+)?\n([\s\S]*?)```/g,
        (match, lang, code, offset) => {
          const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
          codeBlocks.push({ lang: lang || "text", code: code.trim(), offset });
          return placeholder;
        }
      );

      // Split by code block placeholders
      const segments = tempText.split(/(__CODE_BLOCK_\d+__)/);

      return segments.map((segment, segIdx) => {
        // Check if this is a code block placeholder
        const codeBlockMatch = segment.match(/__CODE_BLOCK_(\d+)__/);
        if (codeBlockMatch) {
          const block = codeBlocks[parseInt(codeBlockMatch[1])];
          return (
            <div key={`code-${segIdx}`} className={styles.codeBlockWrapper}>
              <div className={styles.codeBlockHeader}>{block.lang}</div>
              <pre className={styles.codeBlockPre}>
                <code>{block.code}</code>
              </pre>
            </div>
          );
        }

        // Parse inline formatting for non-code-block segments
        return parseInlineFormatting(segment, segIdx);
      });
    };

    const parseInlineFormatting = (text: string, baseKey: number) => {
      const elements: JSX.Element[] = [];
      let remaining = text;
      let key = 0;

      // Process line by line to handle headings and lists
      const lines = remaining.split("\n");

      lines.forEach((line, lineIdx) => {
        // Check for headings
        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          const HeadingTag = `h${Math.min(
            level + 2,
            6
          )}` as keyof JSX.IntrinsicElements;
          elements.push(
            <HeadingTag
              key={`${baseKey}-h-${lineIdx}`}
              className={styles.heading}
            >
              {parseInlineElements(headingMatch[2], `${baseKey}-h-${lineIdx}`)}
            </HeadingTag>
          );
          return;
        }

        // Check for list items
        const listMatch = line.match(/^[\*\-]\s+(.+)$/);
        if (listMatch) {
          elements.push(
            <div key={`${baseKey}-li-${lineIdx}`} className={styles.listItem}>
              <span className={styles.bullet}>•</span>
              {parseInlineElements(listMatch[1], `${baseKey}-li-${lineIdx}`)}
            </div>
          );
          return;
        }

        // Regular text with inline formatting
        if (line.trim()) {
          elements.push(
            <div key={`${baseKey}-p-${lineIdx}`}>
              {parseInlineElements(line, `${baseKey}-p-${lineIdx}`)}
            </div>
          );
        } else if (lineIdx < lines.length - 1) {
          elements.push(<br key={`${baseKey}-br-${lineIdx}`} />);
        }
      });

      return elements;
    };

    const parseInlineElements = (text: string, baseKey: string | number) => {
      const parts: JSX.Element[] = [];
      let remaining = text;
      let index = 0;

      while (remaining.length > 0) {
        // Try to match bold (**text**)
        const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
        if (boldMatch) {
          parts.push(
            <strong key={`${baseKey}-b-${index}`} className={styles.bold}>
              {boldMatch[1]}
            </strong>
          );
          remaining = remaining.slice(boldMatch[0].length);
          index++;
          continue;
        }

        // Try to match italic (*text*)
        const italicMatch = remaining.match(/^\*([^*]+)\*/);
        if (italicMatch) {
          parts.push(
            <em key={`${baseKey}-i-${index}`} className={styles.italic}>
              {italicMatch[1]}
            </em>
          );
          remaining = remaining.slice(italicMatch[0].length);
          index++;
          continue;
        }

        // Try to match inline code (`code`)
        const inlineCodeMatch = remaining.match(/^`([^`]+)`/);
        if (inlineCodeMatch) {
          parts.push(
            <code key={`${baseKey}-c-${index}`} className={styles.inlineCode}>
              {inlineCodeMatch[1]}
            </code>
          );
          remaining = remaining.slice(inlineCodeMatch[0].length);
          index++;
          continue;
        }

        // Find next special character
        const nextSpecial = remaining.search(/[\*`]/);
        if (nextSpecial === -1) {
          // No more special characters, add remaining text
          parts.push(<span key={`${baseKey}-t-${index}`}>{remaining}</span>);
          break;
        }

        // Add text before next special character
        if (nextSpecial > 0) {
          parts.push(
            <span key={`${baseKey}-t-${index}`}>
              {remaining.slice(0, nextSpecial)}
            </span>
          );
          remaining = remaining.slice(nextSpecial);
          index++;
        } else {
          // Special character at start but didn't match, treat as regular text
          parts.push(<span key={`${baseKey}-t-${index}`}>{remaining[0]}</span>);
          remaining = remaining.slice(1);
          index++;
        }
      }

      return parts;
    };

    return <div className={styles.messageContent}>{parseMarkdown(text)}</div>;
  };

  return (
    <div className={styles.container}>
      {!isOpen && (
        <button
          className={styles.chatButton}
          onClick={() => setIsOpen(true)}
          aria-label="Mở chat"
        >
          💬
        </button>
      )}

      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <h2 className={styles.title}>AI Assistant</h2>
            <div className={styles.headerButtons}>
              <button
                onClick={clearChat}
                className={styles.clearButton}
                aria-label="Xóa nội dung chat"
                title="Xóa nội dung chat"
              >
                🗑️
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className={styles.closeButton}
                aria-label="Đóng chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className={styles.messagesContainer}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${styles.messageWrapper} ${styles[message.sender]}`}
              >
                <div className={styles.messageBubble}>
                  {renderMessageContent(message.text)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.messageWrapper} ${styles.ai}`}>
                <div className={styles.messageBubble}>
                  <div className={styles.loadingDots}>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                    <div className={styles.dot}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className={styles.inputContainer}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              disabled={isLoading}
              rows={1}
              className={styles.textarea}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className={styles.sendButton}
              aria-label="Gửi tin nhắn"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
