import { GoetheLevel } from './base-level-handler';
import { GoetheA1Handler } from './a1-handler';
import { GoetheB2Handler } from './b2-handler';
import { GoetheDifficulty } from '../types';

/**
 * Registry for all Goethe level handlers
 * This allows easy access to the appropriate handler for each CEFR level
 */
export class GoetheLevelRegistry {
  private static instance: GoetheLevelRegistry;
  private handlers: Map<string, GoetheLevel> = new Map();
  
  private constructor() {
    // Register all handlers
    this.registerHandler(new GoetheA1Handler());
    this.registerHandler(new GoetheB2Handler());
    
    // TODO: Register handlers for A2, B1, C1, C2
    // this.registerHandler(new GoetheA2Handler());
    // this.registerHandler(new GoetheB1Handler());
    // this.registerHandler(new GoetheC1Handler());
    // this.registerHandler(new GoetheC2Handler());
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): GoetheLevelRegistry {
    if (!GoetheLevelRegistry.instance) {
      GoetheLevelRegistry.instance = new GoetheLevelRegistry();
    }
    return GoetheLevelRegistry.instance;
  }
  
  /**
   * Register a handler for a specific CEFR level
   */
  private registerHandler(handler: GoetheLevel): void {
    const level = handler.getLevel();
    this.handlers.set(level.cefr, handler);
  }
  
  /**
   * Get a handler for a specific CEFR level
   */
  public getHandler(cefr: string): GoetheLevel | undefined {
    return this.handlers.get(cefr);
  }
  
  /**
   * Get a handler based on a difficulty object
   */
  public getHandlerForDifficulty(difficulty: GoetheDifficulty): GoetheLevel | undefined {
    return this.getHandler(difficulty.cefr);
  }
  
  /**
   * Get all available handlers
   */
  public getAllHandlers(): GoetheLevel[] {
    return Array.from(this.handlers.values());
  }
  
  /**
   * Get all supported CEFR levels
   */
  public getAllLevels(): string[] {
    return Array.from(this.handlers.keys());
  }
} 