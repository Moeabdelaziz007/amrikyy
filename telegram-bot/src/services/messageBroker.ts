import { redisClient } from './redis.js';
import { logger } from '../utils/logger.js';

export interface EventSchema {
  event_id: string;
  source: string;
  type: string;
  payload: any;
  timestamp: string;
  correlation_id?: string;
}

class MessageBroker {
  private streamName = 'a2a-events';

  async initialize(): Promise<void> {
    // Create consumer group if it doesn't exist
    try {
      await redisClient.xGroupCreate(this.streamName, 'telegram-group', '$', {
        MKSTREAM: true
      });
    } catch (error: any) {
      if (!error.message.includes('BUSYGROUP')) {
        logger.error('Telegram Bot: Failed to create consumer group:', error);
        throw error;
      }
    }
  }

  async subscribeToEvents(consumerName: string, callback: (event: EventSchema) => Promise<void>): Promise<void> {
    try {
      while (true) {
        const messages = await redisClient.xReadGroup(
          'telegram-group',
          consumerName,
          {
            key: this.streamName,
            id: '>'
          },
          {
            COUNT: 10,
            BLOCK: 1000
          }
        );

        if (messages) {
          for (const stream of messages) {
            for (const message of stream.messages) {
              const event: EventSchema = {
                event_id: message.message.event_id,
                source: message.message.source,
                type: message.message.type,
                payload: JSON.parse(message.message.payload),
                timestamp: message.message.timestamp,
                correlation_id: message.message.correlation_id
              };

              try {
                await callback(event);
                await redisClient.xAck(this.streamName, 'telegram-group', message.id);
                logger.info(`Telegram Bot: Event processed: ${event.event_id}`);
              } catch (error) {
                logger.error(`Telegram Bot: Failed to process event ${event.event_id}:`, error);
              }
            }
          }
        }
      }
    } catch (error) {
      logger.error('Telegram Bot: Error in event subscription:', error);
      throw error;
    }
  }

  async publishEvent(event: Omit<EventSchema, 'event_id' | 'timestamp'>): Promise<string> {
    const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    const fullEvent: EventSchema = {
      ...event,
      event_id: eventId,
      timestamp
    };

    try {
      const result = await redisClient.xAdd(this.streamName, '*', {
        event_id: fullEvent.event_id,
        source: fullEvent.source,
        type: fullEvent.type,
        payload: JSON.stringify(fullEvent.payload),
        timestamp: fullEvent.timestamp,
        correlation_id: fullEvent.correlation_id || ''
      });

      logger.info(`Telegram Bot: Event published: ${eventId}`, { event: fullEvent });
      return result;
    } catch (error) {
      logger.error('Telegram Bot: Failed to publish event:', error);
      throw error;
    }
  }
}

export const messageBroker = new MessageBroker();
