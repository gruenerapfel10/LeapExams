import { IELTSLevel } from './base-level-handler';
import { IELTSBand7_8Handler } from './band-7-8-handler';
import { IELTSDifficulty } from '../types';

/**
 * Registry for all IELTS level handlers
 * This allows easy access to the appropriate handler for each band level
 */
export class IELTSLevelRegistry {
  private static instance: IELTSLevelRegistry;
  private handlers: Map<string, IELTSLevel> = new Map();
  
  private constructor() {
    // Register all handlers
    this.registerHandler(new IELTSBand7_8Handler());
    
    // TODO: Register handlers for other bands
    // this.registerHandler(new IELTSBand4_5Handler());
    // this.registerHandler(new IELTSBand5_6Handler());
    // this.registerHandler(new IELTSBand6_7Handler());
    // this.registerHandler(new IELTSBand8_9Handler());
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): IELTSLevelRegistry {
    if (!IELTSLevelRegistry.instance) {
      IELTSLevelRegistry.instance = new IELTSLevelRegistry();
    }
    return IELTSLevelRegistry.instance;
  }
  
  /**
   * Register a handler for a specific band level
   */
  private registerHandler(handler: IELTSLevel): void {
    const level = handler.getLevel();
    this.handlers.set(level.id, handler);
  }
  
  /**
   * Get a handler for a specific band level by ID
   */
  public getHandler(bandId: string): IELTSLevel | undefined {
    return this.handlers.get(bandId);
  }
  
  /**
   * Get the closest band handler based on a numeric band score
   */
  public getHandlerForBand(band: number): IELTSLevel | undefined {
    // Find the handler with the closest band value
    let closestHandler: IELTSLevel | undefined;
    let smallestDifference = Infinity;
    
    for (const handler of this.handlers.values()) {
      const difference = Math.abs(handler.getLevel().band - band);
      if (difference < smallestDifference) {
        smallestDifference = difference;
        closestHandler = handler;
      }
    }
    
    return closestHandler;
  }
  
  /**
   * Get a handler based on a difficulty object
   */
  public getHandlerForDifficulty(difficulty: IELTSDifficulty): IELTSLevel | undefined {
    return this.getHandler(difficulty.id);
  }
  
  /**
   * Get all available handlers
   */
  public getAllHandlers(): IELTSLevel[] {
    return Array.from(this.handlers.values());
  }
  
  /**
   * Get all supported band IDs
   */
  public getAllBandIds(): string[] {
    return Array.from(this.handlers.keys());
  }
} 