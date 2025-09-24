#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
A2A SDK for Python Applications
SDK للتطبيقات الخارجية للتفاعل مع نظام A2A
"""

import asyncio
import json
import logging
import time
from typing import Dict, List, Optional, Any, Callable, Union
from dataclasses import dataclass
from datetime import datetime
import aiohttp
import websockets
from websockets.exceptions import ConnectionClosed, WebSocketException

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class A2AConfig:
    """Configuration for A2A Client"""
    gateway_url: str
    api_key: Optional[str] = None
    token: Optional[str] = None
    timeout: int = 30
    retries: int = 3
    retry_delay: int = 1
    max_reconnect_attempts: int = 5

@dataclass
class A2AMessage:
    """A2A Message structure"""
    id: str
    type: str
    source: str
    target: str
    payload: Any
    timestamp: str
    correlation_id: Optional[str] = None
    priority: str = 'normal'

@dataclass
class A2AHealthStatus:
    """Health status structure"""
    overall: str
    checks: List[Dict[str, Any]]
    timestamp: str

class A2AClient:
    """A2A Client for Python applications"""
    
    def __init__(self, config: A2AConfig):
        self.config = config
        self.session: Optional[aiohttp.ClientSession] = None
        self.websocket: Optional[websockets.WebSocketServerProtocol] = None
        self.is_connected = False
        self.reconnect_attempts = 0
        self.subscribed_topics: set = set()
        self.message_handlers: Dict[str, Callable] = {}
        
        # Event callbacks
        self.on_connected: Optional[Callable] = None
        self.on_disconnected: Optional[Callable] = None
        self.on_authenticated: Optional[Callable] = None
        self.on_error: Optional[Callable] = None
        self.on_message: Optional[Callable] = None

    async def __aenter__(self):
        """Async context manager entry"""
        await self.connect()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        await self.disconnect()

    async def connect(self):
        """Initialize HTTP session"""
        if not self.session:
            timeout = aiohttp.ClientTimeout(total=self.config.timeout)
            self.session = aiohttp.ClientSession(timeout=timeout)

    async def disconnect(self):
        """Clean up connections"""
        if self.websocket:
            await self.websocket.close()
            self.websocket = None
        
        if self.session:
            await self.session.close()
            self.session = None
        
        self.is_connected = False

    def _get_headers(self) -> Dict[str, str]:
        """Get authentication headers"""
        headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'A2A-SDK-Python/1.0.0'
        }
        
        if self.config.api_key:
            headers['Authorization'] = f'Bearer {self.config.api_key}'
        elif self.config.token:
            headers['Authorization'] = f'Bearer {self.config.token}'
        
        return headers

    # Authentication methods
    async def login(self, username: str, password: str) -> Dict[str, Any]:
        """Login and get authentication token"""
        try:
            async with self.session.post(
                f"{self.config.gateway_url}/api/auth/login",
                json={'username': username, 'password': password},
                headers=self._get_headers()
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    self.config.token = data['token']
                    if self.on_authenticated:
                        self.on_authenticated(data['user'])
                    return data
                else:
                    error_data = await response.json()
                    raise Exception(f"Login failed: {error_data.get('message', 'Unknown error')}")
        except Exception as e:
            if self.on_error:
                self.on_error(e)
            raise

    async def register(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Register new user"""
        try:
            async with self.session.post(
                f"{self.config.gateway_url}/api/auth/register",
                json=user_data,
                headers=self._get_headers()
            ) as response:
                if response.status == 201:
                    data = await response.json()
                    return data
                else:
                    error_data = await response.json()
                    raise Exception(f"Registration failed: {error_data.get('message', 'Unknown error')}")
        except Exception as e:
            if self.on_error:
                self.on_error(e)
            raise

    async def refresh_token(self) -> Dict[str, Any]:
        """Refresh authentication token"""
        try:
            async with self.session.post(
                f"{self.config.gateway_url}/api/auth/refresh",
                json={'token': self.config.token},
                headers=self._get_headers()
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    self.config.token = data['token']
                    return data
                else:
                    error_data = await response.json()
                    raise Exception(f"Token refresh failed: {error_data.get('message', 'Unknown error')}")
        except Exception as e:
            if self.on_error:
                self.on_error(e)
            raise

    # Message publishing
    async def publish_message(
        self,
        topic: str,
        message_type: str,
        target: str,
        payload: Any,
        priority: str = 'normal',
        correlation_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Publish message to topic"""
        try:
            message_data = {
                'topic': topic,
                'type': message_type,
                'target': target,
                'payload': payload,
                'priority': priority,
                'correlationId': correlation_id
            }
            
            async with self.session.post(
                f"{self.config.gateway_url}/api/messages/publish",
                json=message_data,
                headers=self._get_headers()
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    return data
                else:
                    error_data = await response.json()
                    raise Exception(f"Publish failed: {error_data.get('message', 'Unknown error')}")
        except Exception as e:
            if self.on_error:
                self.on_error(e)
            raise

    # Message subscription
    async def subscribe_to_topic(
        self,
        topic: str,
        handler_url: Optional[str] = None
    ) -> Dict[str, Any]:
        """Subscribe to topic"""
        try:
            subscription_data = {
                'topic': topic,
                'handler': handler_url
            }
            
            async with self.session.post(
                f"{self.config.gateway_url}/api/messages/subscribe",
                json=subscription_data,
                headers=self._get_headers()
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    self.subscribed_topics.add(topic)
                    return data
                else:
                    error_data = await response.json()
                    raise Exception(f"Subscription failed: {error_data.get('message', 'Unknown error')}")
        except Exception as e:
            if self.on_error:
                self.on_error(e)
            raise

    async def unsubscribe_from_topic(self, topic: str) -> Dict[str, Any]:
        """Unsubscribe from topic"""
        try:
            async with self.session.delete(
                f"{self.config.gateway_url}/api/messages/subscribe/{topic}",
                headers=self._get_headers()
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    self.subscribed_topics.discard(topic)
                    return data
                else:
                    error_data = await response.json()
                    raise Exception(f"Unsubscription failed: {error_data.get('message', 'Unknown error')}")
        except Exception as e:
            if self.on_error:
                self.on_error(e)
            raise

    # WebSocket connection
    async def connect_websocket(self):
        """Connect to WebSocket"""
        try:
            ws_url = self.config.gateway_url.replace('http', 'ws') + '/ws/a2a'
            self.websocket = await websockets.connect(ws_url)
            self.is_connected = True
            self.reconnect_attempts = 0
            
            if self.on_connected:
                self.on_connected()
            
            # Authenticate if token is available
            if self.config.token:
                await self.authenticate_websocket()
            
            # Start listening for messages
            await self._listen_websocket()
            
        except Exception as e:
            if self.on_error:
                self.on_error(e)
            raise

    async def authenticate_websocket(self):
        """Authenticate WebSocket connection"""
        if self.websocket and self.is_connected:
            auth_message = {
                'type': 'auth',
                'payload': {'token': self.config.token}
            }
            await self.websocket.send(json.dumps(auth_message))

    async def _listen_websocket(self):
        """Listen for WebSocket messages"""
        try:
            async for message in self.websocket:
                try:
                    data = json.loads(message)
                    await self._handle_websocket_message(data)
                except json.JSONDecodeError as e:
                    logger.error(f"Failed to parse WebSocket message: {e}")
                    if self.on_error:
                        self.on_error(e)
        except ConnectionClosed:
            self.is_connected = False
            if self.on_disconnected:
                self.on_disconnected()
            await self._attempt_reconnect()
        except WebSocketException as e:
            logger.error(f"WebSocket error: {e}")
            if self.on_error:
                self.on_error(e)

    async def _handle_websocket_message(self, message: Dict[str, Any]):
        """Handle incoming WebSocket message"""
        message_type = message.get('type')
        
        if message_type == 'auth_success':
            if self.on_authenticated:
                self.on_authenticated(message.get('payload'))
        elif message_type == 'auth_error':
            if self.on_error:
                self.on_error(f"Authentication failed: {message.get('payload')}")
        elif message_type == 'subscribe_success':
            logger.info(f"Successfully subscribed to: {message.get('payload', {}).get('topics', [])}")
        elif message_type == 'publish_success':
            logger.info(f"Message published to: {message.get('payload', {}).get('topic')}")
        elif message_type == 'message':
            if self.on_message:
                self.on_message(message.get('payload'))
        elif message_type == 'error':
            if self.on_error:
                self.on_error(f"WebSocket error: {message.get('payload')}")
        else:
            logger.warning(f"Unknown message type: {message_type}")

    async def _attempt_reconnect(self):
        """Attempt to reconnect WebSocket"""
        if self.reconnect_attempts < self.config.max_reconnect_attempts:
            self.reconnect_attempts += 1
            delay = self.config.retry_delay * (2 ** (self.reconnect_attempts - 1))
            
            logger.info(f"Attempting to reconnect in {delay} seconds (attempt {self.reconnect_attempts})")
            await asyncio.sleep(delay)
            
            try:
                await self.connect_websocket()
            except Exception as e:
                logger.error(f"Reconnection attempt {self.reconnect_attempts} failed: {e}")
                if self.reconnect_attempts >= self.config.max_reconnect_attempts:
                    if self.on_error:
                        self.on_error(f"Max reconnection attempts reached: {e}")
        else:
            logger.error("Max reconnection attempts reached")
            if self.on_error:
                self.on_error("Max reconnection attempts reached")

    # WebSocket message publishing
    async def publish_websocket_message(self, topic: str, payload: Any):
        """Publish message via WebSocket"""
        if not self.websocket or not self.is_connected:
            raise Exception("WebSocket not connected")
        
        message = {
            'type': 'publish',
            'payload': {'topic': topic, 'payload': payload}
        }
        await self.websocket.send(json.dumps(message))

    # WebSocket subscription
    async def subscribe_websocket(self, topics: List[str]):
        """Subscribe to topics via WebSocket"""
        if not self.websocket or not self.is_connected:
            raise Exception("WebSocket not connected")
        
        message = {
            'type': 'subscribe',
            'payload': {'topics': topics}
        }
        await self.websocket.send(json.dumps(message))
        self.subscribed_topics.update(topics)

    # Health and status
    async def get_health_status(self) -> A2AHealthStatus:
        """Get system health status"""
        try:
            async with self.session.get(
                f"{self.config.gateway_url}/api/health",
                headers=self._get_headers()
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    return A2AHealthStatus(
                        overall=data['status'],
                        checks=data['checks'],
                        timestamp=data['timestamp']
                    )
                else:
                    error_data = await response.json()
                    raise Exception(f"Health check failed: {error_data.get('message', 'Unknown error')}")
        except Exception as e:
            if self.on_error:
                self.on_error(e)
            raise

    async def get_metrics(self) -> Dict[str, Any]:
        """Get system metrics"""
        try:
            async with self.session.get(
                f"{self.config.gateway_url}/api/metrics",
                headers=self._get_headers()
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    return data['metrics']
                else:
                    error_data = await response.json()
                    raise Exception(f"Metrics retrieval failed: {error_data.get('message', 'Unknown error')}")
        except Exception as e:
            if self.on_error:
                self.on_error(e)
            raise

    async def get_system_status(self) -> Dict[str, Any]:
        """Get system status"""
        try:
            async with self.session.get(
                f"{self.config.gateway_url}/",
                headers=self._get_headers()
            ) as response:
                if response.status == 200:
                    return await response.json()
                else:
                    error_data = await response.json()
                    raise Exception(f"Status retrieval failed: {error_data.get('message', 'Unknown error')}")
        except Exception as e:
            if self.on_error:
                self.on_error(e)
            raise

    # Queue management
    async def get_queue_info(self, queue_name: str) -> Dict[str, Any]:
        """Get queue information"""
        try:
            async with self.session.get(
                f"{self.config.gateway_url}/api/messages/queues/{queue_name}",
                headers=self._get_headers()
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    return data['info']
                else:
                    error_data = await response.json()
                    raise Exception(f"Queue info retrieval failed: {error_data.get('message', 'Unknown error')}")
        except Exception as e:
            if self.on_error:
                self.on_error(e)
            raise

    async def purge_queue(self, queue_name: str):
        """Purge queue"""
        try:
            async with self.session.delete(
                f"{self.config.gateway_url}/api/messages/queues/{queue_name}",
                headers=self._get_headers()
            ) as response:
                if response.status == 200:
                    logger.info(f"Queue {queue_name} purged successfully")
                else:
                    error_data = await response.json()
                    raise Exception(f"Queue purge failed: {error_data.get('message', 'Unknown error')}")
        except Exception as e:
            if self.on_error:
                self.on_error(e)
            raise

    # Custom metrics
    async def record_custom_metric(
        self,
        name: str,
        value: float,
        labels: Optional[Dict[str, str]] = None
    ):
        """Record custom metric"""
        try:
            metric_data = {
                'name': name,
                'value': value,
                'labels': labels or {}
            }
            
            async with self.session.post(
                f"{self.config.gateway_url}/api/metrics/custom",
                json=metric_data,
                headers=self._get_headers()
            ) as response:
                if response.status == 200:
                    logger.info(f"Custom metric {name} recorded: {value}")
                else:
                    error_data = await response.json()
                    raise Exception(f"Metric recording failed: {error_data.get('message', 'Unknown error')}")
        except Exception as e:
            if self.on_error:
                self.on_error(e)
            raise

    async def increment_counter(
        self,
        name: str,
        labels: Optional[Dict[str, str]] = None
    ) -> int:
        """Increment counter"""
        try:
            counter_data = {'labels': labels or {}}
            
            async with self.session.post(
                f"{self.config.gateway_url}/api/metrics/counters/{name}/increment",
                json=counter_data,
                headers=self._get_headers()
            ) as response:
                if response.status == 200:
                    data = await response.json()
                    return data['value']
                else:
                    error_data = await response.json()
                    raise Exception(f"Counter increment failed: {error_data.get('message', 'Unknown error')}")
        except Exception as e:
            if self.on_error:
                self.on_error(e)
            raise

    async def set_gauge(
        self,
        name: str,
        value: float,
        labels: Optional[Dict[str, str]] = None
    ):
        """Set gauge value"""
        try:
            gauge_data = {
                'value': value,
                'labels': labels or {}
            }
            
            async with self.session.post(
                f"{self.config.gateway_url}/api/metrics/gauges/{name}",
                json=gauge_data,
                headers=self._get_headers()
            ) as response:
                if response.status == 200:
                    logger.info(f"Gauge {name} set to: {value}")
                else:
                    error_data = await response.json()
                    raise Exception(f"Gauge setting failed: {error_data.get('message', 'Unknown error')}")
        except Exception as e:
            if self.on_error:
                self.on_error(e)
            raise

    # Utility methods
    def is_websocket_connected(self) -> bool:
        """Check if WebSocket is connected"""
        return self.is_connected and self.websocket and not self.websocket.closed

    def get_subscribed_topics(self) -> List[str]:
        """Get list of subscribed topics"""
        return list(self.subscribed_topics)

    def set_message_handler(self, topic: str, handler: Callable):
        """Set message handler for specific topic"""
        self.message_handlers[topic] = handler

# Factory function
def create_a2a_client(config: A2AConfig) -> A2AClient:
    """Create A2A client instance"""
    return A2AClient(config)

# Example usage
async def main():
    """Example usage of A2A Client"""
    config = A2AConfig(
        gateway_url="http://localhost:3001",
        api_key="your_api_key_here"
    )
    
    async with A2AClient(config) as client:
        # Set event handlers
        client.on_connected = lambda: print("Connected to A2A Gateway")
        client.on_disconnected = lambda: print("Disconnected from A2A Gateway")
        client.on_authenticated = lambda user: print(f"Authenticated as: {user['username']}")
        client.on_error = lambda error: print(f"Error: {error}")
        client.on_message = lambda message: print(f"Received message: {message}")
        
        # Connect WebSocket
        await client.connect_websocket()
        
        # Subscribe to topics
        await client.subscribe_websocket(['test.topic', 'notifications'])
        
        # Publish a message
        await client.publish_message(
            topic="test.topic",
            message_type="notification",
            target="telegram",
            payload={"message": "Hello from Python SDK!"},
            priority="normal"
        )
        
        # Record metrics
        await client.record_custom_metric("python_sdk_usage", 1.0, {"version": "1.0.0"})
        
        # Keep connection alive
        await asyncio.sleep(10)

if __name__ == "__main__":
    asyncio.run(main())
