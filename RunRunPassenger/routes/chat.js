const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');

// Mock data for chat sessions and messages
let chatSessions = [
  {
    id: 1,
    user_id: 1,
    user_name: 'João Silva',
    user_type: 'passenger',
    status: 'active',
    last_message: 'Olá, preciso de ajuda com meu pedido',
    last_message_time: new Date().toISOString(),
    unread_count: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    user_id: 4,
    user_name: 'Maria Santos',
    user_type: 'driver',
    status: 'waiting',
    last_message: 'Como funciona o sistema de pagamentos?',
    last_message_time: new Date(Date.now() - 300000).toISOString(),
    unread_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

let chatMessages = {
  1: [
    {
      id: 1,
      session_id: 1,
      sender_id: 1,
      sender_name: 'João Silva',
      sender_type: 'user',
      message: 'Olá, preciso de ajuda com meu pedido',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      is_read: true
    },
    {
      id: 2,
      session_id: 1,
      sender_id: 0,
      sender_name: 'Support Agent',
      sender_type: 'operator',
      message: 'Olá João! Como posso ajudar você hoje?',
      timestamp: new Date(Date.now() - 1700000).toISOString(),
      is_read: true
    },
    {
      id: 3,
      session_id: 1,
      sender_id: 1,
      sender_name: 'João Silva',
      sender_type: 'user',
      message: 'O motorista não apareceu no local combinado',
      timestamp: new Date(Date.now() - 1600000).toISOString(),
      is_read: false
    }
  ],
  2: [
    {
      id: 4,
      session_id: 2,
      sender_id: 4,
      sender_name: 'Maria Santos',
      sender_type: 'user',
      message: 'Como funciona o sistema de pagamentos?',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      is_read: true
    }
  ]
};

// Get all chat sessions for support staff
router.get('/sessions', authenticateToken, requireRole(['admin', 'employee']), (req, res) => {
  try {
    res.json({
      success: true,
      data: chatSessions
    });
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat sessions'
    });
  }
});

// Get messages for a specific chat session
router.get('/messages/:sessionId', authenticateToken, requireRole(['admin', 'employee']), (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const messages = chatMessages[sessionId] || [];

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch chat messages'
    });
  }
});

// Send a message in a chat session
router.post('/messages/:sessionId', authenticateToken, requireRole(['admin', 'employee']), (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const newMessage = {
      id: Date.now(),
      session_id: sessionId,
      sender_id: req.user.id,
      sender_name: req.user.name || 'Support Agent',
      sender_type: 'operator',
      message: message.trim(),
      timestamp: new Date().toISOString(),
      is_read: true
    };

    if (!chatMessages[sessionId]) {
      chatMessages[sessionId] = [];
    }

    chatMessages[sessionId].push(newMessage);

    // Update session's last message
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      session.last_message = message.trim();
      session.last_message_time = new Date().toISOString();
      session.updated_at = new Date().toISOString();
    }

    res.json({
      success: true,
      data: newMessage
    });
  } catch (error) {
    console.error('Error sending chat message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
});

// Update chat session status
router.put('/sessions/:sessionId/status', authenticateToken, requireRole(['admin', 'employee']), (req, res) => {
  try {
    const sessionId = parseInt(req.params.sessionId);
    const { status } = req.body;

    const validStatuses = ['active', 'waiting', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const session = chatSessions.find(s => s.id === sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Chat session not found'
      });
    }

    session.status = status;
    session.updated_at = new Date().toISOString();

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error updating chat session status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update session status'
    });
  }
});

// Create a new chat session (for when users initiate chat)
router.post('/sessions', authenticateToken, (req, res) => {
  try {
    const { user_type, initial_message } = req.body;

    const newSession = {
      id: Date.now(),
      user_id: req.user.id,
      user_name: req.user.name,
      user_type: user_type || 'passenger',
      status: 'waiting',
      last_message: initial_message || 'Olá, preciso de ajuda',
      last_message_time: new Date().toISOString(),
      unread_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    chatSessions.push(newSession);

    // Add initial message
    chatMessages[newSession.id] = [{
      id: Date.now(),
      session_id: newSession.id,
      sender_id: req.user.id,
      sender_name: req.user.name,
      sender_type: 'user',
      message: initial_message || 'Olá, preciso de ajuda',
      timestamp: new Date().toISOString(),
      is_read: false
    }];

    res.json({
      success: true,
      data: newSession
    });
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create chat session'
    });
  }
});

module.exports = router;

// Export chat data for use in Socket.IO
module.exports.chatSessions = chatSessions;
module.exports.chatMessages = chatMessages;
