import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';

// Global log storage
global.debugLogs = [];
global.maxLogs = 200;

// Override console methods to capture logs
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = (...args) => {
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(' ');
  
  global.debugLogs.push({
    type: 'log',
    message,
    timestamp: new Date().toISOString(),
  });
  
  if (global.debugLogs.length > global.maxLogs) {
    global.debugLogs.shift();
  }
  
  originalLog(...args);
};

console.error = (...args) => {
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(' ');
  
  global.debugLogs.push({
    type: 'error',
    message,
    timestamp: new Date().toISOString(),
  });
  
  if (global.debugLogs.length > global.maxLogs) {
    global.debugLogs.shift();
  }
  
  originalError(...args);
};

console.warn = (...args) => {
  const message = args.map(arg => 
    typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
  ).join(' ');
  
  global.debugLogs.push({
    type: 'warn',
    message,
    timestamp: new Date().toISOString(),
  });
  
  if (global.debugLogs.length > global.maxLogs) {
    global.debugLogs.shift();
  }
  
  originalWarn(...args);
};

export default function DebugLogsScreen({ navigation }) {
  const [logs, setLogs] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    updateLogs();
    
    if (autoRefresh) {
      const interval = setInterval(updateLogs, 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const updateLogs = () => {
    setLogs([...global.debugLogs]);
  };

  const clearLogs = () => {
    global.debugLogs = [];
    setLogs([]);
  };

  const shareLogs = async () => {
    const logsText = logs.map(log => 
      `[${log.timestamp}] [${log.type.toUpperCase()}] ${log.message}`
    ).join('\n\n');
    
    try {
      await Share.share({
        message: logsText,
        title: 'Run Run Debug Logs',
      });
    } catch (error) {
      console.error('Error sharing logs:', error);
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'error': return '#ff0000';
      case 'warn': return '#ff9800';
      default: return '#000000';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Debug Logs ({logs.length})</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.refreshButton]}
            onPress={() => setAutoRefresh(!autoRefresh)}
          >
            <Text style={styles.buttonText}>
              {autoRefresh ? '⏸ Pause' : '▶ Resume'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.clearButton]}
            onPress={clearLogs}
          >
            <Text style={styles.buttonText}>🗑️ Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.shareButton]}
            onPress={shareLogs}
          >
            <Text style={styles.buttonText}>📤 Share</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        style={styles.logsContainer}
        ref={ref => {
          if (ref && autoRefresh) {
            ref.scrollToEnd({ animated: true });
          }
        }}
      >
        {logs.map((log, index) => (
          <View key={index} style={styles.logItem}>
            <Text style={styles.timestamp}>
              {new Date(log.timestamp).toLocaleTimeString()}
            </Text>
            <Text style={[styles.logText, { color: getLogColor(log.type) }]}>
              [{log.type.toUpperCase()}] {log.message}
            </Text>
          </View>
        ))}
        {logs.length === 0 && (
          <Text style={styles.emptyText}>No logs yet. Use the app to see logs here.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  refreshButton: {
    backgroundColor: '#2196F3',
  },
  clearButton: {
    backgroundColor: '#f44336',
  },
  shareButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
  },
  logsContainer: {
    flex: 1,
    padding: 10,
  },
  logItem: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#FF6B00',
  },
  timestamp: {
    fontSize: 10,
    color: '#666',
    marginBottom: 3,
  },
  logText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 16,
  },
});
