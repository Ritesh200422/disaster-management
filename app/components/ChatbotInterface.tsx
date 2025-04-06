'use client';

import { useState, FormEvent } from 'react';

type MessageRole = 'user' | 'system';
interface ChatMessage {
    role: MessageRole;
    content: string;
}

export default function ChatbotInterface() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'system', content: 'How can I help you during this emergency?' }
    ]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        // Add user message to chat
        const userMessage: ChatMessage = { role: 'user', content: inputMessage };
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setLoading(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: inputMessage,
                    disasterType: 'flood' // This would come from context in a real app
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'system', content: data.response }]);
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, {
                role: 'system',
                content: "I'm sorry, I'm having trouble connecting to the emergency guidance system."
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <div className="card-header bg-info text-white">
                <h4 className="mb-0">Emergency Guidance Assistant</h4>
            </div>
            <div className="card-body">
                <div
                    className="mb-3 d-flex flex-column"
                    style={{
                        height: '300px',
                        overflowY: 'auto',
                        border: '1px solid #dee2e6',
                        borderRadius: '0.25rem',
                        padding: '10px',
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.role}`}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '18px',
                                marginBottom: '8px',
                                maxWidth: '80%',
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.role === 'user' ? '#007bff' : '#e9ecef',
                                color: msg.role === 'user' ? 'white' : 'black',
                                border: msg.role === 'system' ? '1px solid #dee2e6' : 'none',
                                wordBreak: 'break-word'
                            }}
                        >
                            {msg.content}
                        </div>
                    ))}
                    {loading && (
                        <div className="system-message" style={{ alignSelf: 'flex-start' }}>
                            <div className="spinner-border spinner-border-sm text-secondary me-2" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <span className="text-muted">Thinking...</span>
                        </div>
                    )}
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ask for emergency guidance..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            disabled={loading}
                            aria-label="Chat input"
                        />
                        <button
                            className="btn btn-primary"
                            type="submit"
                            disabled={loading || !inputMessage.trim()}
                            aria-label="Send message"
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                                    Sending...
                                </>
                            ) : (
                                'Send'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}